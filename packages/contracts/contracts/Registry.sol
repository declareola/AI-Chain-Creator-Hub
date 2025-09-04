// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Registry is Initializable, Ownable2StepUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    mapping(string => address) private _contracts;

    event ContractUpdated(string indexed name, address indexed oldAddress, address indexed newAddress);
    event EmergencyPause(address indexed caller);
    event EmergencyUnpause(address indexed caller);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __Ownable2Step_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);
    }

    function updateContract(string memory name, address newAddress) external onlyOwner whenNotPaused {
        require(newAddress != address(0), "Registry: Invalid address");
        require(_isValidContractName(name), "Registry: Unknown contract name");

        address oldAddress = _contracts[name];
        _contracts[name] = newAddress;

        emit ContractUpdated(name, oldAddress, newAddress);
    }

    function getContract(string memory name) external view returns (address) {
        return _contracts[name];
    }

    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPause(msg.sender);
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpause(msg.sender);
    }

    function _isValidContractName(string memory name) internal pure returns (bool) {
        bytes32 nameHash = keccak256(abi.encodePacked(name));
        return nameHash == keccak256(abi.encodePacked("SeedNFT")) ||
               nameHash == keccak256(abi.encodePacked("Marketplace")) ||
               nameHash == keccak256(abi.encodePacked("Vibecoin")) ||
               nameHash == keccak256(abi.encodePacked("AutoTrader"));
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
