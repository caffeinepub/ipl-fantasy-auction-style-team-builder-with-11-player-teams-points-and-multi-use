import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TeamId } from '../backend';

export function useValidateTeam() {
  const { actor } = useActor();

  return useMutation<void, Error, TeamId>({
    mutationFn: async (teamId: TeamId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateTeam(teamId);
    },
  });
}
