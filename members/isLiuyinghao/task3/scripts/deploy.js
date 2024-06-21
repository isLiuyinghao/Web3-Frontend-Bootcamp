const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  // console.log("使用账号部署合约:", deployer.address);

  const initialSupply = ethers.parseEther("1000000"); // 初始供应量
  const initialOwner = deployer.address; // 初始所有者
  //  // 部署 ERC20 合约
  // const LiuToken = await ethers.getContractFactory("LiuToken");

  // // 部署 LiuToken 合约
  // const liuToken = await LiuToken.deploy(initialSupply, initialOwner);
  // console.log(liuToken)
  // await liuToken.deployed();

  // console.log("LiuToken 部署在地址:", liuToken.address);

  console.log("使用账号部署合约:", deployer.address);

  const Token = await ethers.getContractFactory("LiuToken");
  const token = await Token.deploy(initialSupply, initialOwner);
  console.log("ERC20 地址:", token.target);


  // 部署 SimpleERC721 合约
  const SimpleERC721 = await ethers.getContractFactory("LiuNFT");
  const simpleERC721 = await SimpleERC721.deploy(initialOwner);
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
