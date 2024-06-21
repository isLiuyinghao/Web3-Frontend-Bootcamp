const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

const erc20Address = "0x9084971226C012af0A7F2543b91A9F79b011AD6e";
const erc721Address = "0x373aC82061C6b7950f0a750647f2033016042d3e";
const marketplaceAddress = "0xc8a249E5cc481A23512F1b5e43C9d643C189D5aC";

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
  // const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const buyer = new ethers.Wallet('69d8eb1fe0bbfcbe5b935428ba2c50ccf7d39cd37f32a54a2a4aa4c4c4377423', provider);
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

  const listTx = await marketplaceContract.listItem(erc721Address, tokenId, price);
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
