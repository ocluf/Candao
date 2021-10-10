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

  canisters =
    network === "local"
      ? { ...(localCanisters || {}), ...(localIiCanister || {}) }
      : prodCanisters;

  // console.log(canisters);

  // for (const canister in canisters) {
  //   process.env[canister.toUpperCase() + "_CANISTER_ID"] =
  //     canisters[canister][network];
  // }
  return canisters;
}
const canisterIds = initCanisterIds();

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: Object.assign(
    {},
    ...Object.keys(canisterIds)
      .filter((canisterName) => canisterName !== "__Candid_UI")
      .map((canisterName) => ({
        [canisterName.toUpperCase() + "_CANISTER_ID"]:
          canisterIds[canisterName].local,
      }))
  ),
};
