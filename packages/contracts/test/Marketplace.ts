import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Marketplace", function () {
  let marketplace: any;
  let seedNFT: any;
  let registry: any;
  let owner: any;
  let seller: any;
  let buyer: any;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    registry = await ethers.deployContract("Registry");
    seedNFT = await ethers.deployContract("SeedNFT", [
      "SeedNFT",
      "SEED",
      await registry.getAddress()
    ]);
    marketplace = await ethers.deployContract("Marketplace", [
      await registry.getAddress(),
      250 // 2.5% platform fee
    ]);
  });

  describe("Initialization", function () {
    it("Should initialize with correct parameters", async function () {
      expect(await marketplace.registry()).to.equal(await registry.getAddress());
      expect(await marketplace.platformFee()).to.equal(250);
    });
  });

  describe("Listing Creation", function () {
    let tokenId: number;

    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      await seedNFT.mint(seller.address, tokenURI, 500);
      tokenId = 1;

      // Approve marketplace
      await seedNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);
    });

    it("Should create listing successfully", async function () {
      const price = ethers.parseEther("1");

      await expect(marketplace.connect(seller).createListing(
        tokenId,
        await seedNFT.getAddress(),
        ethers.ZeroAddress, // ETH payment
        price
      ))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1, tokenId, await seedNFT.getAddress(), seller.address, ethers.ZeroAddress, price);

      const listing = await marketplace.getListing(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.be.true;
    });

    it("Should reject listing with zero price", async function () {
      await expect(marketplace.connect(seller).createListing(
        tokenId,
        await seedNFT.getAddress(),
        ethers.ZeroAddress,
        0
      ))
        .to.be.revertedWith("Marketplace: Price must be greater than 0");
    });

    it("Should reject listing without approval", async function () {
      // Revoke approval
      await seedNFT.connect(seller).approve(ethers.ZeroAddress, tokenId);

      await expect(marketplace.connect(seller).createListing(
        tokenId,
        await seedNFT.getAddress(),
        ethers.ZeroAddress,
        ethers.parseEther("1")
      ))
        .to.be.revertedWith("Marketplace: Not approved");
    });

    it("Should reject listing for non-owned token", async function () {
      await expect(marketplace.connect(buyer).createListing(
        tokenId,
        await seedNFT.getAddress(),
        ethers.ZeroAddress,
        ethers.parseEther("1")
      ))
        .to.be.revertedWith("Marketplace: Not token owner");
    });
  });

  describe("Listing Management", function () {
    let tokenId: number;
    let listingId: number;

    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      await seedNFT.mint(seller.address, tokenURI, 500);
      tokenId = 1;

      await seedNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);

      await marketplace.connect(seller).createListing(
        tokenId,
        await seedNFT.getAddress(),
        ethers.ZeroAddress,
        ethers.parseEther("1")
      );
      listingId = 1;
    });

    it("Should allow seller to update listing price", async function () {
      const newPrice = ethers.parseEther("2");

      await expect(marketplace.connect(seller).updateListing(listingId, newPrice))
        .to.emit(marketplace, "ListingUpdated")
        .withArgs(listingId, newPrice);

      const listing = await marketplace.getListing(listingId);
      expect(listing.price).to.equal(newPrice);
    });

    it("Should allow seller to cancel listing", async function () {
      await expect(marketplace.connect(seller).cancelListing(listingId))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(listingId);

      const listing = await marketplace.getListing(listingId);
      expect(listing.active).to.be.false;
    });

    it("Should not allow non-seller to update listing", async function () {
      await expect(marketplace.connect(buyer).updateListing(listingId, ethers.parseEther("2")))
        .to.be.revertedWith("Marketplace: Not listing owner");
    });
  });

  describe("Purchasing", function () {
    let tokenId: number;
    let listingId: number;
    const price = ethers.parseEther("1");

    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      await seedNFT.mint(seller.address, tokenURI, 500);
      tokenId = 1;

      await seedNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);

      await marketplace.connect(seller).createListing(
        tokenId,
        await seedNFT.getAddress(),
        ethers.ZeroAddress,
        price
      );
      listingId = 1;
    });

    it("Should allow purchase with correct payment", async function () {
      const platformFee = (price * 250n) / 10000n; // 2.5%
      const royaltyAmount = (price * 500n) / 10000n; // 5%
      const totalCost = price + platformFee + royaltyAmount;

      await expect(marketplace.connect(buyer).purchase(listingId, { value: totalCost }))
        .to.emit(marketplace, "NFTSold")
        .withArgs(listingId, tokenId, buyer.address, seller.address, ethers.ZeroAddress, price, platformFee, royaltyAmount);

      expect(await seedNFT.ownerOf(tokenId)).to.equal(buyer.address);

      const listing = await marketplace.getListing(listingId);
      expect(listing.active).to.be.false;
    });

    it("Should reject purchase with insufficient payment", async function () {
      await expect(marketplace.connect(buyer).purchase(listingId, { value: price }))
        .to.be.revertedWith("Marketplace: Insufficient ETH");
    });

    it("Should reject purchase of inactive listing", async function () {
      await marketplace.connect(seller).cancelListing(listingId);

      await expect(marketplace.connect(buyer).purchase(listingId, { value: price }))
        .to.be.revertedWith("Marketplace: Listing not active");
    });

    it("Should reject seller buying own listing", async function () {
      const totalCost = price + (price * 250n) / 10000n + (price * 500n) / 10000n;

      await expect(marketplace.connect(seller).purchase(listingId, { value: totalCost }))
        .to.be.revertedWith("Marketplace: Cannot buy own listing");
    });
  });

  describe("Platform Fee Management", function () {
    it("Should allow owner to update platform fee", async function () {
      await expect(marketplace.updatePlatformFee(500))
        .to.not.be.reverted;

      expect(await marketplace.platformFee()).to.equal(500);
    });

    it("Should reject platform fee above 10%", async function () {
      await expect(marketplace.updatePlatformFee(1100))
        .to.be.revertedWith("Marketplace: Fee too high");
    });

    it("Should not allow non-owner to update platform fee", async function () {
      await expect(marketplace.connect(seller).updatePlatformFee(500))
        .to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause", async function () {
      await marketplace.pause();
      expect(await marketplace.paused()).to.be.true;
    });

    it("Should reject operations when paused", async function () {
      await marketplace.pause();

      await expect(marketplace.connect(seller).createListing(
        1,
        await seedNFT.getAddress(),
        ethers.ZeroAddress,
        ethers.parseEther("1")
      ))
        .to.be.revertedWith("Pausable: paused");
    });
  });
});
