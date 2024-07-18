// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICampaignRegistry {
    function registerCampaign(address campaignAddress, address initiator, string memory name, string memory content) external;
}

contract DataNFTContract is ERC721, Ownable {
    uint256 private _nextTokenId;
    
    struct Data {
        string title;
        string content;
    }

    mapping(uint256 => Data) private _dataEntries;
    
    string public initialTitle;
    string public initialContent;

    address constant CAMPAIGN_REGISTRY_ADDRESS = 0xc71ef9f2b682971Fb4A56C02B892823205d58F59;

    event DataContributed(uint256 indexed tokenId, address indexed contributor, string title, string content);
    event CampaignInitialized(address initiator, string title, string content);

    constructor(string memory _title, string memory _content) 
        ERC721("DCNFT", "DC")
        Ownable(msg.sender)
    {
        initialTitle = _title;
        initialContent = _content;
        
        ICampaignRegistry(CAMPAIGN_REGISTRY_ADDRESS).registerCampaign(address(this), msg.sender, _title, _content);
        
        emit CampaignInitialized(msg.sender, _title, _content);
    }

    function contributeData(string calldata _title, string calldata _content) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _dataEntries[tokenId] = Data(_title, _content);
        _safeMint(msg.sender, tokenId);
        
        emit DataContributed(tokenId, msg.sender, _title, _content);
        
        return tokenId;
    }
    
    function getDataEntry(uint256 _tokenId) external view returns (string memory, string memory) {
        require(_exists(_tokenId), "Data entry does not exist");
        Data storage data = _dataEntries[_tokenId];
        return (data.title, data.content);
    }

    function getInitialCampaignData() external view returns (string memory, string memory) {
        return (initialTitle, initialContent);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}