use ic_cdk::api::{caller, time};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;
use std::convert::TryInto;

#[derive(Clone, CandidType, Deserialize)]
enum ProposalType {
    AddMember(Member),
    RemoveMember,
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
    Accepted,
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
struct Member {
    pub principal_id: Principal,
    pub name: String,
}

#[derive(CandidType)]
struct State {
    members: RefCell<Vec<Member>>,
    proposals: RefCell<Vec<Proposal>>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            members: RefCell::new(vec![]),
            proposals: RefCell::new(vec![]),
        }
    }
}

thread_local! {
    static STATE: State = State::default();
}

#[update]
fn take_control(name: String) -> bool {
    let principal_id = caller();
    if principal_id == Principal::anonymous() {
        return false;
    }
    let members_empty = STATE.with(|s| s.members.borrow().len() == 0);
    if members_empty {
        let new_member = Member { principal_id, name };
        add_member(new_member);
    }
    //TODO: replace with proper response message enum
    return members_empty;
}

#[update]
fn create_proposal(proposal_type: ProposalType) -> bool {
    let proposer = caller();
    if !is_member(proposer) {
        return false;
    }
    let proposal_id = STATE.with(|s| s.proposals.borrow().len().try_into().unwrap());
    let proposal = Proposal {
        proposal_id,
        proposer,
        proposal_date: time(),
        proposal_type: proposal_type,
        proposal_status: ProposalStatus::InProgress,
        yes_votes: vec![proposer],
        no_votes: vec![],
    };
    STATE.with(|s| s.proposals.borrow_mut().push(proposal));

    //TODO replace with proper response message enum
    return true;
}

#[query]
fn get_members() -> Vec<Member> {
    STATE.with(|s| {
        return s.members.borrow().clone();
    })
}

#[query]
fn get_proposals() -> Vec<Proposal> {
    STATE.with(|s| {
        return s.proposals.borrow().clone();
    })
}

fn is_member(principal: Principal) -> bool {
    STATE.with(|s| {
        s.members
            .borrow()
            .iter()
            .find(|m| m.principal_id == principal)
            .is_some()
    })
}

fn add_member(new_member: Member) {
    STATE.with(|s| s.members.borrow_mut().push(new_member))
}

fn emptssy() {}
fn main() {}
