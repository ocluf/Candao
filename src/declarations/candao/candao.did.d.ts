import type { Principal } from '@dfinity/principal';
export interface Member { 'name' : string, 'principal_id' : Principal }
export interface Proposal {
  'yes_votes' : Array<Principal>,
  'proposal_status' : ProposalStatus,
  'proposer' : Principal,
  'no_votes' : Array<Principal>,
  'proposal_date' : bigint,
  'proposal_type' : ProposalType,
}
export type ProposalStatus = { 'in_progress' : null } |
  { 'rejected' : null } |
  { 'accepted' : null };
export type ProposalType = { 'stop_canister' : null } |
  { 'add_member' : [Member] } |
  { 'install_canister' : null } |
  { 'start_canister' : null } |
  { 'remove_member' : null } |
  { 'delete_canister' : null } |
  { 'create_canister' : null } |
  { 'update_canister_settings' : null };
export interface _SERVICE {
  'get_members' : () => Promise<Array<Member>>,
  'get_proposals' : () => Promise<Array<Proposal>>,
  'take_control' : (arg_0: string) => Promise<boolean>,
}
