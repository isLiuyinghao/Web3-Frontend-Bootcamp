const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

const erc20Address = "0x814064e909F303885Cb4d811C7fA69168EC37090";
const erc721Address = "0xf461c6D23b7fF1A12Fe10E54c7F6Ee25683d6EFd";
const marketplaceAddress = "0x94dC85D6d0F73F9b2Cce2288a80Ae11A3fdA434C";

// 读取ABI文件
const getAbi = (fileName, contractName) => {
  const filePath = path.resolve(__dirname, `../artifacts/contracts/${fileName}.sol/${contractName}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonContent = JSON.parse(fileContent);
  return jsonContent.abi;
};

const erc20Abi = getAbi('ERC20', 'LiuToken');
const erc721Abi = getAbi('ERC721', 'LiuNFT');
const marketplaceAbi = getAbi('NFTMarket', 'NFTMarket');

async function main() {
  const [deployer] = await ethers.getSigners();

  const provider = new ethers.JsonRpcProvider("https://public.stackup.sh/api/v1/node/bsc-testnet");
  const buyer = new ethers.Wallet('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', provider);
  // 连接到合约
  const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, deployer);
  const erc721Contract = new ethers.Contract(erc721Address, erc721Abi, deployer);
  const marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceAbi, deployer);

  // 领取ERC20代币
  const faucetTx = await erc20Contract.faucet();
  await faucetTx.wait();
  console.log("ERC20水龙头交易哈希:", faucetTx.hash);

  // 铸造一个新的NFT
  const mintTx = await erc721Contract.safeMint(deployer.address, "https://example.com/nft");
  await mintTx.wait();
  console.log("NFT铸造交易哈希:", mintTx.hash);

  // 获取NFT的tokenId（假设为0）
  const tokenId = 0;
  // 上架NFT
  const price = ethers.parseUnits("0.1", 18); // 1个ERC20代币
  const approveTx = await erc721Contract.approve(marketplaceAddress, tokenId);
  await approveTx.wait();

  const listTx = await marketplaceContract.listItem(erc721Address, tokenId, price, "https://picture.gptkong.com/20240625/1053076954bdd44a9696b79799655e21ad.png");
  await listTx.wait();
  console.log("上架NFT交易哈希:", listTx.hash);

  // 切换到买家
  const erc20ContractBuyer = new ethers.Contract(erc20Address, erc20Abi, buyer);
  const marketplaceContractBuyer = new ethers.Contract(marketplaceAddress, marketplaceAbi, buyer);

  // 增加买家账户的 ERC20 代币余额
  const increaseBalanceTx = await erc20Contract.mint(buyer.address, ethers.parseUnits("1", 18));
  await increaseBalanceTx.wait();

  // 批准市场合约花费买家的ERC20代币
  const approveErc20Tx = await erc20ContractBuyer.approve(marketplaceAddress, price);
  await approveErc20Tx.wait();

  // 购买NFT
  const buyTx = await marketplaceContractBuyer.purchaseItem(erc721Address, tokenId);
  await buyTx.wait();
  console.log("购买NFT交易哈希:", buyTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
