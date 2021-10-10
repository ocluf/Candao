import React, { useState, useEffect } from "react";
import { Actor } from "@dfinity/agent";
import { createActor } from "../utils/actor";

const actorContext = React.createContext<{
  actor: Actor | null;
  setActor: (a: Actor) => void;
}>({ actor: null, setActor: () => {} });

export const ActorProvider: React.FC = ({ children }) => {
  const [actor, setActor] = useState<Actor | null>(null);

  useEffect(() => {
    setActor(
      createActor({
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
