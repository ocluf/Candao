import { AuthClient } from "@dfinity/auth-client";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { createActor } from "../utils/actor";
import { useActor } from "./ActorProvider";

export enum LoginState {
  Uninitialized,
  LoggedIn,
  LoggedOut,
}

const authContext = React.createContext<{
  authState: LoginState;
  authClient: AuthClient | null;
  login: (callback?: () => void) => void;
  logout: () => void;
}>({
  authState: LoginState.Uninitialized,
  login: (callback?: () => void) => {},
  logout: () => {},
  authClient: null,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [loggedIn, setLoggedIn] = useState<LoginState>(
    LoginState.Uninitialized
  );
  const router = useRouter();
  const { setActor } = useActor();

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        handleAuth(authClient);
        setAuthClient(authClient);
      } else {
        setLoggedIn(LoginState.LoggedOut);
        setAuthClient(authClient);
      }
    })();
  }, []);

  const login = (callback?: () => void) => {
    authClient?.login({
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:8000/#authorize`,
      onSuccess: () => {
        handleAuth(authClient);
        callback && callback();
      },
    });
  };

  function logout() {
    authClient?.logout();
    setLoggedIn(LoginState.LoggedOut);
    router.push("/");
  }

  function handleAuth(authClient: AuthClient) {
    setLoggedIn(LoginState.LoggedIn);
    setActor(
      createActor({
        agentOptions: {
          identity: authClient?.getIdentity(),
        },
      })
    );
  }

  return (
    <authContext.Provider
      value={{
        authState: loggedIn,
        login,
        logout,
        authClient,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(authContext);
  if (context === undefined) {
    throw new Error("useActor must be used within a ActorProvider");
  }
  return context;
}
