import { Principal } from "@dfinity/principal";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useActor } from "../../components/ActorProvider";
import { Nav } from "../../components/Nav";
import { AddMemberForm } from "../../components/NewProposalForms/AddMemberForm";
import PageHeading from "../../components/PageHeading";
import { ProposalType } from "../../declarations/candao/candao.did";
import { enumIs, KeysOfUnion } from "../../utils/enums";
import { proposalNameMap } from "../../utils/proposals";

const enabledProposalTypes: KeysOfUnion<ProposalType>[] = [
  "AddMember",
  "RemoveMember",
  "LinkCanister",
  "InstallCanister",
];

const Proposals: NextPage = () => {
  const [proposalType, setProposalType] =
    useState<KeysOfUnion<ProposalType>>("AddMember");

  // const { daoMembers, daoMembersLoading, daoMembersError } = useDaoMembers();
  // const { canisters, canistersLoading, canistersError } = useCanisters();
  const { actor } = useActor();

  const [creating, setCreating] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav current="Proposals"></Nav>
      <PageHeading
        crumbs={["Dashboard", "Proposals", "New"]}
        pageTitle="New Proposal"
      ></PageHeading>

      <main className="p-8">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
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
            <div className="mt-5 md:mt-0 md:col-span-2">
              {proposalType === "AddMember" && (
                <AddMemberForm
                  onSubmit={async (form) => {
                    setCreating(true);
                    const response = await actor.create_proposal({
                      AddMember: {
                        name: form.name,
                        description: form.description,
                        principal_id: Principal.fromText(form.principal),
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Proposals;
