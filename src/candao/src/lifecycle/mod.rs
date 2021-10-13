use candid::CandidType;
use serde::Deserialize;

mod pre_upgrade;
mod post_upgrade;

#[derive(CandidType, Deserialize, Copy, Clone, Debug)]
pub(crate) enum StableMemoryVersion {
    V1,
}
