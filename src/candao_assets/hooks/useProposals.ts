import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";

export function useProposals() {
  const { actor } = useActor();
  const { isLoading, error, data, refetch } = useQuery("proposals", () =>
    actor.get_proposals()
  );

  return {
    proposalsLoading: isLoading,
    proposalsError: error,
    proposals: data,
    refetchProposals: refetch,
  };
}
