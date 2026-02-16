import { useState, useMemo } from 'react';
import { useGetAllPlayers } from '../../hooks/usePlayers';
import { useGetTeam } from '../../hooks/useTeamQueries';
import { useAddPlayerToTeam } from '../../hooks/useTeamMutations';
import PlayerList from '../players/PlayerList';
import PlayerFilters from '../players/PlayerFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Users, Coins, ArrowRight } from 'lucide-react';
import { Role } from '../../backend';
import { formatCurrency } from '../../utils/points';

interface PlayerSelectionStepProps {
  teamId: bigint;
  onContinue: () => void;
}

export default function PlayerSelectionStep({ teamId, onContinue }: PlayerSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  const { data: players = [], isLoading: playersLoading } = useGetAllPlayers();
  const { data: team, isLoading: teamLoading } = useGetTeam(teamId);
  const { mutate: addPlayer, isPending: isAdding } = useAddPlayerToTeam();

  const selectedPlayerIds = useMemo(() => {
    return new Set(team?.playerIds.map(id => id.toString()) || []);
  }, [team?.playerIds]);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           player.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || player.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [players, searchQuery, roleFilter]);

  const handleAddPlayer = (playerId: bigint) => {
    addPlayer({ teamId, playerId });
  };

  const selectedCount = team?.playerIds.length || 0;
  const remainingSlots = 11 - selectedCount;
  const progress = (selectedCount / 11) * 100;
  const canContinue = selectedCount === 11;

  if (playersLoading || teamLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{team?.name}</span>
            <Button 
              onClick={onContinue} 
              disabled={!canContinue}
              size="sm"
            >
              Review Team <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {selectedCount}/11 Players Selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                Balance: {formatCurrency(team?.balance || BigInt(0))}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {remainingSlots > 0 
                ? `${remainingSlots} more player${remainingSlots !== 1 ? 's' : ''} needed`
                : 'Team complete! Click Review Team to continue'}
            </p>
          </div>

          {selectedCount >= 11 && (
            <Alert>
              <AlertDescription>
                Your team is full! You can review your selections or replace players before continuing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <PlayerFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Player List */}
      <PlayerList
        players={filteredPlayers}
        selectedPlayerIds={selectedPlayerIds}
        onAddPlayer={handleAddPlayer}
        isAdding={isAdding}
        teamFull={selectedCount >= 11}
      />
    </div>
  );
}
