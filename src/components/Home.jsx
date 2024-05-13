import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { Contract, ethers } from 'ethers';
import MyNFT from '../artifacts/contracts/MyNFT.sol/MyNFT.json';

const contractAddress = '0xf95a4c811425351E7b27Dda0fC697a1E75fE23b7';

const provider = new ethers.BrowserProvider(window.ethereum);

// get the end user
const signer = await provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);


function Home() {

  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
      <WalletBalance />

      <h1>NFT Collection</h1>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const contentId = 'QmfUPUg6aCnzyjMTMYbWdDthYWDW3t1BG74cZXi6FMx73C';
  const metadataURI = `${contentId}/${tokenId}.json`
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  //const imageURI = `../out/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result)
    setIsMinted(result);
  };

  const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.runner.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.parseEther('0.05'),
    })
      await result.wait();
      getMintedStatus();
      getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    console.log(uri);
    alert(uri);
  }
  return (
    <div className="card" style={{ width: '18rem' }}>
      <img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;