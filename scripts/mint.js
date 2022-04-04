const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require("web3");
const fs = require('fs');
const path = require("path");
require('dotenv').config()

const MNEMONIC = process.env.MNEMONIC
const API_KEY = process.env.NODE_KEY

const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const CONTRACT_NAME = process.env.CONTRACT_NAME
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const MINT_GENERAL = process.env.MINT_GENERAL

const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${API_KEY}`
const NUM_ITEMS = 5;

const RINKEBY = `wss://rinkeby.infura.io/ws/v3/${API_KEY}`

//*Parse the contract artifact for ABI reference.
let rawdata = fs.readFileSync(path.resolve(__dirname, `../build/contracts/${CONTRACT_NAME}.json`));
let contractAbi = JSON.parse(rawdata);
const CONTRACT_ABI = contractAbi.abi

async function mint() {
    try {
      //*define web3, contract and wallet instances
      const provider = new HDWalletProvider(
          MNEMONIC,
          RINKEBY
      );

      const web3Instance = new web3(provider);

      const contract = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS,
      );

      //* just mint 
      await contract.methods
          .mint(1)
          .send({ from: OWNER_ADDRESS, value: web3.utils.toWei(1, 'finney') }).then(console.log('minted')).catch(error => console.log(error));

      /*
      for (var i = 1; i < NUM_ITEMS; i++) {
          await contract.methods
              .mintItem(OWNER_ADDRESS, `https://ipfs.io/ipfs/QmZ13J2TyXTKjjjA46rYErRQYxEKjGtG6qyxUSXwhJZmZt/${i}.json`)
              .send({ from: OWNER_ADDRESS }).then(console.log('minted')).catch(error => console.log(error));
      }
      */
    }

    catch (e) {
      console.log(e)
    }
}

//invoke
mint().then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});
