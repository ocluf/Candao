dfx start --background
git submodule update --init --recursive
cd internet-identity
npm install
II_ENV=development dfx deploy --no-wallet --argument '(null)'
II_CANISTER_ID=$(dfx canister --no-wallet id internet_identity)
cd ..

cat <<EOF >| local_canisters.json
   {
    "II_LOCAL_UI_CANISTER_ID": "$II_CANISTER_ID"
   }
EOF
npm install
dfx deploy
npm start