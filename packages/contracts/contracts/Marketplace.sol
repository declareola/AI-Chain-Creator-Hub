// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is Ownable, Pausable, ReentrancyGuard {
    address public registry;
    uint256 public platformFee; // Basis points (e.g., 250 = 2.5%)
    uint256 private _nextListingId;

    struct Listing {
        uint256 tokenId;
        address nftContract;
        address seller;
        address paymentToken; // ZeroAddress for ETH
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address seller,
        address paymentToken,
        uint256 price
    );
    event ListingUpdated(uint256 indexed listingId, uint256 newPrice);
    event ListingCancelled(uint256 indexed listingId);
    event NFTSold(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        address paymentToken,
        uint256 price,
        uint256 platformFeeAmount,
        uint256 royaltyAmount
    );

    constructor(address registry_, uint256 platformFee_) Ownable(msg.sender) {
        registry = registry_;
        platformFee = platformFee_;
        _nextListingId = 1;
    }

    function createListing(
        uint256 tokenId,
        address nftContract,
        address paymentToken,
        uint256 price
    ) external whenNotPaused {
        require(price > 0, "Marketplace: Price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Marketplace: Not token owner"
        );
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this) ||
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)),
            "Marketplace: Not approved"
        );

        uint256 listingId = _nextListingId++;
        listings[listingId] = Listing({
            tokenId: tokenId,
            nftContract: nftContract,
            seller: msg.sender,
            paymentToken: paymentToken,
            price: price,
            active: true
        });

        emit ListingCreated(listingId, tokenId, nftContract, msg.sender, paymentToken, price);
    }

    function updateListing(uint256 listingId, uint256 newPrice) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Marketplace: Not listing owner");
        require(listing.active, "Marketplace: Listing not active");
        require(newPrice > 0, "Marketplace: Price must be greater than 0");

        listing.price = newPrice;
        emit ListingUpdated(listingId, newPrice);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Marketplace: Not listing owner");
        require(listing.active, "Marketplace: Listing not active");

        listing.active = false;
        emit ListingCancelled(listingId);
    }

    function purchase(uint256 listingId) external payable nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        require(listing.active, "Marketplace: Listing not active");
        require(listing.seller != msg.sender, "Marketplace: Cannot buy own listing");

        uint256 platformFeeAmount = (listing.price * platformFee) / 10000;
        uint256 royaltyAmount = 0;
        address royaltyReceiver = address(0);

        if (IERC721(listing.nftContract).supportsInterface(type(IERC2981).interfaceId)) {
            (royaltyReceiver, royaltyAmount) = IERC2981(listing.nftContract).royaltyInfo(listing.tokenId, listing.price);
        }

        uint256 totalCost = listing.price + platformFeeAmount + royaltyAmount;
        require(msg.value >= totalCost, "Marketplace: Insufficient ETH");

        IERC721(listing.nftContract).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        payable(listing.seller).transfer(listing.price);

        if (platformFeeAmount > 0) {
            payable(owner()).transfer(platformFeeAmount);
        }

        if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
            payable(royaltyReceiver).transfer(royaltyAmount);
        }

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        listing.active = false;

        emit NFTSold(
            listingId,
            listing.tokenId,
            msg.sender,
            listing.seller,
            listing.paymentToken,
            listing.price,
            platformFeeAmount,
            royaltyAmount
        );
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Marketplace: Fee too high"); // Max 10%
        platformFee = newFee;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
