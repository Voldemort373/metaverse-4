require("@nomiclabs/hardhat-waffle");
require('babel-register');
require('babel-polyfill');
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const privateKey = process.env.PRIVATE_KEY || "";
const privateKeyArray = privateKey.split(',')
const ProjectId = process.env.PROJECT_ID;

module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
        enabled: true,
        runs: 1000000,
    }
  },
  mocha: {
    timeout: 100000
  },
  paths:{
    artifacts: "./app/src/build",
    tests: "./test",
  },
  networks:{
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    },
    hardhat:{
      chainId: 1337,
      // gas: "auto",
      // gasPrice: "auto",
      // blockGasLimit: 100000000429720,
    },
    // mumbai:{
    //   url: `https://polygon-mumbai.g.alchemy.com/v2/${ProjectId}`,
    //   accounts: privateKeyArray
    // }
    rinkeby:{
      url: `https://rinkeby.infura.io/v3/${ProjectId}`,
      accounts: privateKeyArray,
    }
  }
};
