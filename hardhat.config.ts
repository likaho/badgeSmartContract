require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const infuraAPIKey = process.env.INFURA_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    ganache: {
      url: "http://192.168.0.3:9002",
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraAPIKey}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraAPIKey}`,
      accounts: [process.env.PRIVATE_KEY]
    },

  },
  // etherscan: {
  //   apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  // },
};