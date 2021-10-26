use candid;
use candid::{CandidType, Deserialize};
use canister_management::{
    canister_status, create_canister, delete_canister, deposit_cycles, install_code,
    start_canister, stop_canister, uninstall_code, update_settings, CanisterId,
    CanisterInstallArgs, CanisterStatus, CreateCanisterArgs, UpdateSettingsArg,
};
use ic_cdk::api::call::CallResult;
use ic_cdk::api::{caller, time};
use ic_cdk::export::Principal;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;

mod canister_management;
mod lifecycle;

#[derive(Clone, CandidType, Deserialize)]
struct Member {
    pub principal_id: Principal,
    pub name: String,
    pub description: String,
    pub can_vote: bool,
}

#[derive(Clone, CandidType, Deserialize)]
struct InvitationRequest {
    pub name: String,
    pub message: String,
}

#[derive(Clone, CandidType, Deserialize)]
struct InvitationStatus {
    pub name: String,
    pub message: String,
    pub status: ProposalStatus,
}

#[derive(Clone, CandidType, Deserialize)]
enum ProposalType {
    AddMember(Member),
    RemoveMember(Principal),
    JoinRequest(InvitationRequest),
    CreateCanister {
        create_args: CreateCanisterArgs,
        name: String,
        description: String,
    },
    LinkCanister(Canister),
    InstallCanister(CanisterInstallArgs),
    UninstallCanister(CanisterId),
    DeleteCanister(CanisterId),
    StartCanister(CanisterId),
    StopCanister(CanisterId),
    UpdateCanisterSettings(UpdateSettingsArg),
    DepositCycles(CanisterId),
}

#[derive(Clone, CandidType, Deserialize)]
enum ProposalStatus {
    InProgress,
    Executed,
    Failed(String),
    Rejected,
}

#[derive(Clone, CandidType, Deserialize)]
struct Proposal {
    pub proposal_id: u64,
    pub proposer: Principal,
    pub proposal_date: u64,
    pub proposal_type: ProposalType,
    pub proposal_status: ProposalStatus,
    pub yes_votes: Vec<Principal>,
    pub no_votes: Vec<Principal>,
}

#[derive(Clone, CandidType, Deserialize)]
enum Vote {
    Yes,
    No,
}

#[derive(CandidType, Deserialize)]
enum TakeControlResponse {
    Success,
    NoAnonymous,
    AlreadyTaken,
}

#[derive(CandidType, Deserialize)]
enum CreateProposalResponse {
    Success,
    NoPermission,
    CanisterAlreadyAdded,
    MemberAlreadyAdded,
    InvitationExists,
}

#[derive(CandidType, Deserialize)]
enum UpdateResponse {
    Success,
    NoPermission,
}

#[derive(CandidType, Deserialize)]
enum VoteResponse {
    VoteCast,
    NoPermission,
    AlreadyVoted,
    InvalidProposalId,
    AlreadyDecided,
}

#[derive(Clone, CandidType, Deserialize)]
struct DaoInfo {
    title: String,
    description: String,
}

#[derive(Clone, CandidType, Deserialize)]
struct Canister {
    pub canister_id: Principal,
    pub name: String,
    pub description: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct State {
    info: DaoInfo,
    members: Vec<Member>,
    proposals: Vec<Proposal>,
    canisters: Vec<Canister>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            info: DaoInfo {
                title: "CanDAO".to_string(),
                description: "".to_string(),
            },
            members: vec![],
            proposals: vec![],
            canisters: vec![],
        }
    }
}

thread_local! {
    pub static STATE: RefCell<State> = RefCell::default()
}

#[candid::candid_method]
#[update]
fn take_control() -> TakeControlResponse {
    let principal_id = caller();
    // TODO Uncomment when finished developping for now allow anonymous id for CandidUI
    // if principal_id == Principal::anonymous() {
    //     return TakeControlResponse::NoAnonymous;
    // }
    let members_empty = STATE.with(|s| s.borrow().members.len() == 0);
    if members_empty {
        let new_member = Member {
            principal_id: principal_id,
            name: "".to_string(),
            description: "".to_string(),
            can_vote: true,
        };
        add_member(new_member);
        return TakeControlResponse::Success;
    }
    return TakeControlResponse::AlreadyTaken;
}

#[candid::candid_method]
#[update]
async fn create_proposal(proposal_type: ProposalType) -> CreateProposalResponse {
    let proposer = caller();

    let is_public_request = match &proposal_type {
        ProposalType::JoinRequest(_) => true,
        _ => false,
    };

    if !is_public_request && !is_member(proposer) {
        return CreateProposalResponse::NoPermission;
    }

    match proposal_type {
        ProposalType::JoinRequest(_) => {
            if STATE.with(|s| {
                s.borrow()
                    .members
                    .iter()
                    .find(|m| m.principal_id == proposer)
                    .is_some()
            }) {
                return CreateProposalResponse::MemberAlreadyAdded;
            }
            if STATE.with(|s| {
                s.borrow()
                    .proposals
                    .iter()
                    .rev()
                    .find(|m| m.proposer == proposer)
                    .filter(|p| matches!(p.proposal_status, ProposalStatus::InProgress))
                    .is_some()
            }) {
                return CreateProposalResponse::InvitationExists;
            }
        }
        ProposalType::LinkCanister(ref canister) => {
            if STATE.with(|s| {
                s.borrow()
                    .canisters
                    .iter()
                    .find(|c| c.canister_id == canister.canister_id)
                    .is_some()
            }) {
                return CreateProposalResponse::CanisterAlreadyAdded;
            }
        }
        _ => {}
    };

    let proposal_id = STATE.with(|s| {
        let state = &mut s.borrow_mut();

        let can_proposer_vote = state
            .members
            .iter()
            .find(|m| m.principal_id == proposer)
            .filter(|m| m.can_vote)
            .is_some();

        let yes_votes = if is_public_request || !can_proposer_vote {
            vec![]
        } else {
            vec![proposer]
        };

        let next_id = state.proposals.len() as u64;
        let proposal = Proposal {
            proposal_id: next_id,
            proposer,
            proposal_date: time(),
            proposal_type: proposal_type,
            proposal_status: ProposalStatus::InProgress,
            yes_votes,
            no_votes: vec![],
        };
        state.proposals.push(proposal);
        next_id
    });
    check_votes(proposal_id).await;

    return CreateProposalResponse::Success;
}

#[candid::candid_method]
#[update]
async fn vote(proposal_id: u64, ballot: Vote) -> VoteResponse {
    let voter = caller();

    let member = find_member(voter);
    if member.is_none() {
        return VoteResponse::NoPermission;
    }
    let member = member.unwrap();

    if !member.can_vote {
        return VoteResponse::NoPermission;
    }

    let proposal = find_proposal(proposal_id);
    if proposal.is_none() {
        return VoteResponse::InvalidProposalId;
    }
    let proposal = proposal.unwrap();

    if !matches!(proposal.proposal_status, ProposalStatus::InProgress) {
        return VoteResponse::AlreadyDecided;
    }

    let voted_yes = proposal
        .yes_votes
        .into_iter()
        .find(|p| *p == member.principal_id)
        .is_some();

    let voted_no = proposal
        .no_votes
        .into_iter()
        .find(|p| *p == member.principal_id)
        .is_some();

    if voted_yes || voted_no {
        return VoteResponse::AlreadyVoted;
    }

    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let proposal = state
            .proposals
            .iter_mut()
            .find(|p| p.proposal_id == proposal_id)
            .unwrap();
        match ballot {
            Vote::Yes => {
                proposal.yes_votes.push(voter);
            }
            Vote::No => {
                proposal.no_votes.push(voter);
            }
        }
    });
    check_votes(proposal_id).await;
    return VoteResponse::VoteCast;
}

#[candid::candid_method]
#[update]
fn update_member_info(name: String, description: String) -> UpdateResponse {
    let caller = caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let optional_member = state.members.iter_mut().find(|m| m.principal_id == caller);
        match optional_member {
            Some(member) => {
                member.name = name;
                member.description = description;
                return UpdateResponse::Success;
            }
            None => return UpdateResponse::NoPermission,
        }
    })
}

#[candid::candid_method]
#[update]
fn update_dao_info(dao_info: DaoInfo) -> UpdateResponse {
    let caller = caller();
    if is_member(caller) {
        STATE.with(|s| s.borrow_mut().info = dao_info);
        return UpdateResponse::Success;
    }
    return UpdateResponse::NoPermission;
}

#[candid::candid_method(query)]
#[query]
fn get_members() -> Vec<Member> {
    STATE.with(|s| {
        return s.borrow().members.clone();
    })
}

#[candid::candid_method(query)]
#[query]
fn check_invitation_status() -> Option<InvitationStatus> {
    let caller = caller();
    STATE.with(|s| {
        match s.borrow().proposals.iter().rev().find(|p| {
            p.proposer == caller && matches!(p.proposal_type, ProposalType::JoinRequest(_))
        }) {
            None => None,
            Some(proposal) => match &proposal.proposal_type {
                ProposalType::JoinRequest(request) => Some(InvitationStatus {
                    status: proposal.proposal_status.clone(),
                    name: request.name.clone(),
                    message: request.message.clone(),
                }),
                _ => None,
            },
        }
    })
}

#[candid::candid_method(query)]
#[query]
fn get_canisters() -> Vec<Canister> {
    STATE.with(|s| {
        return s.borrow().canisters.clone();
    })
}

#[candid::candid_method]
#[update]
async fn get_canister_status(canister_id: Principal) -> Option<CanisterStatus> {
    let arg = CanisterId {
        canister_id: canister_id,
    };
    let result = canister_status(arg).await;
    match result {
        Ok((status,)) => {
            ic_cdk::println!("{:?}", status.clone());
            Some(status)
        },
        Err(_) => None,
    }
}

#[candid::candid_method(query)]
#[query]
fn get_proposals() -> Vec<Proposal> {
    STATE.with(|s| {
        return s.borrow().proposals.clone();
    })
}

#[candid::candid_method(query)]
#[query]
fn get_dao_info() -> DaoInfo {
    STATE.with(|s| {
        return s.borrow().info.clone();
    })
}

async fn check_votes(proposal_id: u64) {
    let proposal = find_proposal(proposal_id);
    if proposal.is_none() {
        return;
    }
    let proposal = proposal.unwrap();
    if !matches!(proposal.proposal_status, ProposalStatus::InProgress) {
        return;
    }
    let total_members = STATE.with(|s| {
        return s.borrow().members.iter().filter(|m| m.can_vote).count();
    });

    let majority = total_members / 2 + 1;
    let nr_of_yes = proposal.yes_votes.len();
    let nr_of_no = proposal.no_votes.len();
    if nr_of_yes > nr_of_no && nr_of_yes >= majority {
        let result = execute(&proposal).await;
        match result {
            Ok(_) => set_proposal_status(proposal_id, ProposalStatus::Executed),
            Err(error_message) => set_proposal_status(proposal_id, ProposalStatus::Failed(error_message)),
        }
    } else {
        let majority_of_no = nr_of_no > nr_of_yes && nr_of_no >= majority;
        let equal_yes_and_no = nr_of_no == nr_of_yes && nr_of_no + nr_of_yes == total_members;
        if majority_of_no || equal_yes_and_no {
            set_proposal_status(proposal_id, ProposalStatus::Rejected)
        }
    }
}

async fn execute(proposal: &Proposal) -> Result<(), String> {
    match &proposal.proposal_type {
        ProposalType::AddMember(member) => {
            STATE.with(|s| s.borrow_mut().members.push(member.clone()));
            return Err("this is a test string".to_string());
        }
        ProposalType::RemoveMember(principal) => STATE.with(|s| {
            s.borrow_mut()
                .members
                .retain(|m| m.principal_id != *principal);
            return Ok(());
        }),
        ProposalType::JoinRequest(invitation_request) => {
            let mut result= Ok(());
            STATE.with(|s| {
                match s.try_borrow_mut() {
                    Ok(mut state) => {
                        state.members.push(Member {
                            name: invitation_request.name.clone(),
                            description: invitation_request.message.clone(),
                            principal_id: proposal.proposer,
                            can_vote: true,
                        });

                    },
                    Err(e) => result = Err(e.to_string()),
                }
            });
            return result;
        }
        ProposalType::CreateCanister {
            create_args,
            name,
            description,
        } => {
            let result = create_canister(create_args.clone()).await;
            match result {
                Ok(canister_id) => {
                    STATE.with(|s| {
                        s.borrow_mut().canisters.push(Canister {
                            canister_id: canister_id.0.canister_id,
                            name: name.to_string(),
                            description: description.to_string(),
                        })
                    });
                    Ok(())
                }
                Err((_, error)) => return Err(error),
            }
        }
        ProposalType::LinkCanister(canister) => STATE.with(|s| {
            let canisters = &mut s.borrow_mut().canisters;

            if canisters
                .iter()
                .any(|c| c.canister_id == canister.canister_id)
            {
                return Err("canister already in DAO".to_string());
            }

            canisters.push(canister.clone());
            Ok(())
        }),
        ProposalType::InstallCanister(install_args) => {
            let result: CallResult<((),)> = install_code(install_args.clone()).await;
            match result {
                Ok(_) => Ok(()),
                Err((_, error)) => {
                    Err(error)
                }
            }
        }
        ProposalType::UninstallCanister(canister_id) => {
            let uninstall_result = uninstall_code(canister_id.clone()).await;
            match uninstall_result {
                Ok(_) => Ok(()),
                Err((_, error)) => Err(error),
            }
        }
        ProposalType::DeleteCanister(canister_id) => {
            let result = delete_canister(canister_id.clone()).await;
            match result {
                Ok(_) => STATE.with(|s| {
                    s.borrow_mut()
                        .canisters
                        .retain(|c| c.canister_id != canister_id.canister_id);
                    Ok(())
                }),
                Err((_, error)) => Err(error),
            }
        }
        ProposalType::StartCanister(canister_id) => {
            let start_result = start_canister(canister_id.clone()).await;
            match start_result {
                Ok(_) => Ok(()),
                Err((_, error)) => Err(error),
            }
        }
        ProposalType::StopCanister(canister_id) => {
            let stop_result = stop_canister(canister_id.clone()).await;
            match stop_result {
                Ok(_) => Ok(()),
                Err((_, error)) => Err(error),
            }
        }
        ProposalType::UpdateCanisterSettings(args) => {
            let update_result = update_settings(args.clone()).await;
            match update_result {
                Ok(_) => Ok(()),
                Err((_, error)) => Err(error),
            }
        }
        ProposalType::DepositCycles(canister_id) => {
            let result = deposit_cycles(canister_id.clone(), 1000000000).await;
            match result {
                Ok(_) => Ok(()),
                Err((_, error)) => Err(error),
            }
        }
    }
}

fn set_proposal_status(proposal_id: u64, status: ProposalStatus) {
    STATE.with(|s| {
        s.borrow_mut()
            .proposals
            .iter_mut()
            .find(|p| p.proposal_id == proposal_id)
            .unwrap()
            .proposal_status = status;
    })
}

fn find_proposal(id: u64) -> Option<Proposal> {
    return STATE.with(|s| {
        return s
            .borrow()
            .proposals
            .clone()
            .into_iter()
            .find(|p| p.proposal_id == id);
    });
}

fn find_member(principal: Principal) -> Option<Member> {
    return STATE.with(|s| {
        return s
            .borrow()
            .members
            .clone()
            .into_iter()
            .find(|m| m.principal_id == principal);
    });
}

fn is_member(principal: Principal) -> bool {
    STATE.with(|s| {
        s.borrow()
            .members
            .iter()
            .find(|m| m.principal_id == principal)
            .is_some()
    })
}

fn add_member(new_member: Member) {
    STATE.with(|s| s.borrow_mut().members.push(new_member))
}

fn main() {}

candid::export_service!();

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}
