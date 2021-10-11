export const idlFactory = ({ IDL }) => {
  const Member = IDL.Record({
    'name' : IDL.Text,
    'principal_id' : IDL.Principal,
  });
  const ProposalStatus = IDL.Variant({
    'in_progress' : IDL.Null,
    'rejected' : IDL.Null,
    'accepted' : IDL.Null,
  });
  const ProposalType = IDL.Variant({
    'stop_canister' : IDL.Null,
    'add_member' : IDL.Tuple(Member),
    'install_canister' : IDL.Null,
    'start_canister' : IDL.Null,
    'remove_member' : IDL.Null,
    'delete_canister' : IDL.Null,
    'create_canister' : IDL.Null,
    'update_canister_settings' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'yes_votes' : IDL.Vec(IDL.Principal),
    'proposal_status' : ProposalStatus,
    'proposer' : IDL.Principal,
    'no_votes' : IDL.Vec(IDL.Principal),
    'proposal_date' : IDL.Nat,
    'proposal_type' : ProposalType,
  });
  return IDL.Service({
    'get_members' : IDL.Func([], [IDL.Vec(Member)], ['query']),
    'get_proposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'take_control' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
