use ic_cdk::export::Principal;
use ic_cdk::export::candid::{CandidType, Deserialize};
use std::cell::RefCell;
use ic_cdk_macros::{query, update};
use ic_cdk::api::caller;


#[derive(CandidType)]
enum ProposalType {
    AddController,
    RemoveController,
    CreateCanister,
    InstallCanister, 
    DeleteCanister,
    StartCanister,
    StopCanister, 
    UpdateCanisterSettings
}

#[derive(CandidType)]
enum ProposalStatus {
    InProgress,
    Accepted,
    Rejected
}

#[derive(CandidType)]
struct Proposal {
    pub proposal_number: u128,
    pub proposer: Principal,
    pub proposal_date: u128,
    pub proposal_type: ProposalType,
    pub proposal_status: ProposalStatus,
    pub yes_votes: Vec<Principal>,
    pub no_votes: Vec<Principal>,    
}

#[derive(Clone, CandidType, Deserialize)]
struct Member {
    pub principal_id: Principal,
    pub name: String
}

#[derive(CandidType)]
struct State {
    members: RefCell<Vec<Member>>,
    proposals: Vec<Proposal>
}

impl Default for State {
    fn default() -> Self {
        Self {
            members: RefCell::new(vec!{}),
            proposals: vec![]
        }
    }
}

thread_local! {
    static STATE: State = State::default();
}


#[query]
fn get_members() -> Vec<Member> {
    STATE.with(|s| {
        return s.members.borrow().clone();
    })
}

#[update]
fn take_control(name : String) -> bool {
    let principal_id = caller();
    if principal_id == Principal::anonymous() {
        return false; 
    }
    let members_empty = STATE.with(|s| {
        s.members.borrow().len() == 0 
    });
    if members_empty {
        let new_member  = Member {
            principal_id,
            name
        };
        add_member(new_member);
    }
    //TODO: replace with response message enum
    return members_empty;
}

fn add_member(new_member:Member){
    STATE.with(|s| {
        s.members.borrow_mut().push(new_member)
    })
} 

fn main(){}