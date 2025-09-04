import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Vibecoin", function () {
  let vibecoin: any;
  let registry: any;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    registry = await ethers.deployContract("Registry");
    vibecoin = await ethers.deployContract("Vibecoin", [
      "Vibecoin",
      "VIBE",
      await registry.getAddress(),
      ethers.parseEther("1000000"), // 1M initial supply
      ethers.parseEther("10000000"), // 10M cap
      1000000000000n, // slope
      ethers.parseEther("0.001") // initial price
    ]);
  });

  describe("Initialization", function () {
    it("Should initialize with correct parameters", async function () {
      expect(await vibecoin.name()).to.equal("Vibecoin");
      expect(await vibecoin.symbol()).to.equal("VIBE");
      expect(await vibecoin.registry()).to.equal(await registry.getAddress());
      expect(await vibecoin.totalSupply()).to.equal(ethers.parseEther("1000000"));
      expect(await vibecoin.totalSupplyCap()).to.equal(ethers.parseEther("10000000"));
    });
  });

  describe("Bonding Curve Pricing", function () {
    it("Should calculate correct price for next token", async function () {
      const currentSupply = await vibecoin.totalSupply();
      const expectedPrice = ethers.parseEther("0.001") + (currentSupply * 1000000000000n) / ethers.parseEther("1");

      expect(await vibecoin.getPrice(currentSupply)).to.equal(expectedPrice);
    });

    it("Should calculate correct buy cost", async function () {
      const amount = 10n;
      const cost = await vibecoin.getBuyCost(amount);
      expect(cost).to.be.gt(0);
    });

    it("Should calculate correct sell value", async function () {
      const amount = 10n;
      const value = await vibecoin.getSellValue(amount);
      expect(value).to.be.gt(0);
    });
  });

  describe("Buying Tokens", function () {
    it("Should allow buying tokens with ETH", async function () {
      const amount = 100n;
      const cost = await vibecoin.getBuyCost(amount);

      const initialBalance = await vibecoin.balanceOf(user.address);
      const initialReserve = await vibecoin.getReserveBalance();

      const pricePerToken = (cost * 1000000000000000000n) / amount;
      await expect(vibecoin.connect(user).buy(amount, { value: cost }))
        .to.emit(vibecoin, "TokensPurchased")
        .withArgs(user.address, cost, amount, pricePerToken);

      expect(await vibecoin.balanceOf(user.address)).to.equal(BigInt(initialBalance) + amount);
      expect(await vibecoin.getReserveBalance()).to.equal(BigInt(initialReserve) + cost);
    });

    it("Should reject buying with insufficient ETH", async function () {
      const amount = 100n;
      const cost = await vibecoin.getBuyCost(amount);

      await expect(vibecoin.connect(user).buy(amount, { value: cost - 1n }))
        .to.be.revertedWith("Vibecoin: Insufficient ETH");
    });

    it("Should reject buying beyond supply cap", async function () {
      const cap = await vibecoin.totalSupplyCap();
      const currentSupply = await vibecoin.totalSupply();
      const remaining = cap - currentSupply;
      const cost = await vibecoin.getBuyCost(remaining + 1n);

      await expect(vibecoin.connect(user).buy(remaining + 1n, { value: cost }))
        .to.be.revertedWith("Vibecoin: Would exceed supply cap");
    });

    it("Should refund excess ETH", async function () {
      const amount = 100n;
      const cost = await vibecoin.getBuyCost(amount);
      const excess = ethers.parseEther("1");

      const initialUserBalance = await ethers.provider.getBalance(user.address);

      await vibecoin.connect(user).buy(amount, { value: cost + excess });

      const finalUserBalance = await ethers.provider.getBalance(user.address);
      expect(finalUserBalance).to.be.lt(initialUserBalance - cost);
    });
  });

  describe("Selling Tokens", function () {
    beforeEach(async function () {
      const amount = 1000n;
      const cost = await vibecoin.getBuyCost(amount);
      await vibecoin.connect(user).buy(amount, { value: cost });
    });

    it("Should allow selling tokens for ETH", async function () {
      const amount = 100n;
      const value = await vibecoin.getSellValue(amount);

      const initialBalance = await vibecoin.balanceOf(user.address);
      const initialReserve = await vibecoin.getReserveBalance();

      const pricePerToken = (value * 1000000000000000000n) / amount;
      await expect(vibecoin.connect(user).sell(amount))
        .to.emit(vibecoin, "TokensSold")
        .withArgs(user.address, amount, value, pricePerToken);

      expect(await vibecoin.balanceOf(user.address)).to.equal(BigInt(initialBalance) - amount);
      expect(await vibecoin.getReserveBalance()).to.equal(BigInt(initialReserve) - value);
    });

    it("Should reject selling more than balance", async function () {
      const balance = await vibecoin.balanceOf(user.address);

      await expect(vibecoin.connect(user).sell(balance + 1n))
        .to.be.revertedWith("Vibecoin: Insufficient balance");
    });

    it("Should reject selling zero tokens", async function () {
      await expect(vibecoin.connect(user).sell(0))
        .to.be.revertedWith("Vibecoin: Amount must be greater than 0");
    });
  });

  describe("Curve Parameter Updates", function () {
    it("Should allow owner to update curve parameters", async function () {
      const newSlope = 2000000000000n;
      const newPrice = ethers.parseEther("0.002");

      await expect(vibecoin.updateCurveParameters(newSlope, newPrice, ethers.parseEther("20000000")))
        .to.emit(vibecoin, "CurveParametersUpdated")
        .withArgs(newSlope, newPrice, ethers.parseEther("20000000"));

      expect(await vibecoin.curveSlope()).to.equal(newSlope);
      expect(await vibecoin.initialPrice()).to.equal(newPrice);
    });

    it("Should reject cap below current supply", async function () {
      const currentSupply = await vibecoin.totalSupply();

      await expect(vibecoin.updateCurveParameters(1000000000000n, ethers.parseEther("0.001"), currentSupply - 1n))
        .to.be.revertedWith("Vibecoin: Cap below current supply");
    });

    it("Should not allow non-owner to update parameters", async function () {
      await expect(vibecoin.connect(user).updateCurveParameters(2000000000000n, ethers.parseEther("0.002"), ethers.parseEther("20000000")))
        .to.be.revertedWithCustomError(vibecoin, "OwnableUnauthorizedAccount");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to withdraw ETH", async function () {
      // Add some ETH to reserve
      const amount = 100n;
      const cost = await vibecoin.getBuyCost(amount);
      await vibecoin.connect(user).buy(amount, { value: cost });

      const reserveBalance = await vibecoin.getReserveBalance();
      const withdrawAmount = reserveBalance / 2n;

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

      await vibecoin.emergencyWithdraw(withdrawAmount);

      expect(await vibecoin.getReserveBalance()).to.equal(reserveBalance - withdrawAmount);
    });

    it("Should reject emergency withdraw exceeding reserve", async function () {
      const reserveBalance = await vibecoin.getReserveBalance();

      await expect(vibecoin.emergencyWithdraw(reserveBalance + 1n))
        .to.be.revertedWith("Vibecoin: Insufficient reserve");
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause", async function () {
      await vibecoin.pause();
      expect(await vibecoin.paused()).to.be.true;
    });

    it("Should reject operations when paused", async function () {
      await vibecoin.pause();

      const amount = 100n;
      const cost = await vibecoin.getBuyCost(amount);

      await expect(vibecoin.connect(user).buy(amount, { value: cost }))
        .to.be.revertedWithCustomError(vibecoin, "EnforcedPause");
    });
  });
});
