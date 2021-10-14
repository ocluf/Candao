use ic_cdk::api::{caller, time};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;
use std::convert::TryInto;

mod lifecycle;

#[derive(Clone, CandidType, Deserialize)]
struct Member {
    pub principal_id: Principal,
    pub name: String,
}

#[derive(Clone, CandidType, Deserialize)]
enum ProposalType {
    AddMember(Member),
    RemoveMember(Principal),
    CreateCanister,
    InstallCanister,
    DeleteCanister,
    StartCanister,
    StopCanister,
    UpdateCanisterSettings,
}

#[derive(Clone, CandidType, Deserialize)]
enum ProposalStatus {
    InProgress,
    Executed,
    Failed,
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
}

#[derive(CandidType, Deserialize)]
enum VoteResponse {
    VoteCast,
    NoPermission,
    AlreadyVoted,
    InvalidProposalId,
    AlreadyDecided,
}

#[derive(CandidType, Deserialize)]
pub struct State {
    members: Vec<Member>,
    proposals: Vec<Proposal>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            members: vec![],
            proposals: vec![],
        }
    }
}

thread_local! {
    pub static STATE: RefCell<State> = RefCell::default()
}

#[ic_cdk::export::candid::candid_method]
#[update]
fn take_control(name: String) -> TakeControlResponse {
    let principal_id = caller();
    if principal_id == Principal::anonymous() {
        return TakeControlResponse::NoAnonymous;
    }
    let members_empty = STATE.with(|s| s.borrow().members.len() == 0);
    if members_empty {
        let new_member = Member { principal_id, name };
        add_member(new_member);
        return TakeControlResponse::Success;
    }
    return TakeControlResponse::AlreadyTaken;
}

#[ic_cdk::export::candid::candid_method]
#[update]
fn create_proposal(proposal_type: ProposalType) -> CreateProposalResponse {
    let proposer = caller();
    if !is_member(proposer) {
        return CreateProposalResponse::NoPermission;
    }
    let proposal_id = STATE.with(|s| s.borrow().proposals.len().try_into().unwrap());
    let proposal = Proposal {
        proposal_id,
        proposer,
        proposal_date: time(),
        proposal_type: proposal_type,
        proposal_status: ProposalStatus::InProgress,
        yes_votes: vec![proposer],
        no_votes: vec![],
    };
    STATE.with(|s| s.borrow_mut().proposals.push(proposal));
    STATE.with(|s| check_votes(s.borrow_mut().proposals.last_mut().unwrap()));

    return CreateProposalResponse::Success;
}

#[ic_cdk::export::candid::candid_method]
#[update]
fn vote(proposal_id: u64, ballot: Vote) -> VoteResponse {
    let voter = caller();
    if !is_member(voter) {
        return VoteResponse::NoPermission;
    }
    STATE.with(|m| {
        match m
            .borrow_mut()
            .proposals
            .iter_mut()
            .find(|p| p.proposal_id == proposal_id)
        {
            Some(proposal) => {
                if !matches!(proposal.proposal_status, ProposalStatus::InProgress) {
                    return VoteResponse::AlreadyDecided;
                }
                if !proposal.no_votes.contains(&voter) && !proposal.yes_votes.contains(&voter) {
                    match ballot {
                        Vote::Yes => {
                            proposal.yes_votes.push(voter);
                        }
                        Vote::No => {
                            proposal.no_votes.push(voter);
                        }
                    }
                    check_votes(proposal);
                    return VoteResponse::VoteCast;
                } else {
                    return VoteResponse::AlreadyVoted;
                }
            }
            None => {
                return VoteResponse::InvalidProposalId;
            }
        }
    })
}

#[ic_cdk::export::candid::candid_method(query)]
#[query]
fn get_members() -> Vec<Member> {
    STATE.with(|s| {
        return s.borrow().members.clone();
    })
}

#[ic_cdk::export::candid::candid_method(query)]
#[query]
fn get_proposals() -> Vec<Proposal> {
    STATE.with(|s| {
        return s.borrow().proposals.clone();
    })
}

fn check_votes(proposal: &mut Proposal) {
    if !matches!(proposal.proposal_status, ProposalStatus::InProgress) {
        return;
    }
    let total_members = STATE.with(|s| s.borrow().members.len());
    let majority = total_members / 2 + 1;
    let nr_of_yes = proposal.yes_votes.len();
    let nr_of_no = proposal.no_votes.len();
    if nr_of_yes > nr_of_no && nr_of_yes >= majority {
        let result = execute(&proposal);
        match result {
            Ok(_) => proposal.proposal_status = ProposalStatus::Executed,
            Err(_) => proposal.proposal_status = ProposalStatus::Failed,
        }
    } else if nr_of_no > nr_of_yes && nr_of_no >= majority {
        proposal.proposal_status = ProposalStatus::Rejected;
    } else if nr_of_no == nr_of_yes && nr_of_no + nr_of_yes == total_members {
        proposal.proposal_status = ProposalStatus::Rejected;
    }
}

fn execute(proposal: &Proposal) -> Result<(), ()> {
    match &proposal.proposal_type {
        ProposalType::AddMember(member) => {
            STATE.with(|s| s.borrow_mut().members.push(member.clone()));
            return Ok(());
        }
        ProposalType::RemoveMember(principal) => STATE.with(|s| {
            s.borrow_mut()
                .members
                .retain(|m| m.principal_id != *principal);
            return Ok(());
        }),
        ProposalType::CreateCanister => todo!(),
        ProposalType::InstallCanister => todo!(),
        ProposalType::DeleteCanister => todo!(),
        ProposalType::StartCanister => todo!(),
        ProposalType::StopCanister => todo!(),
        ProposalType::UpdateCanisterSettings => todo!(),
    }
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

ic_cdk::export::candid::export_service!();

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}
