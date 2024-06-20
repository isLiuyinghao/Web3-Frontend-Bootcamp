const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("使用账号部署合约:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", balance);

  // 部署 SimpleERC20 合约
  // const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
  // console.log(SimpleERC20.deployed)
  // const simpleERC20 = await SimpleERC20.deploy();
  // await simpleERC20.deployed();
  // console.log("SimpleERC20 deployed to:", simpleERC20.address);

  // 部署 SimpleERC20 合约
  const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
  const simpleERC20 = await SimpleERC20.deploy();
  await simpleERC20.interface.deploy();
  console.log("SimpleERC20 部署到:", simpleERC20.address);

  // 部署 SimpleERC721 合约
  const SimpleERC721 = await ethers.getContractFactory("SimpleERC721");
  const simpleERC721 = await SimpleERC721.deploy();
  await simpleERC721.deployed();
  console.log("SimpleERC721 deployed to:", simpleERC721.address);

  // 部署 NFTMarket 合约
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy(simpleERC20.address, simpleERC721.address);
  await nftMarket.deployed();
  console.log("NFTMarket deployed to:", nftMarket.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
