import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";
import { useAuth } from "../components/AuthProvider";

export function useDaoMembers() {
  const { actor } = useActor();
  const { authClient } = useAuth();
  const { isLoading, error, data, refetch } = useQuery("daoMembers", () =>
    actor.get_members()
  );

  return {
    daoMembersLoading: isLoading,
    daoMembersError: error,
    daoMembers: data,
    me:
      authClient &&
      data &&
      data.find(
        (m) =>
          m.principal_id.toString() ===
          authClient.getIdentity().getPrincipal().toString()
      ),
    refetchDaoMembers: refetch,
  };
}
