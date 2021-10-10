const path = require("path");

function initCanisterIds() {
  let localCanisters, localIiCanister, prodCanisters, canisters;
  try {
    localCanisters = require(path.resolve(
      "..",
      "..",
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    localIiCanister = require(path.resolve(
      "..",
      "..",
      "internet-identity",
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log(
      "No local internet-identity canister_ids.json found. Continuing production"
    );
  }
  try {
    prodCanisters = require(path.resolve("..", "..", "canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  console.log(network);

  const canisterIds =
    network === "local"
      ? { ...(localCanisters || {}), ...(localIiCanister || {}) }
      : prodCanisters;

  // console.log(canisters);

  return { canisterIds, network };
}
const { canisterIds, network } = initCanisterIds();

// console.log(
//   Object.assign(
//     {},
//     ...Object.keys(canisterIds)
//       .filter((canisterName) => canisterName !== "__Candid_UI")
//       .map((canisterName) => ({
//         [canisterName.toUpperCase() + "_CANISTER_ID"]:
//           canisterIds[canisterName].local,
//       }))
//   )
// );

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: Object.assign(
    {
      DFX_NETWORK: network,
    },
    ...Object.keys(canisterIds)
      .filter((canisterName) => canisterName !== "__Candid_UI")
      .map((canisterName) => ({
        [canisterName.toUpperCase() + "_CANISTER_ID"]:
          canisterIds[canisterName][network],
      }))
  ),
};
