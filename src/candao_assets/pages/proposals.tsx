import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import type { NextPage } from "next";
import app from "next/app";
import Link from "next/link";
import classNames from "classnames";
import React, { useState } from "react";
import { useActor } from "../components/ActorProvider";
import { useAuth } from "../components/AuthProvider";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
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
  proposalStatusNameMap,
  UserVote,
} from "../utils/proposals";
import { unreachable } from "../utils/unreachable";
import { Badge } from "../components/Badge";

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
    //return <>Delete {proposal.DeleteCanister.canister_id}</>;
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
    return (
      <>Start Canister {proposalType.StartCanister.canister_id.toString()}</>
    );
  } else if (enumIs(proposalType, "StopCanister")) {
    return (
      <>Stop Canister {proposalType.StopCanister.canister_id.toString()}</>
    );
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

const VoteDisplay: React.FC<{
  total: number;
  approved: number;
  rejected: number;
}> = ({ total, approved, rejected }) => {
  const title = () => {
    if (approved == 0 && rejected == 0) {
      return <div>No votes yet</div>;
    } else {
      return (
        <div>{approved + rejected + " / " + total} &nbsp; People voted</div>
      );
    }
  };
  const approvedPerc: string =
    parseFloat((100 * (approved / total)).toFixed(1)) + "%";
  const rejectedPerc: string =
    parseFloat((100 * (rejected / total)).toFixed(1)) + "%";

  return (
    <div>
      <div className="text-sm leading-5 font-normal text-gray-900 mb-1">
        {title()}
      </div>
      <div className="flex text-xs mt-2">
        <div className="w-12">{approvedPerc}</div>
        <div className="w-20">
          <div className="text-gray-500">Approved</div>
          <div
            className="bg-purple-700 h-1 my-1 rounded-lg"
            style={{
              width: 100 * (approved / total) + "%",
            }}
          ></div>
        </div>
      </div>
      <div className="flex text-xs">
        <div className="w-12">{rejectedPerc}</div>
        <div className="w-20">
          <div className="text-gray-500 ">Rejected</div>
          <div
            className="bg-purple-700 h-1 my-1 rounded-lg"
            style={{
              width: 100 * (rejected / total) + "%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const ProposalCard: React.FC<{
  proposal: Proposal;
  members: Array<Member>;
  canisters: Array<Canister>;
  currentUserPrincipal: Principal;
  vote: (id: bigint, vote: boolean) => Promise<void>;
  working: false | "yes" | "no";
}> = ({
  proposal,
  members,
  canisters,
  currentUserPrincipal,
  vote,
  working,
}) => {
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const isAnonymous: boolean = currentUserPrincipal.isAnonymous();
  const votedNo = proposal.no_votes.find(
    (p) => p.toString() === currentUserPrincipal.toString()
  );
  const votedYes = proposal.yes_votes.find(
    (p) => p.toString() === currentUserPrincipal.toString()
  );

  const getProposalText = (): [title: string, subtitle: string] => {
    if (enumIs(proposal.proposal_type, "AddMember")) {
      const title = "Add new Member - " + proposal.proposal_type.AddMember.name;
      const subtitle = proposal.proposal_type.AddMember.principal_id.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "RemoveMember")) {
      const proposalPrincipal = proposal.proposal_type.RemoveMember.toString();
      const removedMember = members.find(
        (m) => m.principal_id.toString() === proposalPrincipal
      );
      const title = "Remove Member - " + removedMember?.name;
      const subtitle = removedMember?.principal_id.toString();
      return [title, subtitle || ""];
    } else if (enumIs(proposal.proposal_type, "CreateCanister")) {
      const title =
        "Create Canister - " + proposal.proposal_type.CreateCanister.name;
      const subtitle =
        "Balance: " +
        (
          proposal.proposal_type.CreateCanister.cycles / BigInt("1000000000000")
        ).toString() +
        " T cycles";
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "DeleteCanister")) {
      const relevantCanisterId =
        proposal.proposal_type.DeleteCanister.canister_id;
      const relevantCanister = canisters.find(
        (c) => c.canister_id === relevantCanisterId
      );
      const title = "Delete Canister - " + relevantCanister?.name;
      const subtitle =
        proposal.proposal_type.DeleteCanister.canister_id.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "InstallCanister")) {
      const relevantCanisterId =
        proposal.proposal_type.InstallCanister.canister_id;
      const relevantCanister = canisters.find(
        (c) => c.canister_id.toString() === relevantCanisterId.toString()
      );
      const mode = getInstallModeName(
        proposal.proposal_type.InstallCanister.mode
      );
      const title = `${relevantCanister?.name}: Install new canister (mode: ${mode})`;
      const subtitle = relevantCanisterId.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "StartCanister")) {
      const relevantCanisterId =
        proposal.proposal_type.StartCanister.canister_id;
      const relevantCanister = canisters.find(
        (c) => c.canister_id === relevantCanisterId
      );
      const title = "Start canister - " + relevantCanister?.name;
      const subtitle = relevantCanisterId.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "StopCanister")) {
      const relevantCanisterId =
        proposal.proposal_type.StopCanister.canister_id;
      const relevantCanister = canisters.find(
        (c) => c.canister_id === relevantCanisterId
      );
      const title = "Stop canister - " + relevantCanister?.name;
      const subtitle = relevantCanisterId.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "DepositCycles")) {
      const relevantCanisterId =
        proposal.proposal_type.DepositCycles.canister_id.canister_id;
      const relevantCanister = canisters.find(
        (c) => c.canister_id === relevantCanisterId
      );
      const cyclesT =
        proposal.proposal_type.DepositCycles.cycles / BigInt("1000000000000");
      const title = `${relevantCanister?.name}: Deposit Cycles (${cyclesT} T) `;
      const subtitle = relevantCanister?.canister_id.toString();
      return [title, subtitle || ""];
    } else if (enumIs(proposal.proposal_type, "LinkCanister")) {
      const title =
        "Link Canister: " + proposal.proposal_type.LinkCanister.name;
      const subtitle =
        proposal.proposal_type.LinkCanister.canister_id.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "UninstallCanister")) {
      const relevantCanisterId =
        proposal.proposal_type.UninstallCanister.canister_id;
      const relevantCanister = canisters.find(
        (c) => c.canister_id === relevantCanisterId
      );
      const title = `${relevantCanister?.name}: Uninstall canister `;
      const subtitle = relevantCanisterId.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "JoinRequest")) {
      const title =
        "Join request from " + proposal.proposal_type.JoinRequest.name;
      const subtitle = proposal.proposer.toString();
      return [title, subtitle];
    } else if (enumIs(proposal.proposal_type, "UpdateCanisterSettings")) {
      return ["TODO", "TODO"];
    } else {
      unreachable(proposal.proposal_type);
    }
  };

  return (
    <Card className="shadow md:flex sm:rounded-lg">
      <div className="flex flex-1 flex-col space-y-2 ">
        <h1 className="text-base leading-6 font-bold truncate">
          {getProposalText()[0]}
        </h1>
        <p className="text-sm leading-5 font-normal text-gray-500 truncate">
          {getProposalText()[1]}
        </p>
        <p className="text-sm leading-5 font-normal"></p>
      </div>
      <div className="flex mt-4 justify-between">
        <div className="md:ml-5">
          <VoteDisplay
            total={members.filter((m) => m.can_vote).length}
            approved={proposal.yes_votes.length}
            rejected={proposal.no_votes.length}
          />
        </div>
        <div className="flex flex-col md:ml-8 lg:ml-20 xl:ml-24 w-18 space-y-4">
          {!votedNo && !votedYes && (
            <>
              <Button
                color="green"
                disabled={isAnonymous || working === "no"}
                working={working === "yes"}
                className="text-xs leading-4 justify-center"
                onClick={() => {
                  vote(proposal.proposal_id, true);
                }}
              >
                Approve
              </Button>
              <Button
                color="red"
                disabled={isAnonymous || working === "yes"}
                working={working === "no"}
                className="text-xs leading-4 justify-center"
                onClick={() => {
                  vote(proposal.proposal_id, false);
                }}
              >
                Reject
              </Button>
            </>
          )}
          {votedYes && (
            <Badge text="Voted YES" color="green" className="my-auto"></Badge>
          )}
          {votedNo && <Badge text="Voted NO" color="red"></Badge>}
        </div>
      </div>
    </Card>
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
      return (
        <div className="flex items-center justify-between">
          <Badge text="Rejected by you" color="red"></Badge>
        </div>
      );
    case UserVote.Yes:
      return (
        <div className="flex items-center justify-between">
          <Badge text="Approved by you" color="green"></Badge>
        </div>
      );
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
        return (
          <div className="flex items-center justify-between">
            <Badge text="Did not vote" color="gray"></Badge>
          </div>
        );
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
  const [currentTab, setCurrentTab] = useState<Tab>("All proposals");

  type Tab = "All proposals" | "Canister updates" | "Members";
  const tabs: Array<{ name: Tab; href: string }> = [
    { name: "All proposals", href: "#" },
    { name: "Canister updates", href: "#" },
    { name: "Members", href: "#" },
  ];

  const filterProposals = (filter: Tab) => {
    if (filter === "All proposals") {
      return proposals;
    } else if (filter === "Members") {
      return proposals?.filter(
        (p) =>
          enumIs(p.proposal_type, "AddMember") ||
          enumIs(p.proposal_type, "RemoveMember") ||
          enumIs(p.proposal_type, "JoinRequest")
      );
    } else if (filter === "Canister updates") {
      return proposals?.filter(
        (p) =>
          !(
            enumIs(p.proposal_type, "AddMember") ||
            enumIs(p.proposal_type, "RemoveMember") ||
            enumIs(p.proposal_type, "JoinRequest")
          )
      );
    }
    unreachable(filter);
  };

  const memberFilteredProposals = filterProposals("Members");
  const canisterFilteredProposals = filterProposals("Canister updates");
  const currentProposals = filterProposals(currentTab);

  const InProgressProposals = currentProposals?.filter((p) =>
    enumIs(p.proposal_status, "InProgress")
  );

  const NotInProgressProposals = currentProposals?.filter(
    (p) => !enumIs(p.proposal_status, "InProgress")
  );

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
      <PageHeading
        crumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Proposals", href: "#" },
        ]}
        pageTitle="Proposals"
        className="drop-shadow-none"
      >
        <Link href="/proposals/new">
          <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ">
            New Proposal
          </a>
        </Link>
      </PageHeading>
      <div className=" bg-white ">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full pl-3 pr-10 py-2 text-base border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue={currentTab}
            onChange={(e) => setCurrentTab(e.target.value as Tab)}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px px-6 lg:px-8 max-w-7xl  mx-auto flex space-x-8">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                onClick={() => setCurrentTab(tab.name)}
                className={classNames(
                  tab.name === currentTab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex"
                )}
                aria-current={tab.name === currentTab ? "page" : undefined}
              >
                {tab.name}
                {tab.name !== "All proposals" && (
                  <Badge
                    color="indigo"
                    text={
                      (tab.name === "Canister updates"
                        ? canisterFilteredProposals?.length.toString()
                        : memberFilteredProposals?.length.toString()) || ""
                    }
                    className={"ml-3"}
                  ></Badge>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {InProgressProposals &&
          InProgressProposals.length === 0 &&
          NotInProgressProposals &&
          NotInProgressProposals.length === 0 && (
            <div className="flex p-16 justify-center items-center text-xl">
              No proposals yet
            </div>
          )}

        {InProgressProposals &&
          InProgressProposals.length > 0 &&
          daoMembers &&
          canisters &&
          authClient && (
            <div className="flex flex-col space-y-4 mb-4 md:mb-8 ">
              {InProgressProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.proposal_id.toString()}
                  proposal={proposal}
                  members={daoMembers}
                  canisters={canisters}
                  currentUserPrincipal={authClient.getIdentity().getPrincipal()}
                  vote={vote}
                  working={working[proposal.proposal_id.toString()]}
                ></ProposalCard>
              ))}{" "}
            </div>
          )}

        {NotInProgressProposals &&
          NotInProgressProposals.length > 0 &&
          !proposalsLoading &&
          daoMembers &&
          !daoMembersLoading &&
          canisters &&
          !canistersLoading && (
            <>
              <h1 className="text-2xl leading-9 font-medium mb-4 ">
                Executed Proposals
              </h1>
              <div className="shadow overflow-x-scroll border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        DATETIME
                      </th>
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
                    {NotInProgressProposals &&
                      NotInProgressProposals.slice()
                        .reverse()
                        .map((proposal, personIdx) => (
                          <tr
                            key={proposal.proposal_id.toString()}
                            className={
                              personIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                              {new Date(
                                Number(proposal.proposal_date) / 1_000_000
                              ).toLocaleDateString()}
                            </td>
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
                                {
                                  <Badge
                                    text={getProposalStatusName(
                                      proposal.proposal_status
                                    )}
                                    color={
                                      getProposalStatusName(
                                        proposal.proposal_status
                                      ) === "Executed"
                                        ? "blue"
                                        : "red"
                                    }
                                  ></Badge>
                                }
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
                                working={
                                  working[proposal.proposal_id.toString()]
                                }
                              ></VoteInfo>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </main>
    </div>
  );
};

export default Proposals;
