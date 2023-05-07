#! /bin/bash

set -e

# Settings
[ -z "$PACKAGES_LOCATION" ] && PACKAGES_LOCATION=dist
[ -z "$ARTIFACT_NAME" ]     && ARTIFACT_NAME=sharedModules

echo "--- Layers Packaging [2/4] Installing production packages..."
npm install --frozen-lockfile --prod --ignore-scripts

echo "--- Layers Packaging [3/4] Running 'node-prune'..."
mkdir -p nodejs $PACKAGES_LOCATION
cp -r node_modules nodejs
./node-prune nodejs/node_modules
rm -rf $ARTIFACT_NAME.zip

echo "--- Layers Packaging [4/4] Packaging '$ARTIFACT_NAME'..."
# Delete aws-sdk because AWS already has it in the runtime
rm -rf nodejs/node_modules/aws-sdk || :
rm -rf nodejs/node_modules/typescript || :
zip -rq $ARTIFACT_NAME.zip nodejs

echo "--- Layers Packaging [4/4] Done!"
cp $ARTIFACT_NAME.zip $PACKAGES_LOCATION/
rm -rf nodejs && rm node-prune