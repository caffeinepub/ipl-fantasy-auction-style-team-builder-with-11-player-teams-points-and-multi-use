import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, TrendingUp, Coins } from 'lucide-react';
import { FantasyTeam } from '../../backend';
import { formatCurrency, formatPoints } from '../../utils/points';

interface TeamCardProps {
  team: FantasyTeam;
}

export default function TeamCard({ team }: TeamCardProps) {
  const isComplete = team.playerIds.length === 11;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{team.name}</CardTitle>
          <Badge variant={isComplete ? 'default' : 'outline'}>
            {isComplete ? 'Complete' : 'In Progress'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{team.playerIds.length}/11</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatPoints(team.totalPoints)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Coins className="h-4 w-4" />
              Balance
            </span>
            <span className="font-semibold">{formatCurrency(team.balance)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
