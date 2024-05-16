import WalletBalance from './WalletBalance';
import MintNFT from './MintNFT';
import BuyCatCoins from './BuyCatCoins';
import CatBalance from './CatBalance';
import MintCatCoin from './MintCatCoin';
import DepositCatCoin from './DepositCatCoin';
import UpdateCatRate from './UpdateCatRate';
import Withdraw from './Withdraw';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CatNFT from '../artifacts/contracts/CatNFT.sol/CatNFT.json';

const NFTContractAddress = '0x12E0c157429a6765711D6Bde42B62bec095B9bB7';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const NFTContract = new ethers.Contract(NFTContractAddress, CatNFT.abi, signer);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await NFTContract.count();
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
      <WalletBalance />
      <BuyCatCoins />
      <CatBalance />
      <MintCatCoin />
      <DepositCatCoin />
      <UpdateCatRate />
      <Withdraw />

      <h1>NFT Collection</h1>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <MintNFT tokenId={i}
                getCount={getCount}
                />
              </div>
            ))};
        </div>
      </div>
    </div>
  );
}

export default Home;
