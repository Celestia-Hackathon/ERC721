const { ethers } = require("hardhat");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const CatCoin = await ethers.getContractFactory("CatCoin");
  const ethToCatRate = 1000;
  const catCoin = await CatCoin.deploy(process.env.PUBLIC_KEY, ethToCatRate);

  await catCoin.waitForDeployment();

  console.log("Cat Coin deployed to:", catCoin.target);
  await verify(catCoin.target, [process.env.PUBLIC_KEY, ethToCatRate]);

}
  
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
      await run("verify:verify", {
          address: contractAddress,
          constructorArguments: args,
      })
  } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
          console.log("Already Verified!")
      } else {
          console.log(e)
      }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });