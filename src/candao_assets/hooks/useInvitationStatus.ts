import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";
import { useAuth } from "../components/AuthProvider";

export function useInvitationStatus() {
  const { actor } = useActor();
  const { authClient } = useAuth();
  const { isLoading, error, data, refetch } = useQuery(
    "invitation_status",
    () => actor.check_invitation_status(),
    { enabled: !!authClient?.getIdentity().getPrincipal() }
  );

  return {
    invitationStatusLoading: isLoading,
    invitationStatusError: error,
    invitationStatus: data,
    refetchInvitationStatus: refetch,
  };
}
