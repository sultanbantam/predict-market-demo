// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PredictionMarket
 * @notice Binary prediction market (YES / NO) using USDC.
 * @dev Pool-based AMM: yesPrice = yesPool / totalPool (in basis points, 1-99)
 *      Winner payout: (userShares / winningPool) * totalPool
 */
contract PredictionMarket is ReentrancyGuard {
    // ─── State ─────────────────────────────────────────────────────────────
    IERC20 public immutable usdc;
    address public immutable creator;

    string public question;
    string public category;
    uint256 public resolutionTime;

    bool public resolved;
    bool public outcome; // true = YES wins

    // USDC amounts deposited per side (6 decimals)
    uint256 public yesPool;
    uint256 public noPool;

    // User deposits per side
    mapping(address => uint256) public yesDeposits;
    mapping(address => uint256) public noDeposits;
    mapping(address => bool) public hasClaimed;

    // ─── Events ────────────────────────────────────────────────────────────
    event SharesBought(
        address indexed buyer,
        bool indexed isYes,
        uint256 usdcIn,
        uint256 priceAtBuy // basis points, e.g. 65 = 65%
    );
    event MarketResolved(bool indexed outcome, address resolver);
    event WinningsClaimed(address indexed claimer, uint256 usdcOut);

    // ─── Constructor ───────────────────────────────────────────────────────
    constructor(
        address _usdc,
        address _creator,
        string memory _question,
        string memory _category,
        uint256 _resolutionTime
    ) {
        usdc = IERC20(_usdc);
        creator = _creator;
        question = _question;
        category = _category;
        resolutionTime = _resolutionTime;
    }

    // ─── Core: Buy Shares ──────────────────────────────────────────────────

    /**
     * @notice Buy YES or NO shares.
     * @param isYes   true = buy YES, false = buy NO
     * @param usdcIn  Amount of USDC to spend (6 decimals)
     */
    function buyShares(bool isYes, uint256 usdcIn) external nonReentrant {
        require(!resolved, "Market already resolved");
        require(usdcIn >= 1e6, "Minimum 1 USDC");

        usdc.transferFrom(msg.sender, address(this), usdcIn);

        uint256 currentPrice = isYes ? getYesPrice() : getNoPrice();

        if (isYes) {
            yesPool += usdcIn;
            yesDeposits[msg.sender] += usdcIn;
        } else {
            noPool += usdcIn;
            noDeposits[msg.sender] += usdcIn;
        }

        emit SharesBought(msg.sender, isYes, usdcIn, currentPrice);
    }

    // ─── Resolution ────────────────────────────────────────────────────────

    /**
     * @notice Resolve the market. Only the creator can call this.
     * @dev In production this will be replaced by an oracle callback.
     */
    function resolve(bool _outcome) external {
        require(msg.sender == creator, "Only creator can resolve");
        require(!resolved, "Already resolved");
        resolved = true;
        outcome = _outcome;
        emit MarketResolved(_outcome, msg.sender);
    }

    // ─── Claim Winnings ────────────────────────────────────────────────────

    /**
     * @notice Claim USDC winnings for a resolved market.
     */
    function claimWinnings() external nonReentrant {
        require(resolved, "Not yet resolved");
        require(!hasClaimed[msg.sender], "Already claimed");

        uint256 totalPool = yesPool + noPool;
        uint256 userDeposit = outcome
            ? yesDeposits[msg.sender]
            : noDeposits[msg.sender];
        uint256 winningPool = outcome ? yesPool : noPool;

        require(userDeposit > 0, "No winning position");

        // Payout = (userDeposit / winningPool) * totalPool
        uint256 payout = (userDeposit * totalPool) / winningPool;
        hasClaimed[msg.sender] = true;

        usdc.transfer(msg.sender, payout);
        emit WinningsClaimed(msg.sender, payout);
    }

    // ─── View Functions ────────────────────────────────────────────────────

    /// @return YES price in basis points (0-100)
    function getYesPrice() public view returns (uint256) {
        uint256 total = yesPool + noPool;
        if (total == 0) return 50;
        return (yesPool * 100) / total;
    }

    /// @return NO price in basis points (0-100)
    function getNoPrice() public view returns (uint256) {
        return 100 - getYesPrice();
    }

    /// @return Total USDC locked in market
    function getTotalPool() public view returns (uint256) {
        return yesPool + noPool;
    }

    /// @notice Full market summary in one call
    function getMarketInfo()
        external
        view
        returns (
            string memory _question,
            string memory _category,
            uint256 _resolutionTime,
            bool _resolved,
            bool _outcome,
            uint256 _yesPrice,
            uint256 _noPrice,
            uint256 _totalPool
        )
    {
        return (
            question,
            category,
            resolutionTime,
            resolved,
            outcome,
            getYesPrice(),
            getNoPrice(),
            getTotalPool()
        );
    }

    /// @notice User's position summary
    function getUserPosition(address user)
        external
        view
        returns (
            uint256 yesAmount,
            uint256 noAmount,
            bool claimed
        )
    {
        return (yesDeposits[user], noDeposits[user], hasClaimed[user]);
    }
}
