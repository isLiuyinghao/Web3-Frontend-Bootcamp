require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/a6e727f1a36d41c6be151dc1693a7981",
    //   accounts: [`0x69d8eb1fe0bbfcbe5b935428ba2c50ccf7d39cd37f32a54a2a4aa4c4c4377423`]
    // }
    bscTestnet: {
        url: "https://public.stackup.sh/api/v1/node/bsc-testnet",
        accounts: [`0x69d8eb1fe0bbfcbe5b935428ba2c50ccf7d39cd37f32a54a2a4aa4c4c4377423`],
        timeout: 200000 // 设定超时时间为200秒
      }
  }
};
