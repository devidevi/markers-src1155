#!/bin/bash

truffle compile --network rinkeby
truffle run verify Markers --network rinkeby

#mkdir -p abis
#cp abis/Markers.json ../game/app/contracts/Markers.json
