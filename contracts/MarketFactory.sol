// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PredictionMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketFactory
 * @notice Deploys and tracks all PredictionMarket instances.
 */
contract MarketFactory is Ownable {
    address public immutable usdc;

    address[] public allMarkets;
    mapping(address => address[]) public marketsByCreator;

    event MarketCreated(
        address indexed market,
        address indexed creator,
        string question,
        string category,
        uint256 resolutionTime
    );

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = _usdc;
    }

    /**
     * @notice Create a new prediction market.
     * @param question       The yes/no question to predict.
     * @param category       Category string (e.g. "Crypto", "Politics").
     * @param resolutionTime Unix timestamp of the resolution deadline.
     * @return market        Address of the newly deployed PredictionMarket.
     */
    function createMarket(
        string calldata question,
        string calldata category,
        uint256 resolutionTime
    ) external returns (address market) {
        require(bytes(question).length > 0, "Empty question");
        require(resolutionTime > block.timestamp, "Resolution in the past");

        PredictionMarket newMarket = new PredictionMarket(
            usdc,
            msg.sender,
            question,
            category,
            resolutionTime
        );

        market = address(newMarket);
        allMarkets.push(market);
        marketsByCreator[msg.sender].push(market);

        emit MarketCreated(market, msg.sender, question, category, resolutionTime);
    }

    /// @return Total number of markets created
    function getMarketCount() external view returns (uint256) {
        return allMarkets.length;
    }

    /// @return All markets created by a specific influencer
    function getMarketsByCreator(address creator)
        external
        view
        returns (address[] memory)
    {
        return marketsByCreator[creator];
    }

    /// @return Paginated list of all markets
    function getMarkets(uint256 offset, uint256 limit)
        external
        view
        returns (address[] memory)
    {
        uint256 total = allMarkets.length;
        if (offset >= total) return new address[](0);
        uint256 end = offset + limit > total ? total : offset + limit;
        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = allMarkets[i];
        }
        return result;
    }
}
