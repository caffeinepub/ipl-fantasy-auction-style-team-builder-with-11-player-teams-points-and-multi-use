import Array "mo:core/Array";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type PlayerId = Nat;
  type TeamId = Nat;
  type Points = Nat;
  type Currency = Nat;
  let PLAYER_COST_LIMIT : Nat = 120_000_000;
  let TEAM_COST_LIMIT : Nat = 1_000_000_000;

  // Correctly define the Role type as a variant
  type Role = {
    #batsman;
    #bowler;
    #allRounder;
    #keeper;
  };

  module Player {
    public type Impl = {
      id : PlayerId;
      name : Text;
      role : Role;
      team : Text;
      baseCost : Currency;
      totalPoints : Points;
    };
  };

  module FantasyTeam {
    type Player = Player.Impl;

    public type Impl = {
      id : TeamId;
      owner : Principal;
      name : Text;
      balance : Currency;
      playerIds : [PlayerId];
      totalPoints : Points;
    };

    func calculatePoints(playerIds : [PlayerId]) : Points {
      playerIds.size() * 10;
    };

    public func createNewTeam(id : TeamId, owner : Principal, name : Text) : Impl {
      {
        id;
        owner;
        name;
        balance = TEAM_COST_LIMIT;
        playerIds = [];
        totalPoints = 0;
      };
    };

    public func addPlayer(team : Impl, player : Player) : Impl {
      let newBalance = if (team.balance >= player.baseCost) {
        team.balance - player.baseCost;
      } else {
        Runtime.trap("Insufficient funds. The remaining balance of " # team.balance.toText() # " is not enough to pay the base cost of " # player.baseCost.toText() # " needed for this player.");
      };

      let newPlayerIds = team.playerIds.concat([player.id]);
      {
        team with
        playerIds = newPlayerIds;
        balance = newBalance;
        totalPoints = calculatePoints(newPlayerIds);
      };
    };
  };

  module Team {
    type Impl = FantasyTeam.Impl;

    public func compareByName(team1 : Impl, team2 : Impl) : Order.Order {
      Text.compare(team1.name, team2.name);
    };
  };

  type Player = Player.Impl;
  type FantasyTeam = FantasyTeam.Impl;

  public type UserProfile = {
    name : Text;
  };

  let players = Map.empty<PlayerId, Player>();
  let teams = Map.empty<TeamId, FantasyTeam>();
  let userTeams = Map.empty<Principal, Set.Set<TeamId>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextPlayerId : PlayerId = 1;
  var nextTeamId : TeamId = 1;

  // Helper function to filter out null values
  func isNotNull(team : ?FantasyTeam) : Bool {
    switch (team) {
      case (null) { false };
      case (_) { true };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Fantasy Team Management
  public shared ({ caller }) func createFantasyTeam(teamName : Text) : async TeamId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create fantasy teams");
    };

    let teamId = nextTeamId;
    nextTeamId += 1;

    let team : FantasyTeam = FantasyTeam.createNewTeam(teamId, caller, teamName);
    teams.add(teamId, team);

    let teamSet = switch (userTeams.get(caller)) {
      case (null) {
        let newSet = Set.singleton<TeamId>(teamId);
        userTeams.add(caller, newSet);
        newSet;
      };
      case (?existingSet) {
        existingSet.add(teamId);
        userTeams.add(caller, existingSet);
        existingSet;
      };
    };

    teamId;
  };

  public shared ({ caller }) func addPlayerToTeam(teamId : TeamId, playerId : PlayerId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add players to teams");
    };

    let team = switch (teams.get(teamId)) {
      case (null) { Runtime.trap("Team not found") };
      case (?t) { t };
    };

    if (caller != team.owner) {
      Runtime.trap("Unauthorized: You do not have permission to modify this team");
    };

    let player = switch (players.get(playerId)) {
      case (null) { Runtime.trap("Player not found") };
      case (?p) { p };
    };

    if (team.playerIds.size() >= 11) {
      Runtime.trap("A team can only have 11 players");
    };

    let updatedTeam = FantasyTeam.addPlayer(team, player);
    teams.add(teamId, updatedTeam);
  };

  public query func getAllTeamsSortedByName() : async [FantasyTeam] {
    teams.values().toArray().sort(Team.compareByName);
  };

  public query ({ caller }) func getUserTeams(userId : Principal) : async [FantasyTeam] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own teams");
    };

    switch (userTeams.get(userId)) {
      case (null) { [] };
      case (?teamIdSet) {
        let result = teamIdSet.values().toArray()
          .map(func(teamId) { teams.get(teamId) })
          .filter(isNotNull)
          .map(func(optTeam) { switch (optTeam) { case (?team) { team }; case (null) { Runtime.trap("Unexpected null value") } } });
        result;
      };
    };
  };

  public query ({ caller }) func validateTeam(teamId : TeamId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can validate teams");
    };

    let team = switch (teams.get(teamId)) {
      case (null) { Runtime.trap("Team not found") };
      case (?t) { t };
    };

    if (caller != team.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only validate your own teams");
    };

    if (team.playerIds.size() != 11) {
      Runtime.trap("Team must have exactly 11 players. This team has " # team.playerIds.size().toText() # " players.");
    };
  };

  // Player Management (Admin only)
  public shared ({ caller }) func addPlayer(name : Text, role : Role, teamName : Text, baseCost : Currency) : async PlayerId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add new players");
    };

    if (baseCost > PLAYER_COST_LIMIT) {
      Runtime.trap("Invalid cost: The maximum allowed cost is " # PLAYER_COST_LIMIT.toText());
    };

    let playerId = nextPlayerId;
    nextPlayerId += 1;

    let player : Player = {
      id = playerId;
      name;
      role;
      team = teamName;
      baseCost;
      totalPoints = 0;
    };

    players.add(playerId, player);
    playerId;
  };

  // Public Query Functions (accessible to all including guests)
  public query func getAllPlayers() : async [Player] {
    let playersArray = players.values().toArray();
    playersArray.reverse();
  };

  public query ({ caller }) func getTeam(teamId : TeamId) : async FantasyTeam {
    let team = switch (teams.get(teamId)) {
      case (null) { Runtime.trap("Team not found") };
      case (?team) { team };
    };

    if (caller != team.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own teams");
    };

    team;
  };

  public query func getPlayer(playerId : PlayerId) : async Player {
    switch (players.get(playerId)) {
      case (null) { Runtime.trap("Player not found") };
      case (?player) { player };
    };
  };
};
