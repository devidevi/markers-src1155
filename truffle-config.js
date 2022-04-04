/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require("web3");
require('dotenv').config();

const path = require("path");

const MNEMONIC = process.env.MNEMONIC;
const NODE_KEY = process.env.NODE_KEY;

const ETHERSCAN = process.env.ETHERSCAN;
const POLYGONSCAN = process.env.POLYGONSCAN;
const BSCSCAN = process.env.BSCSCAN;

module.exports = {
    /**
     * Networks define how you connect to your ethereum client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */

    //contracts_build_directory: path.join(__dirname, "abis"),
    //contracts_build_directory: path.join(process.cwd(), "contracts"),

    plugins: [
        'truffle-plugin-verify'
    ],
    api_keys: {
        etherscan: ETHERSCAN,
        polygonscan: POLYGONSCAN,
        bscscan: BSCSCAN
    },

    networks: {
      development: {
          host: "localhost",
          port: 7545,
          gas: 5000000,
          network_id: "*", // Match any network id
      },
      rinkeby : {
          provider: () => new HDWalletProvider(MNEMONIC, `wss://rinkeby.infura.io/ws/v3/${NODE_KEY}`, 0),
          network_id: 4,       
          gas: 5000000,
          gasPrice: 5000000000,         
          confirmations: 2,    
          timeoutBlocks: 200,  
          skipDryRun: true
      },
      ropsten: {
          provider: () => new HDWalletProvider(MNEMONIC, `wss://ropsten.infura.io/ws/v3/${NODE_KEY}`, 0),
          network_id: 3,       // Ropsten's id
          gas: 6000000,
          gasPrice: 10000000000,  
          confirmations: 2,    // # of confs to wait between deployments. (default: 0)
          timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
          skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
      },
      mumbai: {
          provider: function () {
              return new HDWalletProvider(MNEMONIC, `wss://rpc-mumbai.maticvigil.com/ws/v1/${NODE_KEY}`);
          },
          network_id: 80001,
          gas: 6000000,
          gasPrice: 10000000000,        
          confirmations: 2,    
          timeoutBlocks: 200,  
          skipDryRun: true,     
          websockets: true
      },
      matic: {
          provider: function () {
              return new HDWalletProvider(MNEMONIC, `https://rpc-mainnet.maticvigil.com/v1/${NODE_KEY}`);
          },
          network_id: 137,
          gas: 5000000,
          gasPrice: 5000000000,
          confirmations: 2,
      },
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
        reporter: 'eth-gas-reporter',
        reporterOptions: {
          coinmarketcap: process.env["COINMARKET_API_KEY"]
        }
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
      solc: {
        version: "^0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
        settings: {          // See the solidity docs for advice about optimization and evmVersion
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: "petersburg"
        }
      }
    },

    // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
    //
    // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
    // those previously migrated contracts available in the .db directory, you will need to run the following:
    // $ truffle migrate --reset --compile-all

    db: {
      enabled: false
    }

};
