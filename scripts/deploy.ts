import { ethers } from "hardhat";

const main = async () => {
	let owner: SignerWithAddress;
	[owner] = await ethers.getSigners();
	console.log(owner.address);
  console.log(ethers.utils.parseEther((await owner.getBalance()).toString()));

  const NAME: string = 'Coursera';
  const SYMBOL: string = 'CEA';

  // Deploy smart contract
  const Badge = await ethers.getContractFactory("Badge");  
  const badge = await Badge.connect(owner).deploy(NAME, SYMBOL);

  const tx = await badge.deployed();
  console.log(`Transaction hash ${tx.deployTransaction.blockHash}`);	
	console.log("contract address", badge.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
