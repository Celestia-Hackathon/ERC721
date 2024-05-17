import { ethers } from 'ethers';
import CatCoin from '../artifacts/contracts/CatCoin.sol/CatCoin.json';

const catCoinContractAddress = '0x4ebb45Ef0a7a5aE2BD1DEf50eE9EBF6628064cbb';

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