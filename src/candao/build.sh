#!/usr/bin/env bash
set -euo pipefail

CANDAO_DIR="$(dirname "$0")"
TARGET="wasm32-unknown-unknown"

cargo build --manifest-path "$CANDAO_DIR/Cargo.toml" --target $TARGET --release -j1

# keep version in sync with Dockerfile
cargo install ic-cdk-optimizer --version 0.3.1 --root "$CANDAO_DIR"/../../target
STATUS=$?

if [ "$STATUS" -eq "0" ]; then
      "$CANDAO_DIR"/../../target/bin/ic-cdk-optimizer \
      "$CANDAO_DIR/../../target/$TARGET/release/candao.wasm" \
      -o "$CANDAO_DIR/../../target/$TARGET/release/candao.wasm"

  true
else
  echo Could not install ic-cdk-optimizer.
  false
fi
