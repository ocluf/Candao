# candao

A hackathon project by Ákos, Artem, and Fulco

## Install

1. Install DFX
   ```
   sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"
   ```
1. Run init script

   ```
   sh init.sh
   ```

   This will install Internet Identity in the local replica.

1. Open front-end at http://localhost:3000

## Run the frontend without deploying

```
cd src/candao_assets
yarn dev
```

Then open http://localhost:3000

## Deploy to the local replica

```
dfx deploy
```

## Deploy to the IC

```
dfx deploy --network ic --no-wallet
```

## Run tests

The test framework is [ic-repl](https://github.com/chenyan2002/ic-repl). `test.sh` will try to install it on mac or linux.

To run canister tests you need to have the project built (ie. existing wasm binaries).

```
sh test.sh
```
