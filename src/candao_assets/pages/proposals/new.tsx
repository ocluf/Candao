import { Principal } from "@dfinity/principal";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useActor } from "../../components/ActorProvider";
import { Nav } from "../../components/Nav";
import { AddMemberForm } from "../../components/NewProposalForms/AddMemberForm";
import { CreateCanisterForm } from "../../components/NewProposalForms/CreateCanisterForm";
import { DepositCyclesForm } from "../../components/NewProposalForms/DepositCyclesForm";
import {
  InstallCanisterForm,
  installModeToCandidInstallMode,
} from "../../components/NewProposalForms/InstallCanisterForm";
import { LinkCanisterForm } from "../../components/NewProposalForms/LinkCanisterForm";
import { RemoveMemberForm } from "../../components/NewProposalForms/RemoveMemberForm";
import PageHeading from "../../components/PageHeading";
import { ProposalType } from "../../declarations/candao/candao.did";
import { enumIs, KeysOfUnion } from "../../utils/enums";
import { proposalNameMap } from "../../utils/proposals";

const enabledProposalTypes: KeysOfUnion<ProposalType>[] = [
  "AddMember",
  "RemoveMember",
  "LinkCanister",
  "InstallCanister",
  "CreateCanister",
  "DepositCycles",
];

const Proposals: NextPage = () => {
  const router = useRouter();
  const queryparams = router.query;

  const [proposalType, setProposalType] = useState<
    KeysOfUnion<ProposalType> | undefined
  >(undefined);

  const { actor } = useActor();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!(typeof queryparams === "object")) {
      return;
    }
    if (queryparams.proposalType) {
      setProposalType(queryparams.proposalType as KeysOfUnion<ProposalType>);
    } else {
      setProposalType("AddMember");
    }
  }, [queryparams]);

  console.log(queryparams);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav current="Proposals"></Nav>
      <PageHeading
        crumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Proposals", href: "/proposals" },
          { title: "New", href: "#" },
        ]}
        pageTitle="New Proposal"
      ></PageHeading>
      {typeof queryparams === "object" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="max-w-3xl">
              <div className="">
                <label
                  className="text-lg font-medium leading-6 text-gray-900"
                  htmlFor="proposal-type"
                >
                  Select proposal type
                </label>
                <select
                  name="proposal-type"
                  autoComplete="country"
                  className="mt-4 block w-full mr-8 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) =>
                    setProposalType(e.target.value as KeysOfUnion<ProposalType>)
                  }
                  value={proposalType}
                  disabled={creating}
                >
                  {enabledProposalTypes.map((t) => (
                    <option key={t} value={t}>
                      {proposalNameMap[t]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 ">
                {proposalType === "AddMember" && (
                  <AddMemberForm
                    onSubmit={async (form) => {
                      setCreating(true);
                      const response = await actor.create_proposal({
                        AddMember: {
                          name: form.name,
                          description: form.description,
                          principal_id: Principal.fromText(form.principal),
                          can_vote: form.canVote,
                        },
                      });
                      setCreating(false);
                      if (enumIs(response, "Success")) {
                        router.push("/proposals");
                      }
                    }}
                    submitting={creating}
                  ></AddMemberForm>
                )}
                {proposalType === "RemoveMember" && (
                  <RemoveMemberForm
                    onSubmit={async (form) => {
                      setCreating(true);
                      const response = await actor.create_proposal({
                        RemoveMember: Principal.fromText(form.principal),
                      });
                      setCreating(false);
                      if (enumIs(response, "Success")) {
                        router.push("/proposals");
                      }
                    }}
                    submitting={creating}
                  ></RemoveMemberForm>
                )}
                {proposalType === "LinkCanister" && (
                  <LinkCanisterForm
                    onSubmit={async (form) => {
                      setCreating(true);
                      const response = await actor.create_proposal({
                        LinkCanister: {
                          canister_id: Principal.fromText(form.canister_id),
                          name: form.name,
                          description: form.description,
                        },
                      });
                      setCreating(false);
                      if (enumIs(response, "Success")) {
                        router.push("/proposals");
                      }
                    }}
                    submitting={creating}
                  ></LinkCanisterForm>
                )}
                {proposalType === "InstallCanister" && (
                  <InstallCanisterForm
                    onSubmit={async (form) => {
                      // console.log(form);

                      setCreating(true);
                      const response = await actor.create_proposal({
                        InstallCanister: {
                          canister_id: Principal.fromText(form.canister_id),
                          mode: installModeToCandidInstallMode(form.mode),
                          wasm_module: Array.from(
                            new Uint8Array(
                              await form.wasm_module[0].arrayBuffer()
                            )
                          ),
                          arg: [],
                        },
                      });
                      setCreating(false);
                      if (enumIs(response, "Success")) {
                        router.push("/proposals");
                      }
                    }}
                    submitting={creating}
                  ></InstallCanisterForm>
                )}
                {proposalType === "CreateCanister" && (
                  <CreateCanisterForm
                    onSubmit={async (form) => {
                      setCreating(true);
                      const response = await actor.create_proposal({
                        CreateCanister: {
                          name: form.name,
                          create_args: { settings: [] },
                          cycles: BigInt(form.cycles),
                          description: form.description,
                        },
                      });
                      setCreating(false);

                      console.log(response);

                      if (enumIs(response, "Success")) {
                        router.push("/proposals");
                      }
                    }}
                    submitting={creating}
                  ></CreateCanisterForm>
                )}

                {proposalType === "DepositCycles" && (
                  <DepositCyclesForm
                    onSubmit={async (form) => {
                      setCreating(true);
                      const response = await actor.create_proposal({
                        DepositCycles: {
                          canister_id: {
                            canister_id: Principal.fromText(form.canister_id),
                          },
                          cycles: BigInt(form.cycles),
                        },
                      });
                      setCreating(false);
                      console.log(response);
                      if (enumIs(response, "Success")) {
                        router.push("/proposals");
                      }
                    }}
                    submitting={creating}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Proposals;
