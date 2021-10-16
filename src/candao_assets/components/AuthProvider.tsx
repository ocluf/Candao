import React, { useEffect, useRef, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { useActor } from "./ActorProvider";
import { createActor } from "../utils/actor";
import { useRouter } from "next/dist/client/router";

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
  const authClientRef = useRef<AuthClient | null>(null);
  const [loggedIn, setLoggedIn] = useState<LoginState>(
    LoginState.Uninitialized
  );
  const router = useRouter();
  const { setActor } = useActor();

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

  const login = (callback?: () => void) => {
    authClientRef.current?.login({
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:8000/#authorize`,
      onSuccess: () => {
        handleAuth();
        callback && callback();
      },
    });
  };

  function logout() {
    authClientRef.current?.logout();
    setLoggedIn(LoginState.LoggedOut);
    router.push("/");
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
    <authContext.Provider
      value={{
        authState: loggedIn,
        login,
        logout,
        authClient: authClientRef.current,
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
