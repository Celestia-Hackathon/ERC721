import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import CatNFT from '../artifacts/contracts/CatNFT.sol/CatNFT.json';
import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const NFTContractAddress = '0x12E0c157429a6765711D6Bde42B62bec095B9bB7';
const catCoinContractAddress = '0x597346565Eb10a60336c6c9C1aCfB26E085fd426';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const NFTContract = new ethers.Contract(NFTContractAddress, CatNFT.abi, signer);
const catCoinContract = new ethers.Contract(catCoinContractAddress, CatCoin.abi, signer);

function MintNFT({ tokenId, getCount }) {
  const contentIdImg = 'QmTudPsbaksg9oG3jR3uNYXtpjAkHGsGnh1tAqVAYt7nRy';
  const contentIdJson = 'QmY9yW5B7xHXBGDwW5Y5ido3VULyXD2njD4QhApBqxtPxd';
  const metadataURI = `${contentIdJson}/${tokenId}.json`
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentIdImg}/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await NFTContract.isContentOwned(metadataURI);
    setIsMinted(result);
  };

  async function getURI() {
    const uri = await NFTContract.tokenURI(tokenId);
    console.log(uri);
    alert(uri);
  }
    
  const buyNFTWithETH = async (metadataURI) => {
    const tx = await NFTContract.payToMint(await signer.getAddress(), metadataURI, {
      value: ethers.parseEther('0.05'),
    });
    await tx.wait();
    getCount();
  };
  
  const mintTokenWithETH = async () => {
    await buyNFTWithETH(metadataURI);
    getMintedStatus();
    getCount();
  };
  
  const buyNFTWithCatCoin = async (metadataURI) => {
    const costInCatCoin = ethers.parseUnits('50', 18);
    const tx = await catCoinContract.transfer(NFTContractAddress, costInCatCoin);
    await tx.wait();

    const mintTx = await NFTContract.payToMintWithCatCoin(await signer.getAddress(), metadataURI);
    await mintTx.wait();
    getCount();
    getCatCoinBalance();
  };

  const mintTokenWithCatCoin = async () => {
    await buyNFTWithCatCoin(metadataURI);
    getMintedStatus();
    getCount();
  };

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <>
          <button className="btn btn-primary" onClick={mintTokenWithETH}>
            Mint with ETH
          </button>
          <button className="btn btn-secondary" onClick={mintTokenWithCatCoin}>
            Mint with CatCoin
          </button>
        </>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

export default MintNFT;
