type AddressHash = string;

type ListItem = {
    nftContract: string;
    price: bigint; // NFT的售价，以ERC20代币计
    seller: string; // 卖家地址
    isListed: boolean; // 是否已经上架
    tokenUrl: string;
}

export type { ListItem }