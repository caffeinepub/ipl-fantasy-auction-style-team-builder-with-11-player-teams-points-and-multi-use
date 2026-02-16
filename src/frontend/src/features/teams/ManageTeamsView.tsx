import { useGetUserTeams } from '../../hooks/useScopedTeams';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import TeamCard from './TeamCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Users } from 'lucide-react';

interface ManageTeamsViewProps {
  onCreateNew: () => void;
}

export default function ManageTeamsView({ onCreateNew }: ManageTeamsViewProps) {
  const { identity } = useInternetIdentity();
  const { data: teams = [], isLoading } = useGetUserTeams(identity?.getPrincipal());

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Teams</h2>
          <p className="text-muted-foreground">Manage your fantasy cricket squads</p>
        </div>
        <Button onClick={onCreateNew} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Teams Yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start building your fantasy cricket empire by creating your first team!
            </p>
            <Button onClick={onCreateNew} size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id.toString()} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
