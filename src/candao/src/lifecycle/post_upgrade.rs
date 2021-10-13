use crate::lifecycle::StableMemoryVersion;
use crate::{State, STATE};
use ic_cdk_macros::post_upgrade;

#[post_upgrade]
fn post_upgrade() {
    ic_cdk::setup();

    let (stable_bytes,): (Vec<u8>,) =
        ic_cdk::storage::stable_restore().expect("Failed to read from stable memory");

    let data = deserialize_state(stable_bytes);

    STATE.with(|state| *state.borrow_mut() = data);
}

fn deserialize_state(stable_bytes: Vec<u8>) -> State {
    let (version_bytes, state_bytes): (Vec<u8>, Vec<u8>) =
        candid::decode_args(&stable_bytes).expect("Failed to deserialize stable memory");

    let version: StableMemoryVersion =
        candid::decode_one(&version_bytes).expect("Failed to deserialize version");

    match version {
        StableMemoryVersion::V1 => {
            candid::decode_one(&state_bytes).expect("Failed to deserialize state")
        }
    }
}
