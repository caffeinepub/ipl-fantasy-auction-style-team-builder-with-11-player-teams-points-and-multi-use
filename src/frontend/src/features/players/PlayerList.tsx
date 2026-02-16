import { Player } from '../../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check } from 'lucide-react';
import { formatCurrency, formatPoints } from '../../utils/points';
import { getRoleLabel, getRoleColor } from '../../utils/roles';

interface PlayerListProps {
  players: Player[];
  selectedPlayerIds: Set<string>;
  onAddPlayer: (playerId: bigint) => void;
  isAdding: boolean;
  teamFull: boolean;
}

export default function PlayerList({ 
  players, 
  selectedPlayerIds, 
  onAddPlayer, 
  isAdding,
  teamFull 
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No players found matching your filters</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player) => {
        const isSelected = selectedPlayerIds.has(player.id.toString());
        const canAdd = !isSelected && !teamFull;

        return (
          <Card key={player.id.toString()} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{player.name}</h3>
                    <Badge variant="outline" className={getRoleColor(player.role)}>
                      {getRoleLabel(player.role)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{player.team}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatPoints(player.totalPoints)} pts</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(player.baseCost)}</div>
                  </div>

                  {isSelected ? (
                    <Button size="sm" variant="outline" disabled className="gap-1">
                      <Check className="h-4 w-4" />
                      Selected
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onAddPlayer(player.id)}
                      disabled={isAdding || !canAdd}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
