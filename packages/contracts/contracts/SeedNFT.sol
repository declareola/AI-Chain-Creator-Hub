we// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SeedNFT is ERC721, ERC2981, ERC721URIStorage, Ownable, Pausable {
    address public registry;
    uint256 private _nextTokenId;
    uint256 public totalSupply;

    event NFTMinted(uint256 indexed tokenId, address indexed to, string tokenURI, uint96 royaltyPercentage);
    event RoyaltyUpdated(uint256 indexed tokenId, uint96 newRoyaltyPercentage);

    constructor(
        string memory name_,
        string memory symbol_,
        address registry_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        registry = registry_;
        _nextTokenId = 1;
    }

    function mint(
        address to,
        string memory tokenURI,
        uint96 royaltyPercentage
    ) external onlyOwner whenNotPaused {
        require(to != address(0), "SeedNFT: Invalid recipient");
        require(bytes(tokenURI).length > 0, "SeedNFT: Empty token URI");
        require(royaltyPercentage <= 10000, "SeedNFT: Royalty too high"); // Max 100%

        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _setTokenRoyalty(tokenId, to, royaltyPercentage);
        totalSupply++;

        emit NFTMinted(tokenId, to, tokenURI, royaltyPercentage);
    }

    function batchMint(
        address[] memory recipients,
        string[] memory tokenURIs,
        uint96[] memory royaltyPercentages
    ) external onlyOwner whenNotPaused returns (uint256[] memory) {
        require(
            recipients.length == tokenURIs.length &&
            tokenURIs.length == royaltyPercentages.length,
            "SeedNFT: Array length mismatch"
        );
        require(recipients.length <= 50, "SeedNFT: Batch too large");

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "SeedNFT: Invalid recipient");
            require(bytes(tokenURIs[i]).length > 0, "SeedNFT: Empty token URI");
            require(royaltyPercentages[i] <= 10000, "SeedNFT: Royalty too high");

            uint256 tokenId = _nextTokenId++;
            _mint(recipients[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            _setTokenRoyalty(tokenId, recipients[i], royaltyPercentages[i]);
            tokenIds[i] = tokenId;

            emit NFTMinted(tokenId, recipients[i], tokenURIs[i], royaltyPercentages[i]);
        }

        totalSupply += recipients.length;
        return tokenIds;
    }

    function updateRoyalty(uint256 tokenId, uint96 newRoyaltyPercentage) external {
        require(ownerOf(tokenId) == msg.sender, "SeedNFT: Not token owner");
        require(newRoyaltyPercentage <= 10000, "SeedNFT: Royalty too high");

        _setTokenRoyalty(tokenId, msg.sender, newRoyaltyPercentage);
        emit RoyaltyUpdated(tokenId, newRoyaltyPercentage);
    }

    function burn(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender,
            "SeedNFT: Not authorized"
        );
        _burn(tokenId);
        totalSupply--;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC2981)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721)
    {
        super._increaseBalance(account, value);
    }
}
