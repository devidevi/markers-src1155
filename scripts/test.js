const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require("web3");
const fs = require('fs');
const path = require("path");
require('dotenv').config()

const MNEMONIC = process.env.MNEMONIC
const API_KEY = process.env.NODE_KEY

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS

const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${API_KEY}`

let rawdata = fs.readFileSync(path.resolve(__dirname, "../build/contracts/Markers.json"));
let contractAbi = JSON.parse(rawdata);
const CONTRACT_ABI = contractAbi.abi

async function test() {
      const mint_id = 1;
      const mint_uri = "https://ipfs.io/";

      try {
            const provider = new HDWalletProvider(
                  MNEMONIC, MUMBAI
            );
            const web3Instance = new web3(provider);


            const contract = new web3Instance.eth.Contract(
                  CONTRACT_ABI,
                  CONTRACT_ADDRESS,
            );
   
            await contract.methods
                  .mint(mint_id, mint_uri).call().then((receipt) => {
                        console.log(receipt)
                  }).catch(err => console.log(err))

      } catch (e) {
            console.log(e)
      }
}


test().then(() => process.exit(0))
.catch(error => {
      console.error(error);
      process.exit(1);
});