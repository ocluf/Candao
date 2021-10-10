dfx start --background
git submodule update --init --recursive
cd internet-identity
npm install
II_ENV=development dfx deploy --no-wallet --argument '(null)'
cd ../src/candao_assets
npm install
cd ../..
dfx deploy
npm start