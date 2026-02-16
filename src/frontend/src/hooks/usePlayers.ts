import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Player } from '../backend';

export function useGetAllPlayers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !actorFetching,
  });
}
