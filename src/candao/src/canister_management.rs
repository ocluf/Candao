use candid::Principal;
use ic_cdk::api::call::{call_with_payment, CallResult};
use ic_cdk::call;
use ic_cdk::export::candid::{CandidType, Deserialize};

#[derive(Clone, CandidType, Deserialize)]
pub struct CanisterSettings {
    pub controllers: Option<Vec<Principal>>,
    pub compute_allocation: Option<candid::Nat>,
    pub memory_allocation: Option<candid::Nat>,
    pub freezing_threshold: Option<candid::Nat>,
}

#[derive(CandidType, Clone, Deserialize)]
pub enum InstallMode {
    #[serde(rename = "install")]
    Install,
    #[serde(rename = "reinstall")]
    Reinstall,
    #[serde(rename = "upgrade")]
    Upgrade,
}

#[derive(CandidType, Clone, Deserialize)]
pub enum Status {
    #[serde(rename = "running")]
    Running,
    #[serde(rename = "stopping")]
    Stopping,
    #[serde(rename = "stopped")]
    Stopped,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CanisterId {
    pub canister_id: Principal,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct UpdateSettingsArg {
    canister_id: Principal,
    settings: CanisterSettings,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DefiniteCanisterSettings {
    controllers: Option<Vec<Principal>>,
    compute_allocation: Option<candid::Nat>,
    memory_allocation: Option<candid::Nat>,
    freezing_threshold: Option<candid::Nat>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct CreateCanisterArgs {
    settings: Option<CanisterSettings>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct CanisterInstallArgs {
    pub mode: InstallMode,
    pub canister_id: Principal,
    pub wasm: Vec<u8>,
    pub arg: Vec<u8>,
    // pub compute_allocation: Option<u64>,
    // pub memory_allocation: Option<u64>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct CanisterStatus {
    status: Status,
    settings: DefiniteCanisterSettings,
    module_hash: Option<Vec<u8>>,
    memory_size: candid::Nat,
    cycles: candid::Nat,
}

pub async fn create_canister(args: CreateCanisterArgs) -> CallResult<(CanisterId,)> {
    return call(Principal::management_canister(), "create_canister", (args,)).await;
}

pub async fn update_settings(args: UpdateSettingsArg) -> CallResult<((),)> {
    let update_settings_result =
        call(Principal::management_canister(), "update_settings", (args,)).await;
    return update_settings_result;
}

pub async fn install_code(args: CanisterInstallArgs) -> CallResult<((),)> {
    let install_result: CallResult<((),)> =
        call(Principal::management_canister(), "install_code", (args,)).await;
    return install_result;
}

pub async fn uninstall_code(args: CanisterId) -> CallResult<((),)> {
    let uninstall_result = call(Principal::management_canister(), "uninstall_code", (args,)).await;
    return uninstall_result;
}

pub async fn start_canister(args: CanisterId) -> CallResult<((),)> {
    let start_result = call(Principal::management_canister(), "start_canister", (args,)).await;
    return start_result;
}

pub async fn stop_canister(args: CanisterId) -> CallResult<((),)> {
    let stop_result = call(Principal::management_canister(), "stop_canister", (args,)).await;
    return stop_result;
}

pub async fn canister_status(args: CanisterId) -> CallResult<(CanisterStatus,)> {
    let canister_status = call(Principal::management_canister(), "canister_status", (args,)).await;
    return canister_status;
}

pub async fn delete_canister(args: CanisterId) -> CallResult<((),)> {
    let delete_result: CallResult<((),)> =
        call(Principal::management_canister(), "delete_canister", (args,)).await;
    return delete_result;
}

pub async fn deposit_cycles(canister_id: CanisterId, cycles: u64) -> CallResult<((),)> {
    let deposit_result: CallResult<((),)> = call_with_payment(
        Principal::management_canister(),
        "deposit_cycles",
        (canister_id,),
        cycles,
    )
    .await;
    return deposit_result;
}
