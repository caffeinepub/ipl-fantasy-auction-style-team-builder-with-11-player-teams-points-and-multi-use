import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TeamId, PlayerId } from '../backend';

export function useCreateFantasyTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<TeamId, Error, string>({
    mutationFn: async (teamName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFantasyTeam(teamName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTeams'] });
    },
  });
}

export function useAddPlayerToTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { teamId: TeamId; playerId: PlayerId }>({
    mutationFn: async ({ teamId, playerId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPlayerToTeam(teamId, playerId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userTeams'] });
    },
  });
}
