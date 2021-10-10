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
