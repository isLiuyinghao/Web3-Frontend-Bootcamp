// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 导入IERC721和IERC20接口
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// 导入ReentrancyGuard
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    struct Listing {
        address nftContract;
        uint256 price; // NFT的售价，以ERC20代币计
        address seller; // 卖家地址
        bool isListed; // 是否已经上架
        string tokenUrl;
    }

    struct ListKey {
        address nftContract;
        uint tokenId;
    }

    IERC20 public erc20Token; // 自定义ERC20代币的接口
    mapping(address => mapping(uint256 => Listing)) public listings; // 存储NFT列表信息
    ListKey[] private AllList;

    event ItemListed(
        address indexed seller,
        address indexed nftToken,
        uint256 tokenId,
        uint256 price
    );
    event ItemPurchased(
        address indexed buyer,
        address indexed nftToken,
        uint256 tokenId,
        uint256 price
    );

    constructor(IERC20 _erc20Token) {
        erc20Token = _erc20Token;
    }

    // listItem函数允许用户将他们拥有的NFT上架出售
    function listItem(
        address nft,
        uint256 tokenId,
        uint256 price,
        string memory tokenUrl
    ) external nonReentrant {
        IERC721 nftContract = IERC721(nft);

        require(price > 0, "Price must be greater than zero");
        require(
            nftContract.getApproved(tokenId) == address(this) ||
                nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace must be approved to transfer the item"
        );

        listings[nft][tokenId] = Listing(
            nft,
            price,
            msg.sender,
            true,
            tokenUrl
        );
        AllList.push(ListKey(nft, tokenId));
        emit ItemListed(msg.sender, nft, tokenId, price);
    }

    // purchaseItem函数允许买家使用ERC20代币购买市场上的NFT
    function purchaseItem(address nft, uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[nft][tokenId];
        require(listing.isListed, "Item is not listed for sale");

        uint256 price = listing.price;
        require(
            msg.sender != listing.seller,
            "Seller cannot buy their own listed NFT"
        ); // 增加的检查

        // 检查买家是否有足够的ERC20代币余额来支付
        require(
            erc20Token.balanceOf(msg.sender) >= price,
            "Insufficient balance"
        );

        // 买家需要批准市场合约花费其代币
        require(
            erc20Token.allowance(msg.sender, address(this)) >= price,
            "Allowance not set"
        );

        // 转移ERC20代币到卖家
        erc20Token.transferFrom(msg.sender, listing.seller, price);

        IERC721 nftContract = IERC721(nft);
        // 转移NFT所有权到买家
        nftContract.transferFrom(listing.seller, msg.sender, tokenId);

        // 将NFT从市场上撤下
        delete listings[address(nft)][tokenId];

        emit ItemPurchased(msg.sender, address(nft), tokenId, price);
    }

    function getAll() external view returns (Listing[] memory) {
        Listing[] memory allItem = new Listing[](AllList.length);
        ListKey memory nftIdx;

        for (uint256 i = 0; i < AllList.length; i++) {
            nftIdx = AllList[i];
            allItem[i] = listings[nftIdx.nftContract][nftIdx.tokenId];
        }

        return allItem;
    }
}
