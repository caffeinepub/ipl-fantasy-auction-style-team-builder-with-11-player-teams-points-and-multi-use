import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FantasyTeam } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetUserTeams(userId: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FantasyTeam[]>({
    queryKey: ['userTeams', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserTeams(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}
