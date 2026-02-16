import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FantasyTeam, TeamId } from '../backend';

export function useGetTeam(teamId: TeamId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FantasyTeam>({
    queryKey: ['team', teamId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTeam(teamId);
    },
    enabled: !!actor && !actorFetching,
  });
}
