// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract DataNFTContract is ERC721, ERC721Enumerable {
    uint256 private _nextTokenId;

    struct Data {
        string content;
        address contributor;
    }

    mapping(uint256 => Data) public dataEntries;

    constructor() ERC721("DataContributionNFT", "DCNFT") {}

    function contributeData(string memory _content) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        dataEntries[tokenId] = Data(_content, msg.sender);
        _safeMint(msg.sender, tokenId);
        return tokenId;
    }

    function getDataEntry(uint256 _tokenId) public view returns (string memory, address) {
        require(ownerOf(_tokenId) != address(0), "Data entry does not exist");
        Data memory data = dataEntries[_tokenId];
        return (data.content, data.contributor);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}