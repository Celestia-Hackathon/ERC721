const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("MyNFT", function () {
  let owner;
  let addr1;
  let addr2;
  let myNFT;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy(owner);
    await myNFT.waitForDeployment();
  });

  it("Should mint NFTs", async function () {
    await myNFT.connect(owner).safeMint(addr1, "ipfs://metadata1");
    await myNFT.connect(owner).safeMint(addr2, "ipfs://metadata2");

    const token1Owner = await myNFT.ownerOf(0);
    const token2Owner = await myNFT.ownerOf(1);

    expect(token1Owner).to.equal(addr1);
    expect(token2Owner).to.equal(addr2);
  });

  it("Should pay to mint and transfer an NFT to someone", async function() {
    let balance = await myNFT.balanceOf(addr1);
    expect(balance).to.equal(0);

    const newToken = await myNFT.payToMint(addr1, "ipfs://metadata1", { value: ethers.parseEther('0.05')});
    await newToken.wait();
    balance = await myNFT.balanceOf(addr1);

    expect(balance).to.equal(1)
    expect(await myNFT.isContentOwned("ipfs://metadata1")).to.equal(true)
  });

  it("Should not allow duplicate URI minting", async function () {
    const newToken = await myNFT.payToMint(addr1, "ipfs://metadata1", { value: ethers.parseEther('0.05')});
    await newToken.wait();
    await expect(myNFT.payToMint(addr2, "ipfs://metadata1", { value: ethers.parseEther('0.05')})).to.be.revertedWith("NFT already minted!");
  });

  it("Should return correct token count", async function () {
    const newToken = await myNFT.payToMint(addr1, "ipfs://metadata1", { value: ethers.parseEther('0.05')});
    await newToken.wait();
    const count = await myNFT.count();
    expect(count).to.equal(1);
  });

  it("Should return true if content is owned", async function () {
    const newToken = await myNFT.payToMint(addr1, "ipfs://metadata1", { value: ethers.parseEther('0.05')});
    await newToken.wait();
    const isOwned = await myNFT.isContentOwned("ipfs://metadata1");
    expect(isOwned).to.be.true;
  }); 
  
});