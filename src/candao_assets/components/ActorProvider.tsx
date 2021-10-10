import React, { useState, useEffect } from "react";
import { Actor, ActorSubclass } from "@dfinity/agent";
import { createActor } from "../utils/actor";
import { _SERVICE } from "../declarations/candao/candao.did";

type CandaoActor = ActorSubclass<_SERVICE>;

const actorContext = React.createContext<{
  actor: CandaoActor | null;
  setActor: (a: CandaoActor) => void;
}>({ actor: null, setActor: () => {} });

export const ActorProvider: React.FC = ({ children }) => {
  const [actor, setActor] = useState<CandaoActor | null>(null);

  useEffect(() => {
    setActor(
      createActor<_SERVICE>({
        agentOptions: { host: `http://localhost:8000` },
      })
    );
  }, []);

  return (
    <actorContext.Provider
      value={{
        actor,
        setActor,
      }}
    >
      {children}
    </actorContext.Provider>
  );
};

export function useActor() {
  const context = React.useContext(actorContext);
  if (context === undefined) {
    throw new Error("useActor must be used within a ActorProvider");
  }
  return context;
}
