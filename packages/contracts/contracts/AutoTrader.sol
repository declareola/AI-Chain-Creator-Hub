// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract AutoTrader is Ownable, Pausable {
    address public registry;
    uint256 private _nextStrategyId;

    struct Strategy {
        string name;
        uint256 maxRisk; // Basis points (e.g., 1000 = 10%)
        uint256 maxDrawdown; // Basis points
        uint256 maxTradeSize; // Maximum trade size in wei
        bool active;
    }

    mapping(uint256 => Strategy) public strategies;

    event StrategyCreated(uint256 indexed strategyId, string name);
    event TradeExecuted(uint256 indexed strategyId, uint256 tradeSize);

    constructor(address registry_) Ownable(msg.sender) {
        registry = registry_;
        _nextStrategyId = 1;
    }

    function createStrategy(
        string memory name,
        uint256 maxRisk,
        uint256 maxDrawdown,
        uint256 maxTradeSize
    ) external onlyOwner whenNotPaused {
        require(bytes(name).length > 0, "AutoTrader: Empty strategy name");
        require(maxRisk > 0 && maxRisk <= 10000, "AutoTrader: Invalid risk limit");
        require(maxDrawdown > 0 && maxDrawdown <= 10000, "AutoTrader: Invalid drawdown limit");
        require(maxTradeSize > 0, "AutoTrader: Invalid trade size");

        uint256 strategyId = _nextStrategyId++;
        strategies[strategyId] = Strategy({
            name: name,
            maxRisk: maxRisk,
            maxDrawdown: maxDrawdown,
            maxTradeSize: maxTradeSize,
            active: true
        });

        emit StrategyCreated(strategyId, name);
    }

    function executeTrade(uint256 strategyId, uint256 tradeSize) external onlyOwner whenNotPaused {
        Strategy storage strategy = strategies[strategyId];
        require(strategy.active, "AutoTrader: Strategy not active");
        require(tradeSize > 0, "AutoTrader: Invalid trade size");
        require(tradeSize <= strategy.maxTradeSize, "AutoTrader: Trade size exceeds max limit");

        // Here would be the actual trading logic
        // For now, just emit the event

        emit TradeExecuted(strategyId, tradeSize);
    }

    function getStrategy(uint256 strategyId) external view returns (Strategy memory) {
        return strategies[strategyId];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
