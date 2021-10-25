import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";

export function useCanisters() {
  const { actor } = useActor();
  const { isLoading, error, data } = useQuery("canisters", () =>
    actor.get_canisters()
  );
  console.log(data);
  return {
    canistersLoading: isLoading,
    canistersError: error,
    canisters: data,
  };
}
