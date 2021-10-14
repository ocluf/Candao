import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";

export function useDaoMembers() {
  const { actor } = useActor();
  const { isLoading, error, data } = useQuery("daoMembers", () =>
    actor.get_members()
  );

  return {
    daoMembersLoading: isLoading,
    daoMembersError: error,
    daoMembers: data,
  };
}
