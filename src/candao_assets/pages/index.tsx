import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useActor } from "../components/ActorProvider";
import { LoginState, useAuth } from "../components/AuthProvider";
import { Nav } from "../components/Nav";
import { PublicNav } from "../components/PublicNav";
import { useDaoInfo } from "../hooks/useDaoInfo";
import { useDaoMembers } from "../hooks/useDaoMembers";

enum ViewState {
  Uninitialized,
  Unclaimed,
  UnclaimedLoggedIn,
  Claimed,
  ClaimedNonMember,
}

const Home: NextPage = () => {
  const { daoMembers, daoMembersError, daoMembersLoading } = useDaoMembers();
  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo();
  const { authState, login, authClient, logout } = useAuth();
  const { actor } = useActor();
  const router = useRouter();

  const [viewState, setViewState] = useState<ViewState>(
    ViewState.Uninitialized
  );

  const [claimingDao, setClaimingDao] = useState(false);

  useEffect(() => {
    if (daoMembersLoading) return;
    if (typeof daoMembers === "undefined") return;
    if (!authClient) return;
    if (authState === LoginState.Uninitialized) return;

    if (daoMembers.length === 0) {
      // unclaimed
      if (authState === LoginState.LoggedOut) {
        return setViewState(ViewState.Unclaimed);
      } else {
        return setViewState(ViewState.UnclaimedLoggedIn);
      }
    } else {
      // claimed
      if (authState === LoginState.LoggedOut) {
        return setViewState(ViewState.Claimed);
      } else if (
        daoMembers.find(
          (m) =>
            m.principal_id.toString() ===
            authClient.getIdentity().getPrincipal().toString()
        )
      ) {
        // logged in and member
        router.push("/dao");
      } else {
        // logged in but no member
        return setViewState(ViewState.ClaimedNonMember);
      }
    }
  }, [authState, daoMembersLoading, daoMembers, authClient]);

  async function claimDao() {
    setClaimingDao(true);
    const result = await actor.take_control();

    console.log(result);

    if ("Success" in result) {
      router.push("/claim");
    }
  }

  return (
    <div>
      <PublicNav></PublicNav>

      <div className="max-w-2xl mx-auto pt-4">
        {[ViewState.Unclaimed, ViewState.UnclaimedLoggedIn].includes(
          viewState
        ) && (
          <>
            <span className="block text-indigo-600 leading-6 font-semibold tracking-wide uppercase mb-2">
              About CanDAO
            </span>
            <h1 className="text-4xl leading-10 font-extrabold tracking-tight mb-8">
              What is a DAO?
            </h1>

            <p className="text-lg leading-7 font-normal text-gray-700 mb-6">
              Wikipedia defines DAO (Decentralized Autonomous Organization) as
              an organization represented by rules encoded as a transparent
              computer program, controlled by the organization members, and not
              influenced by a central government. As the rules are embedded into
              the code, no managers are needed, thus removing any bureaucracy or
              hierarchy hurdles.
            </p>

            <h2 className="text-xl leading-8 font-semibold mb-4">
              What to use CanDAO for?
            </h2>

            <p className="mb-6 text-lg leading-7 font-normal text-gray-700">
              CanDAO works on the{" "}
              <span className="text-indigo-400">
                Internet Computer blockchain
              </span>{" "}
              and allows you such things as:{" "}
            </p>
            <ul className="list-disc ml-7 text-gray-700 leading-7 font-normal">
              <li>controlling canister code by voting on proposals</li>
              <li>controlling canister code by voting on proposals</li>
              <li>controlling canister code by voting on proposals</li>
            </ul>

            {viewState === ViewState.Unclaimed && (
              <button
                type="button"
                className="mt-8 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => login(claimDao)}
              >
                Login to claim this DAO
              </button>
            )}

            {viewState === ViewState.UnclaimedLoggedIn && (
              <div className="mt-8">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {claimingDao ? "Claiming..." : "Claim this DAO"}
                </button>
                {!claimingDao && (
                  <>
                    <span className="inline-block mx-4 text-sm text-gray-600">
                      or
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2  text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={logout}
                    >
                      Log out
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
        {[ViewState.Claimed, ViewState.ClaimedNonMember].includes(
          viewState
        ) && (
          <>
            <span className="block text-indigo-600 leading-6 font-semibold tracking-wide uppercase mb-2">
              THIS IS A CANDAO CANISTER
            </span>
            <h1 className="text-4xl leading-10 font-extrabold tracking-tight mb-8">
              {daoInfo?.title}
            </h1>

            <p className="text-lg leading-7 font-normal text-gray-700 mb-6">
              {daoInfo?.description || (
                <span className="italic text-gray-400 text-sm">
                  This DAO has no public description
                </span>
              )}
            </p>

            {viewState === ViewState.Claimed && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => login()}
              >
                Log in to this DAO
              </button>
            )}

            {viewState === ViewState.ClaimedNonMember && (
              <>
                <p className="text-red-400 my-4">
                  You are not a member of this DAO.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => logout()}
                >
                  Log out
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
