import { useState } from 'react';
import { useCreateFantasyTeam } from '../../hooks/useTeamMutations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';

interface CreateTeamStepProps {
  onTeamCreated: (teamId: bigint) => void;
}

export default function CreateTeamStep({ onTeamCreated }: CreateTeamStepProps) {
  const [teamName, setTeamName] = useState('');
  const { mutate: createTeam, isPending, error } = useCreateFantasyTeam();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      createTeam(teamName.trim(), {
        onSuccess: (teamId) => {
          onTeamCreated(teamId);
        },
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Create Your Team</CardTitle>
              <CardDescription>Give your fantasy team a unique name</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="e.g., Mumbai Mavericks, Chennai Champions..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={isPending}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Team Rules:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Select exactly 11 players for your team</li>
                <li>• Stay within your budget of ₹100 Cr</li>
                <li>• Build a balanced squad with different roles</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={!teamName.trim() || isPending}>
              {isPending ? 'Creating Team...' : 'Create Team & Select Players'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
