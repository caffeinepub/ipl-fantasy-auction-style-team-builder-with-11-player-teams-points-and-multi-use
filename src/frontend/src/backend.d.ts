import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PlayerId = bigint;
export interface Player {
    id: PlayerId;
    name: string;
    role: Role;
    team: string;
    totalPoints: Points;
    baseCost: Currency;
}
export type TeamId = bigint;
export type Points = bigint;
export type Currency = bigint;
export interface FantasyTeam {
    id: TeamId;
    playerIds: Array<PlayerId>;
    balance: Currency;
    owner: Principal;
    name: string;
    totalPoints: Points;
}
export interface UserProfile {
    name: string;
}
export enum Role {
    keeper = "keeper",
    allRounder = "allRounder",
    bowler = "bowler",
    batsman = "batsman"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPlayer(name: string, role: Role, teamName: string, baseCost: Currency): Promise<PlayerId>;
    addPlayerToTeam(teamId: TeamId, playerId: PlayerId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFantasyTeam(teamName: string): Promise<TeamId>;
    getAllPlayers(): Promise<Array<Player>>;
    getAllTeamsSortedByName(): Promise<Array<FantasyTeam>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayer(playerId: PlayerId): Promise<Player>;
    getTeam(teamId: TeamId): Promise<FantasyTeam>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTeams(userId: Principal): Promise<Array<FantasyTeam>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    validateTeam(teamId: TeamId): Promise<void>;
}
