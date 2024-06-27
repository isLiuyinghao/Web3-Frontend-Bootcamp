const { ethers } = require("hardhat");

async function main() {
  const ERC20_ADDRESS = '0x5E15b71773c7FcEec118B7c81fD706bf7AdEE625';
  const ERC721_ADDRESS = '0x511f5698047dEAaE8711b893c9FCeED77899A5C3';
  const MARKETPLACE_ADDRESS = '0xD0655BDdF852c50e4100b1EEfA85E8780fDa6CB8';

  const [deployer, otherAccount] = await ethers.getSigners();

  const provider = new ethers.JsonRpcProvider("https://public.stackup.sh/api/v1/node/bsc-testnet");
  const buyer = new ethers.Wallet('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', provider);

  // 连接到合约
  const Token = await ethers.getContractAt("LiuToken", ERC20_ADDRESS);
  const SimpleERC721 = await ethers.getContractAt("LiuNFT", ERC721_ADDRESS);
  const NFTMarket = await ethers.getContractAt("NFTMarket", MARKETPLACE_ADDRESS);

  const gasPrice = ethers.parseUnits("20", "gwei"); // 手动设置更高的 gas price

  // Mint 一个 NFT
  let tx = await SimpleERC721.connect(deployer).mint({ gasPrice });
  let receipt = await tx.wait();


  // 解析事件以获取 tokenId
  let tokenId;
  for (const log of receipt.logs) {
    if (log.address === ERC721_ADDRESS && log.topics[0] === ethers.id("Transfer(address,address,uint256)")) {
      tokenId = log.topics[3]
      break;
    }
  }

  if (tokenId === undefined) {
    console.error("未能从事件中解析出 tokenId");
    return;
  }

  console.log(`NFT Minted: 合约地址=${ERC721_ADDRESS}, Token ID=${tokenId}`);

  // 批准 Marketplace 操作我们的 NFT
  tx = await SimpleERC721.connect(deployer).setApprovalForAll(MARKETPLACE_ADDRESS, true, { gasPrice });
  await tx.wait();
  console.log(`Marketplace 批准: ${MARKETPLACE_ADDRESS} 操作 NFT`);

  // 检查是否已批准
  const isApproved = await SimpleERC721.isApprovedForAll(deployer.address, MARKETPLACE_ADDRESS);
  console.log(`是否已批准：${isApproved}`);

  try {
    console.log(`检查 Token ID: ${tokenId}`);
    // 调试信息：检查所有者
    const owner = await SimpleERC721.ownerOf(tokenId);
    console.log(`NFT 所有者: ${owner}`);
  } catch (error) {
    console.error(`获取所有者失败: ${error.message}`);
    return;
  }

  // 调试信息：检查上架前是否存在
  const isListing = await NFTMarket.isListing(ERC721_ADDRESS, tokenId);
  console.log(`是否已上架: ${isListing}`);

  const price = ethers.parseUnits("100", 2); // 设置价格为100 LIU
  try {

    // 调试信息：检查上架条件
    const nftOwner = await SimpleERC721.ownerOf(tokenId);
    console.log(`NFT 当前所有者: ${nftOwner}`);
    const nftApproved = await SimpleERC721.isApprovedForAll(deployer.address, MARKETPLACE_ADDRESS);
    console.log(`NFT 是否已批准: ${nftApproved}`);

    tx = await NFTMarket.connect(deployer).sell(ERC721_ADDRESS, '1', price, "https://example.com/nft/0", { gasPrice });
    await tx.wait();
    console.log(`NFT 上架: 合约地址=${ERC721_ADDRESS}, Token ID=${1}, 价格=${price.toString()}`);
  } catch (error) {
    console.error(`上架失败: ${error.reason || error.message}`);
    return;
  }

  // 买家批准 Marketplace 使用他的 ERC20 代币
  tx = await Token.connect(buyer).approve(MARKETPLACE_ADDRESS, price, { gasPrice });
  await tx.wait();
  console.log(`Buyer 批准: ${MARKETPLACE_ADDRESS} 使用 ${price.toString()} LIU`);

  // 买家购买 NFT(有问题)
  console.log('otherAccount', otherAccount)
  tx = await NFTMarket.connect(buyer).buy('0x511f5698047dEAaE8711b893c9FCeED77899A5C3', '1');
  await tx.wait();
  console.log(`NFT 购买: 合约地址=${ERC721_ADDRESS}, Token ID=${tokenId}, 价格=${price.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
