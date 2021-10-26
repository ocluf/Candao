import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";

export function useCycleBalance() {
  const { actor } = useActor();
  const { isLoading, error, data } = useQuery("cycleBalance", () =>
    actor.get_cycle_balance()
  );

  return {
    cycleBalanceLoading: isLoading,
    cycleBalanceError: error,
    cycleBalance: data,
  };
}
