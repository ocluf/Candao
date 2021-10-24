import { Principal } from "@dfinity/principal";
import {
  Canister,
  CanisterStatus,
  Member,
  Proposal,
  ProposalStatus,
  ProposalType,
} from "../declarations/candao/candao.did";
import Proposals from "../pages/proposals";
import { enumIs, KeysOfUnion } from "./enums";
import { resolveMemberPrincipalId, shortenPrincipalId } from "./members";
import { unreachable } from "./unreachable";

export const proposalNameMap: Record<KeysOfUnion<ProposalType>, string> = {
  AddMember: "Add Member",
  CreateCanister: "Create Canister",
  DeleteCanister: "Delete Canister",
  InstallCanister: "Install Canister",
  LinkCanister: "Link Canister",
  RemoveMember: "Remove Member",
  StartCanister: "Start Canister",
  StopCanister: "Stop Canister",
  UpdateCanisterSettings: "Update Canister Settings",
  DepositCycles: "Deposit Cycles",
  UninstallCanister: "Uninstall Canister"
};

export function getProposalTypeName(proposal: ProposalType): string {
  if (enumIs(proposal, "AddMember")) {
    return "Add Member";
  } else if (enumIs(proposal, "CreateCanister")) {
    return "Create Canister";
  } else if (enumIs(proposal, "DeleteCanister")) {
    return "Delete Canister";
  } else if (enumIs(proposal, "InstallCanister")) {
    return "Install Canister";
  } else if (enumIs(proposal, "LinkCanister")) {
    return "Link Canister";
  } else if (enumIs(proposal, "RemoveMember")) {
    return "Remove Member";
  } else if (enumIs(proposal, "StartCanister")) {
    return "Start Canister";
  } else if (enumIs(proposal, "StopCanister")) {
    return "Stop Canister";
  } else if (enumIs(proposal, "UpdateCanisterSettings")) {
    return "Update Canister Settings";
  } else if (enumIs(proposal, "DepositCycles")){
    return "Deposit Cycles";
  } else if (enumIs(proposal, "UninstallCanister")){
    return "Uninstall Canister"
  }

  unreachable(proposal);
}

export function getProposalSummary(
  proposal: Proposal,
  members: Member[],
  canisters: Canister[]
): string {
  const proposalType = proposal.proposal_type;
  if (enumIs(proposalType, "AddMember")) {
    return `Add ${proposalType.AddMember.name} as ${shortenPrincipalId(
      proposalType.AddMember.principal_id.toString()
    )}`;
  } else if (enumIs(proposalType, "CreateCanister")) {
    return `Create and link a new canister`;
  } else if (enumIs(proposalType, "DeleteCanister")) {
    // return `Delete ${proposal.DeleteCanister.canister_id}`;
    return `Delete a canister`;
  } else if (enumIs(proposalType, "InstallCanister")) {
    return `${getInstallModeName(proposalType.InstallCanister.mode)} canister ${
      proposalType.InstallCanister.canister_id
    }`;
  } else if (enumIs(proposalType, "LinkCanister")) {
    return `Link canister ${proposalType.LinkCanister.canister_id}`;
  } else if (enumIs(proposalType, "RemoveMember")) {
    return `Remove ${resolveMemberPrincipalId(
      members,
      proposalType.RemoveMember
    )}`;
  } else if (enumIs(proposalType, "StartCanister")) {
    return `Start Canister X`;
  } else if (enumIs(proposalType, "StopCanister")) {
    return `Stop Canister X`;
  } else if (enumIs(proposalType, "UpdateCanisterSettings")) {
    return `Update Canister X Settings`;
  } else if (enumIs(proposalType, "DepositCycles")){
    return "Deposit cycles to canister X from DAO Canister";
  } else if (enumIs(proposalType, "UninstallCanister")){
    return "Remove code from a canister";
  }

  unreachable(proposalType);
}

export const proposalStatusNameMap: Record<
  KeysOfUnion<ProposalStatus>,
  string
> = {
  Executed: "Executed",
  Failed: "Failed",
  Rejected: "Rejected",
  InProgress: "Voting",
};

export function getProposalStatusName(status: ProposalStatus): string {
  if (enumIs(status, "Executed")) {
    return "Executed";
  }
  if (enumIs(status, "Failed")) {
    return "Failed";
  }
  if (enumIs(status, "Rejected")) {
    return "Rejected";
  }
  if (enumIs(status, "InProgress")) {
    return "Voting";
  }
  unreachable(status);
}

export function getInstallModeName(
  mode: { reinstall: null } | { upgrade: null } | { install: null }
): string {
  if (enumIs(mode, "install")) {
    return "Install";
  }
  if (enumIs(mode, "reinstall")) {
    return "Reinstall";
  }
  if (enumIs(mode, "upgrade")) {
    return "Upgrade";
  }
  unreachable(mode);
}

export function getCanisterStatusName(
  status: { 'stopped' : null } |
  { 'stopping' : null } |
  { 'running' : null } 
){
  if(enumIs(status, "running")){
    return "Running";
  } else if (enumIs(status, "stopped")){
    return "Stopped";
  } else if(enumIs(status,"stopping")){
    return "Running";
  } 
  unreachable(status);
}

export enum UserVote {
  NotVoted,
  Yes,
  No,
}

export function getUserVote(
  proposal: Proposal,
  userPrincipal: Principal
): UserVote {
  if (
    proposal.yes_votes.find(
      (principal) => principal.toString() === userPrincipal.toString()
    )
  )
    return UserVote.Yes;
  if (
    proposal.no_votes.find(
      (principal) => principal.toString() === userPrincipal.toString()
    )
  )
    return UserVote.No;
  return UserVote.NotVoted;
}
