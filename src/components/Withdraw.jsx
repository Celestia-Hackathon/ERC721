import { ethers } from 'ethers';
import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const catCoinContractAddress = '0x597346565Eb10a60336c6c9C1aCfB26E085fd426';

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
