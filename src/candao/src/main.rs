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
    pub description: String,
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
pub struct State {
    info: DaoInfo,
    members: Vec<Member>,
    proposals: Vec<Proposal>,
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
        }
    }
}

thread_local! {
    pub static STATE: RefCell<State> = RefCell::default()
}

#[ic_cdk::export::candid::candid_method]
#[update]
fn take_control() -> TakeControlResponse {
    let principal_id = caller();
    if principal_id == Principal::anonymous() {
        return TakeControlResponse::NoAnonymous;
    }
    let members_empty = STATE.with(|s| s.borrow().members.len() == 0);
    if members_empty {
        let new_member = Member {
            principal_id: principal_id,
            name: "".to_string(),
            description: "".to_string(),
        };
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
    check_votes(proposal_id);

    return CreateProposalResponse::Success;
}

#[ic_cdk::export::candid::candid_method]
#[update]
fn vote(proposal_id: u64, ballot: Vote) -> VoteResponse {
    let voter = caller();

    let member = find_member(voter);
    if member.is_none() {
        return VoteResponse::NoPermission;
    }
    let member = member.unwrap();

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
    check_votes(proposal_id);
    return VoteResponse::VoteCast;
}

#[ic_cdk::export::candid::candid_method]
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

#[ic_cdk::export::candid::candid_method]
#[update]
fn update_dao_info(dao_info: DaoInfo) -> UpdateResponse {
    let caller = caller();
    if is_member(caller) {
        STATE.with(|s| s.borrow_mut().info = dao_info);
        return UpdateResponse::Success;
    }
    return UpdateResponse::NoPermission;
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

#[ic_cdk::export::candid::candid_method(query)]
#[query]
fn get_dao_info() -> DaoInfo {
    STATE.with(|s| {
        return s.borrow().info.clone();
    })
}

fn check_votes(proposal_id: u64) {
    let proposal = find_proposal(proposal_id);
    if proposal.is_none() {
        return;
    }
    let proposal = proposal.unwrap();
    if !matches!(proposal.proposal_status, ProposalStatus::InProgress) {
        return;
    }
    let total_members = STATE.with(|s| {
        return s.borrow().members.len();
    });

    let majority = total_members / 2 + 1;
    let nr_of_yes = proposal.yes_votes.len();
    let nr_of_no = proposal.no_votes.len();
    if nr_of_yes > nr_of_no && nr_of_yes >= majority {
        let result = execute(&proposal);
        match result {
            Ok(_) => set_proposal_status(proposal_id, ProposalStatus::Executed),
            Err(_) => set_proposal_status(proposal_id, ProposalStatus::Failed),
        }
    } else {
        let majority_of_no = nr_of_no > nr_of_yes && nr_of_no >= majority;
        let equal_yes_and_no = nr_of_no == nr_of_yes && nr_of_no + nr_of_yes == total_members;
        if majority_of_no || equal_yes_and_no {
            set_proposal_status(proposal_id, ProposalStatus::Rejected)
        }
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

fn set_proposal_status(proposal_id: u64, status: ProposalStatus) {
    STATE.with(|s| {
        s.borrow_mut()
            .proposals
            .iter_mut()
            .find(|p| p.proposal_id == proposal_id)
            .unwrap()
            .proposal_status = ProposalStatus::Executed;
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

ic_cdk::export::candid::export_service!();

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}
