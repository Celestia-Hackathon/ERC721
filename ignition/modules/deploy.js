const { ethers } = require("hardhat");
const dotenv = require("dotenv");
dotenv.config();

async function main() {

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy(process.env.PUBLIC_KEY);

  await myNFT.waitForDeployment();

  console.log("My NFT deployed to:", myNFT.target);
  await verify(myNFT.target, [process.env.PUBLIC_KEY]);
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