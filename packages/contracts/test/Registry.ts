import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Registry", function () {
  let registry: any;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    registry = await ethers.deployContract("Registry");
  });

  describe("Initialization", function () {
    it("Should initialize with correct owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should not be paused initially", async function () {
      expect(await registry.paused()).to.be.false;
    });
  });

  describe("Contract Updates", function () {
    it("Should allow owner to update contract addresses", async function () {
      const mockAddress = ethers.Wallet.createRandom().address;

      await expect(registry.updateContract("SeedNFT", mockAddress))
        .to.emit(registry, "ContractUpdated")
        .withArgs("SeedNFT", ethers.ZeroAddress, mockAddress);

      expect(await registry.getContract("SeedNFT")).to.equal(mockAddress);
    });

    it("Should reject invalid contract names", async function () {
      const mockAddress = ethers.Wallet.createRandom().address;

      await expect(registry.updateContract("InvalidContract", mockAddress))
        .to.be.revertedWith("Registry: Unknown contract name");
    });

    it("Should reject zero address", async function () {
      await expect(registry.updateContract("SeedNFT", ethers.ZeroAddress))
        .to.be.revertedWith("Registry: Invalid address");
    });

    it("Should not allow non-owner to update contracts", async function () {
      const mockAddress = ethers.Wallet.createRandom().address;

      await expect(registry.connect(user).updateContract("SeedNFT", mockAddress))
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Emergency Controls", function () {
    it("Should allow owner to pause", async function () {
      await expect(registry.emergencyPause())
        .to.emit(registry, "EmergencyPause")
        .withArgs(owner.address);

      expect(await registry.paused()).to.be.true;
    });

    it("Should allow owner to unpause", async function () {
      await registry.emergencyPause();

      await expect(registry.emergencyUnpause())
        .to.emit(registry, "EmergencyUnpause")
        .withArgs(owner.address);

      expect(await registry.paused()).to.be.false;
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(registry.connect(user).emergencyPause())
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should not allow non-owner to unpause", async function () {
      await registry.emergencyPause();

      await expect(registry.connect(user).emergencyUnpause())
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should reject contract updates when paused", async function () {
      await registry.emergencyPause();
      const mockAddress = ethers.Wallet.createRandom().address;

      await expect(registry.updateContract("SeedNFT", mockAddress))
        .to.be.revertedWith("Registry: Contract is paused");
    });
  });

  describe("Contract Queries", function () {
    it("Should return correct contract addresses", async function () {
      const mockAddress = ethers.Wallet.createRandom().address;
      await registry.updateContract("Marketplace", mockAddress);

      expect(await registry.getContract("Marketplace")).to.equal(mockAddress);
    });

    it("Should return zero address for unknown contracts", async function () {
      expect(await registry.getContract("UnknownContract")).to.equal(ethers.ZeroAddress);
    });
  });
});
