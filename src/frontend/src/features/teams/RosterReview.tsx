import { useGetTeam } from '../../hooks/useTeamQueries';
import { useGetAllPlayers } from '../../hooks/usePlayers';
import { useValidateTeam } from '../../hooks/useTeamValidation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Trophy, Users, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { formatCurrency, formatPoints } from '../../utils/points';
import { getRoleLabel, getRoleColor } from '../../utils/roles';
import { Player } from '../../backend';

interface RosterReviewProps {
  teamId: bigint;
  onFinalize: () => void;
}

export default function RosterReview({ teamId, onFinalize }: RosterReviewProps) {
  const { data: team, isLoading: teamLoading } = useGetTeam(teamId);
  const { data: allPlayers = [], isLoading: playersLoading } = useGetAllPlayers();
  const { mutate: validateTeam, isPending: isValidating, error: validationError } = useValidateTeam();

  const selectedPlayers = useMemo(() => {
    if (!team || !allPlayers.length) return [];
    const playerMap = new Map(allPlayers.map(p => [p.id.toString(), p]));
    return team.playerIds
      .map(id => playerMap.get(id.toString()))
      .filter((player): player is Player => player !== undefined);
  }, [team, allPlayers]);

  const handleFinalize = () => {
    validateTeam(teamId, {
      onSuccess: () => {
        onFinalize();
      },
    });
  };

  if (teamLoading || playersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    );
  }

  const isValid = selectedPlayers.length === 11;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Team Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{team?.name}</CardTitle>
                <CardDescription>Review your final squad</CardDescription>
              </div>
            </div>
            {isValid && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Valid Team
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{selectedPlayers.length}/11</div>
              <div className="text-xs text-muted-foreground">Players</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{formatPoints(team?.totalPoints || BigInt(0))}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{formatCurrency(team?.balance || BigInt(0))}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError.message}</AlertDescription>
        </Alert>
      )}

      {!isValid && (
        <Alert variant="destructive">
          <AlertDescription>
            Your team must have exactly 11 players. Currently you have {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''}.
          </AlertDescription>
        </Alert>
      )}

      {/* Player Roster */}
      <Card>
        <CardHeader>
          <CardTitle>Your Squad</CardTitle>
          <CardDescription>Final roster of {selectedPlayers.length} players</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedPlayers.map((player, index) => (
              <div
                key={player.id.toString()}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-muted-foreground">{player.team}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getRoleColor(player.role)}>
                    {getRoleLabel(player.role)}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatPoints(player.totalPoints)} pts</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(player.baseCost)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleFinalize}
          disabled={!isValid || isValidating}
          className="flex-1"
          size="lg"
        >
          {isValidating ? 'Finalizing...' : 'Finalize Team'}
        </Button>
      </div>
    </div>
  );
}
