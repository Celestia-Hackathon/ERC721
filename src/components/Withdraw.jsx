import { ethers } from 'ethers';
import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const catCoinContractAddress = '0xA38dafA100bb9852b7C4065CdF2dE774c39043f8';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const catCoinContract = new ethers.Contract(catCoinContractAddress, CatCoin.abi, signer);

function Withdraw() {

  const withdraw = async () => {
    try {
      const tx = await catCoinContract.withdrawEth();
      await tx.wait();
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  return (
    <div>
        <button className="btn btn-primary" onClick={withdraw}>
            Withdraw
        </button>
    </div>
  );
}

export default Withdraw;
