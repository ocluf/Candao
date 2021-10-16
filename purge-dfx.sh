dfx stop

rm -rf src/candao/.dfx
rm -rf internet-identity/.dfx

dfx start --clean --no-artificial-delay --background

cd internet-identity

II_ENV=development dfx deploy --no-wallet --argument '(null)'

cd ..

dfx deploy