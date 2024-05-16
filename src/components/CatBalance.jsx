import { useState } from 'react';
import { ethers } from 'ethers';

import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const catCoinContractAddress = '0x597346565Eb10a60336c6c9C1aCfB26E085fd426';

const catCoinContract = new ethers.Contract(catCoinContractAddress, CatCoin.abi, signer);

function CatBalance() {

    const [catCoinBalance, setCatCoinBalance] = useState('');
    
    const  getCatCoinBalance = async () => {
      try {
        const address = await signer.getAddress();
        const balance = await catCoinContract.balanceOf(address);
        const balanceCorrected = parseFloat(balance.toString()) / 1e18;
        setCatCoinBalance(balanceCorrected);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
  
    return (
      <div>
            <h5>CatCoin Balance: {catCoinBalance}</h5>
          <button onClick={() => getCatCoinBalance()}>Show My Cat Balance</button>
      </div>
    );
  };
  
  export default CatBalance;
