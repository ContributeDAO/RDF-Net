require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID"
    }
  },
  etherscan: {
    apiKey: process.env.CJGQM3T6GK55XQPTN7Q6XBPSCWDUIVRBJH
  }
};