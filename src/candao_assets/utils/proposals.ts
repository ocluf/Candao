import {
  Canister,
  Member,
  Proposal,
  ProposalType,
} from "../declarations/candao/candao.did";
import { enumIs, KeysOfUnion } from "./enums";
import { resolveMemberPrincipalId } from "./members";
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
    return `Add ${proposalType.AddMember.name} as ${proposalType.AddMember.principal_id}`;
  } else if (enumIs(proposalType, "CreateCanister")) {
    return `Create and link a new canister`;
  } else if (enumIs(proposalType, "DeleteCanister")) {
    // return `Delete ${proposal.DeleteCanister.canister_id}`;
    return `Delete a canister`;
  } else if (enumIs(proposalType, "InstallCanister")) {
    return `${proposalType.InstallCanister.mode} canister ${proposalType.InstallCanister.canister_id}`;
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
  }

  unreachable(proposalType);
}
