// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Vibecoin is ERC20, Ownable, Pausable {
    address public registry;
    uint256 public totalSupplyCap;
    uint256 public curveSlope; // Slope for linear bonding curve
    uint256 public initialPrice; // Initial price per token

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 pricePerToken);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount, uint256 pricePerToken);
    event CurveParametersUpdated(uint256 newSlope, uint256 newInitialPrice, uint256 newCap);

    constructor(
        string memory name_,
        string memory symbol_,
        address registry_,
        uint256 initialSupply_,
        uint256 supplyCap_,
        uint256 curveSlope_,
        uint256 initialPrice_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        registry = registry_;
        totalSupplyCap = supplyCap_;
        curveSlope = curveSlope_;
        initialPrice = initialPrice_;

        _mint(msg.sender, initialSupply_);
    }

    function getPrice(uint256 supply) public view returns (uint256) {
        return initialPrice + (supply * curveSlope) / 1e18;
    }

    function getBuyCost(uint256 amount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        uint256 startPrice = getPrice(currentSupply);
        uint256 endPrice = getPrice(currentSupply + amount);

        // Calculate average price * amount
        uint256 averagePrice = (startPrice + endPrice) / 2;
        return (averagePrice * amount) / 1e18;
    }

    function getSellValue(uint256 amount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        uint256 startPrice = getPrice(currentSupply - amount);
        uint256 endPrice = getPrice(currentSupply);

        // Calculate average price * amount
        uint256 averagePrice = (startPrice + endPrice) / 2;
        return (averagePrice * amount) / 1e18;
    }

    function buy(uint256 amount) external payable whenNotPaused {
        require(amount > 0, "Vibecoin: Amount must be greater than 0");
        require(totalSupply() + amount <= totalSupplyCap, "Vibecoin: Would exceed supply cap");

        uint256 cost = getBuyCost(amount);
        require(msg.value >= cost, "Vibecoin: Insufficient ETH");

        uint256 pricePerToken = cost * 1e18 / amount;

        _mint(msg.sender, amount);

        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit TokensPurchased(msg.sender, cost, amount, pricePerToken);
    }

    function sell(uint256 amount) external whenNotPaused {
        require(amount > 0, "Vibecoin: Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Vibecoin: Insufficient balance");

        uint256 value = getSellValue(amount);
        require(address(this).balance >= value, "Vibecoin: Insufficient reserve");

        uint256 pricePerToken = value * 1e18 / amount;

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(value);

        emit TokensSold(msg.sender, amount, value, pricePerToken);
    }

    function updateCurveParameters(
        uint256 newSlope,
        uint256 newInitialPrice,
        uint256 newCap
    ) external onlyOwner {
        require(newCap >= totalSupply(), "Vibecoin: Cap below current supply");

        curveSlope = newSlope;
        initialPrice = newInitialPrice;
        totalSupplyCap = newCap;

        emit CurveParametersUpdated(newSlope, newInitialPrice, newCap);
    }

    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Vibecoin: Insufficient reserve");
        payable(owner()).transfer(amount);
    }

    function getReserveBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Receive ETH
    receive() external payable {}
}
