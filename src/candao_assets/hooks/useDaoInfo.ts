import { useQuery } from "react-query";
import { useActor } from "../components/ActorProvider";

export function useDaoInfo() {
  const { actor } = useActor();
  const { isLoading, error, data } = useQuery("daoInfo", () =>
    actor.get_dao_info()
  );

  return { daoInfoLoading: isLoading, daoInfoError: error, daoInfo: data };
}
