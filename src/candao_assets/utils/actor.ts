import {
  Actor,
  ActorConfig,
  HttpAgent,
  HttpAgentOptions,
} from "@dfinity/agent";

import { idlFactory } from "./idlFactory";

type CreateAgentOptions = {
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
};

export function createActor(options?: CreateAgentOptions) {
  const hostOptions = { host: "http://localhost:8000" };
  if (!options) {
    options = {
      agentOptions: hostOptions,
    };
  } else if (!options.agentOptions) {
    options.agentOptions = hostOptions;
  } else {
    options.agentOptions!.host = hostOptions.host;
  }

  const agent = new HttpAgent({ ...options.agentOptions });

  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: process.env.CANDAO_CANISTER_ID!,
    ...options?.actorOptions,
  });
}
