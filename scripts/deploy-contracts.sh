#!/bin/bash

truffle migrate --network rinkeby
truffle deploy --network rinkeby
truffle run verify Markers --network rinkeby

#mkdir -p abis
#cp abis/Markers.json ../game/app/contracts/Markers.json
