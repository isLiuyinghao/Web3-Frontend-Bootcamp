const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  const initialSupply = ethers.parseEther("1000000"); // 初始供应量

  console.log("使用账号部署合约:", deployer.address);

  const Token = await ethers.getContractFactory("LiuToken");
  const token = await Token.deploy(initialSupply);
  console.log("ERC20 地址:", token.target);


  // 部署 SimpleERC721 合约
  const SimpleERC721 = await ethers.getContractFactory("LiuNFT");
  const simpleERC721 = await SimpleERC721.deploy();
  // await simpleERC721.deployed();
  console.log("ERC721 地址:", simpleERC721.target);

  // 部署 NFTMarket 合约
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy(token.target);
  // await nftMarket.deployed();
  console.log("NFTMarket 地址:", nftMarket.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
