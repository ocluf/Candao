import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../components/ActorProvider";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "../utils/actor";

enum LoginState {
  Uninitialized,
  LoggedIn,
  LoggedOut,
}

const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState<LoginState>(
    LoginState.Uninitialized
  );
  const authClientRef = useRef<AuthClient | null>(null);
  const { actor, setActor } = useActor();
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      authClientRef.current = authClient;
      if (await authClient.isAuthenticated()) {
        handleAuth();
      } else {
        setLoggedIn(LoginState.LoggedOut);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (actor) {
        setMemberCount((await actor.get_members()).length);
      }
    })();
  }, [actor, setMemberCount]);

  const onLogin = () => {
    authClientRef.current?.login({
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:8000/#authorize`,
      onSuccess: () => {
        handleAuth();
      },
    });
  };

  function onLogout() {
    authClientRef.current?.logout();
    setLoggedIn(LoginState.LoggedOut);
  }

  function handleAuth() {
    setLoggedIn(LoginState.LoggedIn);
    setActor(
      createActor({
        agentOptions: {
          identity: authClientRef.current?.getIdentity(),
        },
      })
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Head>
        <title>CanDao</title>
        <meta name="description" content="Dao for controlling canisters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="flex justify-between py-4">
        <a className="">CanDAO</a>
        {loggedIn === LoginState.LoggedOut && (
          <button
            className="border rounded px-2 py-1 hover:bg-gray-200"
            onClick={onLogin}
          >
            Log in
          </button>
        )}{" "}
        {loggedIn === LoginState.LoggedIn && (
          <button
            className="border rounded px-2 py-1 hover:bg-gray-200"
            onClick={onLogout}
          >
            Log out
          </button>
        )}
      </nav>
      <h1 className="text-3xl mt-44 text-center">Candao</h1>

      <ul className="text-center mt-12">
        <li>Backend canister id: {process.env.CANDAO_CANISTER_ID}</li>
        <li>Frontend canister id: {process.env.CANDAO_ASSETS_CANISTER_ID}</li>
        <li>
          Internet Identity canister id:{" "}
          {process.env.INTERNET_IDENTITY_CANISTER_ID}
        </li>
      </ul>

      {loggedIn === LoginState.LoggedIn && (
        <p className="text-center mt-24">
          Logged in as{" "}
          {authClientRef.current?.getIdentity().getPrincipal().toString()}
        </p>
      )}

      {memberCount !== null && (
        <div className="text-center mt-24">
          <p className=""> DAO members: {memberCount}</p>

          {memberCount === 0 && loggedIn === LoginState.LoggedIn && (
            <button className="mt-4 bg-green-300 rounded px-2 py-1 hover:bg-green-400 ">
              Claim this DAO
            </button>
          )}
          {memberCount === 0 && loggedIn === LoginState.LoggedOut && (
            <button
              className="mt-4 bg-green-300 rounded px-2 py-1 hover:bg-green-400 "
              onClick={onLogin}
            >
              Log in to claim this DAO
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
