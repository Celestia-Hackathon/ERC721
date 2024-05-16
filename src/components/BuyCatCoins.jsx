import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const catCoinContractAddress = '0x1fAab810CfEB248d31ffc972f18Dc4917A83C79a';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const catCoinContract = new ethers.Contract(catCoinContractAddress, CatCoin.abi, signer);

function BuyCatCoins() {
  const [ethAmount, setEthAmount] = useState('');
  const [catCoinBalance, setCatCoinBalance] = useState(0);

  const ethInputChange = (event) => {
    setEthAmount(event.target.value);
  };

  useEffect(() => {
    getCatCoinBalance();
  }, []);

  const getCatCoinBalance = async () => {
    const address = await signer.getAddress();
    const balance = await catCoinContract.balanceOf(address);
    const balanceInEth = parseFloat(balance.toString()) / 1e18;
    setCatCoinBalance(balanceInEth);
  };

  const buyCatCoinsWithETH = async () => {
    if (!ethAmount || isNaN(ethAmount) || ethAmount <= 0) {
      console.error('Invalid ETH amount');
      return;
    }

    try {
      const ethAmountInWei = ethers.parseEther(ethAmount.toString());
      const result = await catCoinContract.buyCatCoinWithETH({ value: ethAmountInWei });
      await result.wait();
      getCatCoinBalance(catCoinContract, signer);
    } catch (error) {
      console.error('Error buying CatCoins:', error);
    }
  };

  const addCatCoinToWallet = async () => {
    const tokenAddress = catCoinContractAddress;
    const tokenSymbol = 'CAT';
    const tokenDecimals = 18;
    const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmZHBnnHaXM1k1xGLukV3UAT8qgsNDGBrWeHyYwySkLa8A/cat.png'; // Optional image URL

    try {
      const wasAdded = await provider.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      });

      if (wasAdded) {
        console.log('Token added!');
      } else {
        console.log('Token not added.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
        <button className="btn btn-primary" onClick={addCatCoinToWallet}>Add CatCoin to MetaMask</button>
        <label htmlFor="ethAmount">Enter ETH amount:</label>
        <input
            type="number"
            id="ethAmount"
            value={ethAmount}
            onChange={ethInputChange}
            step="0.001"
            min="0.001"
            placeholder="0.001"
            className="form-control"
        />
        <button className="btn btn-secondary" onClick={buyCatCoinsWithETH}>
            Buy CatCoins with ETH
        </button>
    </div>
  );
}

export default BuyCatCoins;