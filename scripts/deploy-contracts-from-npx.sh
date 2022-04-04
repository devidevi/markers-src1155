#!/bin/bash

npx truffle migrate --network rinkeby
npx truffle deploy --network rinkeby
npx truffle run verify Markers --network rinkeby

#mkdir -p abis
#cp abis/Markers.json ../game/app/contracts/Markers.json
