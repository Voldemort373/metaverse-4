// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

async function main() {

  const [owner, userA] = await hre.ethers.getSigners()

  const NAME = "MJ Building"
  const SYMBOL = "MJB"
  const COST = hre.ethers.utils.parseEther('1')
  const MAX_SUPPLY = 5
  const TOTAL_SUPPLY = 0

  const landContractFactory = await hre.ethers.getContractFactory("Land");
  const contract = await landContractFactory.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, TOTAL_SUPPLY);

  await contract.deployed();


  // ----------------------------------
  console.log("Contract deployed to:", contract.address);
  console.log("Contract deployed by: ", owner.address);
  saveFrontendFiles(contract.address);

}

async function saveFrontendFiles(tokenAddr) {
  const contractsDir = __dirname + "/../app/src/build/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      {
        ContractAddress: tokenAddr
      }
    )
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

