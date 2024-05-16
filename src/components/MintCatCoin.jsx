import { useState } from 'react';
import { ethers } from 'ethers';
import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const catCoinContractAddress = '0x1fAab810CfEB248d31ffc972f18Dc4917A83C79a';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const catCoinContract = new ethers.Contract(catCoinContractAddress, CatCoin.abi, signer);

function MintCatCoin() {
  const [catAmount, setCatAmount] = useState('');

  const catInputChange = (event) => {
    setCatAmount(event.target.value);
  };

  const mintCatCoin = async () => {
    if (!catAmount || isNaN(catAmount) || catAmount <= 0) {
      console.error('Invalid CAT amount');
      return;
    }

    try {
      const tx = await catCoinContract.mint(catCoinContractAddress, ethers.parseUnits('100', 18)); // Mint 100 CatCoins
      await tx.wait();
      getCatCoinBalance();
    } catch (error) {
      console.error('Error buying CatCoins:', error);
    }
  };

  return (
    <div>
        <label htmlFor="catAmount">Enter CAT amount:</label>
        <input
          type="number"
          id="catAmount"
          value={catAmount}
          onChange={catInputChange}
          step="10"
          min="10"
          placeholder="10"
          className="form-control"
        />
        <button className="btn btn-primary" onClick={mintCatCoin}>
          Mint Cat Coins
        </button>
    </div>
  );
}

export default MintCatCoin;