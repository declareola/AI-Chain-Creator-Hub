import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("AutoTrader", function () {
  let autoTrader: any;
  let registry: any;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    registry = await ethers.deployContract("Registry");
    autoTrader = await ethers.deployContract("AutoTrader", [
      await registry.getAddress()
    ]);
  });

  describe("Initialization", function () {
    it("Should initialize with correct owner and registry", async function () {
      expect(await autoTrader.owner()).to.equal(owner.address);
      expect(await autoTrader.registry()).to.equal(await registry.getAddress());
    });
  });

  describe("Strategy Management", function () {
    it("Should allow owner to create a new strategy", async function () {
      const strategyParams = {
        name: "Test Strategy",
        maxRisk: 1000,
        maxDrawdown: 500,
        maxTradeSize: ethers.parseEther("10")
      };

      await expect(autoTrader.createStrategy(
        strategyParams.name,
        strategyParams.maxRisk,
        strategyParams.maxDrawdown,
        strategyParams.maxTradeSize
      ))
        .to.emit(autoTrader, "StrategyCreated")
        .withArgs(1, strategyParams.name);

      const strategy = await autoTrader.getStrategy(1);
      expect(strategy.name).to.equal(strategyParams.name);
      expect(strategy.maxRisk).to.equal(strategyParams.maxRisk);
    });

    it("Should reject non-owner creating strategy", async function () {
      await expect(autoTrader.connect(user).createStrategy(
        "Unauthorized Strategy",
        1000,
        500,
        ethers.parseEther("10")
      )).to.be.revertedWithCustomError(autoTrader, "OwnableUnauthorizedAccount");
    });
  });

  describe("Execution", function () {
    it("Should allow owner to execute trades within risk limits", async function () {
      await autoTrader.createStrategy("Safe Strategy", 1000, 500, ethers.parseEther("10"));

      await expect(autoTrader.executeTrade(1, ethers.parseEther("5")))
        .to.emit(autoTrader, "TradeExecuted")
        .withArgs(1, ethers.parseEther("5"));
    });

    it("Should reject trades exceeding max trade size", async function () {
      await autoTrader.createStrategy("Risky Strategy", 1000, 500, ethers.parseEther("10"));

      await expect(autoTrader.executeTrade(1, ethers.parseEther("20")))
        .to.be.revertedWith("AutoTrader: Trade size exceeds max limit");
    });
  });

  describe("Emergency Controls", function () {
    it("Should allow owner to pause and unpause", async function () {
      await autoTrader.pause();
      expect(await autoTrader.paused()).to.be.true;

      await autoTrader.unpause();
      expect(await autoTrader.paused()).to.be.false;
    });

    it("Should reject operations when paused", async function () {
      await autoTrader.pause();

      await expect(autoTrader.createStrategy("Paused Strategy", 1000, 500, ethers.parseEther("10")))
        .to.be.revertedWith("Pausable: paused");
    });
  });
});
