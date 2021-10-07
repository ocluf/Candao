use ic_cdk::export::Principal;

enum  ProposalType {
    AddController,
    RemoveController,
    CreateCanister,
    InstallCanister, 
    DeleteCanister,
    StartCanister,
    StopCanister, 
    UpdateCanisterSettings
}

enum ProposalStatus {
    InProgress,
    Accepted,
    Rejected
}

struct Proposal {
    pub proposal_number: u128,
    pub proposer: Principal,
    pub proposal_date: u128,
    pub proposal_type: ProposalType,
    pub proposal_status: ProposalStatus,
    pub yes_votes: Vec<Principal>,
    pub no_votes: Vec<Principal>,    
}

struct Member {
    pub principal: Principal,
    pub name: String
}


#[ic_cdk_macros::query]
fn get_members() {
    ic_cdk::print("Hello World");
}

fn main(){}