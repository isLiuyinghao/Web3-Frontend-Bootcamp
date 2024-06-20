// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NFTMarket {
    address public erc20Address;
    address public erc721Address;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    event Listed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event Sold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor(address _erc20Address, address _erc721Address) {
        erc20Address = _erc20Address;
        erc721Address = _erc721Address;
    }

    function list(uint256 _tokenId, uint256 _price) public {
        listings[_tokenId] = Listing(msg.sender, _price);
        emit Listed(_tokenId, msg.sender, _price);
    }

    function buy(uint256 _tokenId) public {
        Listing memory listing = listings[_tokenId];
        require(listing.price > 0, unicode"NFT未列出");
        IERC20(erc20Address).transferFrom(
            msg.sender,
            listing.seller,
            listing.price
        );
        IERC721(erc721Address).transferFrom(
            listing.seller,
            msg.sender,
            _tokenId
        );
        delete listings[_tokenId];
        emit Sold(_tokenId, msg.sender, listing.price);
    }
}

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}
