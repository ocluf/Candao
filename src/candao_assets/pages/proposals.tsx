import { Principal } from "@dfinity/principal";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useActor } from "../components/ActorProvider";
import { useAuth } from "../components/AuthProvider";
import { Button } from "../components/Button";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";
import { Canister, Member, Proposal } from "../declarations/candao/candao.did";
import { useCanisters } from "../hooks/useCanisters";
import { useDaoMembers } from "../hooks/useDaoMembers";
import { useProposals } from "../hooks/useProposals";
import { enumIs } from "../utils/enums";
import { resolveMemberPrincipalId, shortenPrincipalId } from "../utils/members";
import {
  getInstallModeName,
  getProposalStatusName,
  getProposalTypeName,
  getUserVote,
  UserVote,
} from "../utils/proposals";
import { unreachable } from "../utils/unreachable";

const ProposalSummary: React.FC<{
  proposal: Proposal;
  members: Member[];
  canisters: Canister[];
}> = ({ members, proposal, canisters }) => {
  const proposalType = proposal.proposal_type;
  if (enumIs(proposalType, "AddMember")) {
    return (
      <>
        Add <strong>{proposalType.AddMember.name}</strong> as{" "}
        <span title={proposalType.AddMember.principal_id.toString()}>
          {shortenPrincipalId(proposalType.AddMember.principal_id.toString())}
        </span>
      </>
    );
  } else if (enumIs(proposalType, "CreateCanister")) {
    return <>Create and link a new canister</>;
  } else if (enumIs(proposalType, "DeleteCanister")) {
    // return <>Delete {proposal.DeleteCanister.canister_id}</>
    return <>Delete a canister</>;
  } else if (enumIs(proposalType, "InstallCanister")) {
    return (
      <>
        {getInstallModeName(proposalType.InstallCanister.mode)} canister{" "}
        {proposalType.InstallCanister.canister_id.toString()}
      </>
    );
  } else if (enumIs(proposalType, "LinkCanister")) {
    return (
      <>Link canister {proposalType.LinkCanister.canister_id.toString()}</>
    );
  } else if (enumIs(proposalType, "RemoveMember")) {
    return (
      <>Remove {resolveMemberPrincipalId(members, proposalType.RemoveMember)}</>
    );
  } else if (enumIs(proposalType, "StartCanister")) {
    return <>Start Canister X</>;
  } else if (enumIs(proposalType, "StopCanister")) {
    return <>Stop Canister X</>;
  } else if (enumIs(proposalType, "UpdateCanisterSettings")) {
    return <>Update Canister X Settings</>;
  } else if (enumIs(proposalType, "DepositCycles")) {
    return <>Deposit Cycles</>;
  } else if (enumIs(proposalType, "UninstallCanister")) {
    return <>Uninstall Canister</>;
  } else if (enumIs(proposalType, "JoinRequest")) {
    return (
      <>
        Accept join request of <strong>{proposalType.JoinRequest.name}</strong>{" "}
        as{" "}
        <span title={proposal.proposer.toString()}>
          {shortenPrincipalId(proposal.proposer.toString())}
        </span>
      </>
    );
  }

  unreachable(proposalType);
};

const VoteStatus: React.FC<{
  yes: number;
  no: number;
  total: number;
}> = ({ yes, no, total }) => {
  return (
    <div className="">
      <div className="flex justify-between">
        <span className="text-xs font-medium uppercase text-gray-700">
          {yes} Yes
        </span>
        <span className="text-xs font-medium uppercase text-gray-700">
          {no} No
        </span>
      </div>
      <div className="relative w-full h-2">
        <div
          className="bg-green-700 h-2 left-0 top-0 absolute"
          style={{
            width: 100 * (yes / total) + "%",
          }}
        ></div>
        <div
          className="bg-red-700 h-2 right-0 top-0 absolute"
          style={{
            width: 100 * (no / total) + "%",
          }}
        ></div>
      </div>
    </div>
  );
};

const VoteInfo: React.FC<{
  proposal: Proposal;
  userPrincipal: Principal;
  onVote: (approve: boolean) => void;
  working: false | "yes" | "no";
}> = ({ proposal, userPrincipal, onVote, working }) => {
  const vote = getUserVote(proposal, userPrincipal);

  switch (vote) {
    case UserVote.No:
      return <div>Voted NO</div>;
    case UserVote.Yes:
      return <div>Voted YES</div>;
    case UserVote.NotVoted:
      if (enumIs(proposal.proposal_status, "InProgress")) {
        return (
          <div>
            <Button
              variant="primary"
              color="green"
              onClick={() => onVote(true)}
              disabled={working === "no"}
              working={working === "yes"}
            >
              Vote YES
            </Button>
            <Button
              variant="primary"
              color="red"
              onClick={() => onVote(false)}
              disabled={working === "yes"}
              working={working === "no"}
            >
              Vote NO
            </Button>
          </div>
        );
      } else {
        return <div>Not voted</div>;
      }

    // break
    default:
      unreachable(vote);
  }
};

const Proposals: NextPage = () => {
  const { proposals, proposalsLoading, refetchProposals } = useProposals();
  const { daoMembers, daoMembersLoading } = useDaoMembers();
  const { canisters, canistersLoading } = useCanisters();

  const { authClient } = useAuth();
  const { actor } = useActor();

  const [working, setWorking] = useState<Record<string, "yes" | "no" | false>>(
    {}
  );

  const vote = async (proposal_id: bigint, approve: boolean) => {
    setWorking({
      ...working,
      [proposal_id.toString()]: approve ? "yes" : "no",
    });
    await actor.vote(proposal_id, approve ? { Yes: null } : { No: null });
    await refetchProposals();
    setWorking({ ...working, [proposal_id.toString()]: false });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav current="Proposals"></Nav>
      <PageHeading crumbs={["Dashboard", "Proposals"]} pageTitle="Proposals">
        <Link href="/proposals/new">
          <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ">
            New Proposal
          </a>
        </Link>
      </PageHeading>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {proposals &&
          !proposalsLoading &&
          daoMembers &&
          !daoMembersLoading &&
          canisters &&
          !canistersLoading && (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Proposal
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Proposer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Your vote
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proposals
                    .slice()
                    .reverse()
                    .map((proposal, personIdx) => (
                      <tr
                        key={proposal.proposal_id.toString()}
                        className={
                          personIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getProposalTypeName(proposal.proposal_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <ProposalSummary
                            proposal={proposal}
                            members={daoMembers}
                            canisters={canisters}
                          ></ProposalSummary>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {resolveMemberPrincipalId(
                            daoMembers,
                            proposal.proposer
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          <div className="flex items-center justify-between">
                            {getProposalStatusName(proposal.proposal_status)}
                            <div className="min-w-[6rem]">
                              {enumIs(
                                proposal.proposal_status,
                                "InProgress"
                              ) && (
                                <VoteStatus
                                  yes={proposal.yes_votes.length}
                                  no={proposal.no_votes.length}
                                  total={daoMembers.length}
                                ></VoteStatus>
                              )}
                              {!enumIs(
                                proposal.proposal_status,
                                "InProgress"
                              ) && (
                                <VoteStatus
                                  yes={proposal.yes_votes.length}
                                  no={proposal.no_votes.length}
                                  total={
                                    proposal.yes_votes.length +
                                    proposal.no_votes.length
                                  }
                                ></VoteStatus>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <VoteInfo
                            onVote={(approve) =>
                              vote(proposal.proposal_id, approve)
                            }
                            proposal={proposal}
                            userPrincipal={
                              authClient?.getIdentity().getPrincipal()!
                            }
                            working={working[proposal.proposal_id.toString()]}
                          ></VoteInfo>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
      </main>
    </div>
  );
};

export default Proposals;
