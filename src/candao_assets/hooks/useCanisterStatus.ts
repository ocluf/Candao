import { Principal } from "@dfinity/principal";
import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";

export function useCanisterStatus(canisterId: Principal) {
  const { actor } = useActor();
  const { isLoading, error, data } = useQuery("canister_status", () =>
    actor.get_canister_status(canisterId)
  );

  return {
    statusLoading: isLoading,
    statusError: error,
    canisterStatus: data,
  };
}
