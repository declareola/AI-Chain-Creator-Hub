import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SeedNFT", function () {
  let seedNFT: any;
  let registry: any;
  let owner: any;
  let user: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user, user2] = await ethers.getSigners();

    registry = await ethers.deployContract("Registry");
    seedNFT = await ethers.deployContract("SeedNFT", [
      "SeedNFT",
      "SEED",
      await registry.getAddress()
    ]);
  });

  describe("Initialization", function () {
    it("Should initialize with correct parameters", async function () {
      expect(await seedNFT.name()).to.equal("SeedNFT");
      expect(await seedNFT.symbol()).to.equal("SEED");
      expect(await seedNFT.registry()).to.equal(await registry.getAddress());
    });
  });

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      const tokenURI = "https://example.com/token/1";
      const royaltyPercentage = 500; // 5%

      await expect(seedNFT.mint(user.address, tokenURI, royaltyPercentage))
        .to.emit(seedNFT, "NFTMinted")
        .withArgs(1, user.address, tokenURI, royaltyPercentage);

      expect(await seedNFT.ownerOf(1)).to.equal(user.address);
      expect(await seedNFT.tokenURI(1)).to.equal(tokenURI);
      expect(await seedNFT.totalSupply()).to.equal(1);
    });

    it("Should reject minting with empty token URI", async function () {
      await expect(seedNFT.mint(user.address, "", 500))
        .to.be.revertedWith("SeedNFT: Empty token URI");
    });

    it("Should reject minting with invalid royalty percentage", async function () {
      const tokenURI = "https://example.com/token/1";
      await expect(seedNFT.mint(user.address, tokenURI, 11000)) // 110%
        .to.be.revertedWith("SeedNFT: Royalty too high");
    });

    it("Should reject minting to zero address", async function () {
      const tokenURI = "https://example.com/token/1";
      await expect(seedNFT.mint(ethers.ZeroAddress, tokenURI, 500))
        .to.be.revertedWith("SeedNFT: Invalid recipient");
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint NFTs successfully", async function () {
      const recipients = [user.address, user2.address];
      const tokenURIs = ["https://example.com/token/1", "https://example.com/token/2"];
      const royaltyPercentages = [500, 1000];

      const tx = await seedNFT.batchMint(recipients, tokenURIs, royaltyPercentages);
      const receipt = await tx.wait();

      expect(await seedNFT.ownerOf(1)).to.equal(user.address);
      expect(await seedNFT.ownerOf(2)).to.equal(user2.address);
      expect(await seedNFT.totalSupply()).to.equal(2);
    });

    it("Should reject batch minting with mismatched arrays", async function () {
      const recipients = [user.address, user2.address];
      const tokenURIs = ["https://example.com/token/1"];
      const royaltyPercentages = [500, 1000];

      await expect(seedNFT.batchMint(recipients, tokenURIs, royaltyPercentages))
        .to.be.revertedWith("SeedNFT: Array length mismatch");
    });

    it("Should reject batch minting with too many tokens", async function () {
      const recipients = new Array(51).fill(user.address);
      const tokenURIs = new Array(51).fill("https://example.com/token/1");
      const royaltyPercentages = new Array(51).fill(500);

      await expect(seedNFT.batchMint(recipients, tokenURIs, royaltyPercentages))
        .to.be.revertedWith("SeedNFT: Batch too large");
    });
  });

  describe("Royalty Management", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      await seedNFT.mint(user.address, tokenURI, 500);
    });

    it("Should allow token owner to update royalty", async function () {
      await expect(seedNFT.connect(user).updateRoyalty(1, 1000))
        .to.emit(seedNFT, "RoyaltyUpdated")
        .withArgs(1, 1000);
    });

    it("Should not allow non-owner to update royalty", async function () {
      await expect(seedNFT.connect(user2).updateRoyalty(1, 1000))
        .to.be.revertedWith("SeedNFT: Not token owner");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      await seedNFT.mint(user.address, tokenURI, 500);
    });

    it("Should allow owner to burn token", async function () {
      await seedNFT.connect(user).burn(1);
      await expect(seedNFT.ownerOf(1)).to.be.revertedWithCustomError(seedNFT, "ERC721NonexistentToken");
    });

    it("Should allow approved user to burn token", async function () {
      await seedNFT.connect(user).approve(user2.address, 1);
      await seedNFT.connect(user2).burn(1);
      await expect(seedNFT.ownerOf(1)).to.be.revertedWithCustomError(seedNFT, "ERC721NonexistentToken");
    });

    it("Should not allow unauthorized user to burn token", async function () {
      await expect(seedNFT.connect(user2).burn(1))
        .to.be.revertedWith("SeedNFT: Not authorized");
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause", async function () {
      await seedNFT.pause();
      expect(await seedNFT.paused()).to.be.true;
    });

    it("Should allow owner to unpause", async function () {
      await seedNFT.pause();
      await seedNFT.unpause();
      expect(await seedNFT.paused()).to.be.false;
    });

    it("Should reject minting when paused", async function () {
      await seedNFT.pause();
      const tokenURI = "https://example.com/token/1";
      await expect(seedNFT.mint(user.address, tokenURI, 500))
        .to.be.revertedWithCustomError(seedNFT, "EnforcedPause");
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(seedNFT.connect(user).pause())
        .to.be.revertedWithCustomError(seedNFT, "OwnableUnauthorizedAccount");
    });
  });
});
