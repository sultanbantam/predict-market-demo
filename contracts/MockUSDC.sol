// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Testnet USDC for PredictL2 (Ethereum Sepolia)
 * @dev Uses 6 decimals like real USDC. Has a public faucet for testing.
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant _DECIMALS = 6;
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** 6; // 1,000 USDC
    uint256 public constant FAUCET_COOLDOWN = 24 hours;

    mapping(address => uint256) public lastFaucetTime;

    event Faucet(address indexed recipient, uint256 amount);

    constructor() ERC20("USD Coin (Test)", "USDC") Ownable(msg.sender) {
        // Mint 10M USDC to deployer for liquidity seeding
        _mint(msg.sender, 10_000_000 * 10 ** _DECIMALS);
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /**
     * @notice Get 1,000 test USDC per 24 hours
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetTime[msg.sender] + FAUCET_COOLDOWN,
            "Wait 24h between faucet claims"
        );
        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        emit Faucet(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Admin mint (for seeding liquidity)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
