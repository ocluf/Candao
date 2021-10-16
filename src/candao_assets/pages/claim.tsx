import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useActor } from "../components/ActorProvider";
import { LoginState, useAuth } from "../components/AuthProvider";
import { ClaimSteps } from "../components/ClaimSteps";
import { Nav } from "../components/Nav";
import { useDaoInfo } from "../hooks/useDaoInfo";
import { useDaoMembers } from "../hooks/useDaoMembers";

enum State {
  Profile,
  Dao,
  Done,
}

const Claim: NextPage = () => {
  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo();
  const { authState, login, authClient, logout } = useAuth();
  const { daoMembers, daoMembersError, daoMembersLoading, me } =
    useDaoMembers();
  const { actor } = useActor();
  const router = useRouter();

  useEffect(() => {
    if (authState === LoginState.LoggedOut) {
      router.push("/");
    }
  }, [authState]);

  if (
    daoInfoLoading ||
    daoMembersLoading ||
    authState !== LoginState.LoggedIn
  ) {
    return (
      <div>
        <Nav showMenu={false}></Nav>
        <main>Loading DAO info...</main>
      </div>
    );
  }

  let state = State.Profile;

  if (me && !me.name) {
    return (
      <div>
        <Nav showMenu={false}></Nav>

        <main className="max-w-4xl mx-auto pt-4">
          <ClaimSteps onClick={() => {}}></ClaimSteps>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Nav showMenu={false}></Nav>

      <main></main>
    </div>
  );
};

export default Claim;
