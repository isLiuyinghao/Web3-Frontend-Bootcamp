// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleERC721 {
    string public name = "SimpleERC721";
    string public symbol = "SNFT";

    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => address) public approved;
    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        require(ownerOf[_tokenId] == _from, unicode"不是NFT所有者");
        ownerOf[_tokenId] = _to;
        balanceOf[_from] -= 1;
        balanceOf[_to] += 1;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(
            msg.sender == ownerOf[_tokenId] || msg.sender == approved[_tokenId],
            unicode"未获批准"
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        require(msg.sender == ownerOf[_tokenId], unicode"不是NFT所有者");
        approved[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function mint(uint256 _tokenId) public {
        require(ownerOf[_tokenId] == address(0), unicode"NFT已存在");
        ownerOf[_tokenId] = msg.sender;
        balanceOf[msg.sender] += 1;
        emit Transfer(address(0), msg.sender, _tokenId);
    }
}
