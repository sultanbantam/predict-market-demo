// ABI for MockUSDC (ERC-20 + faucet)
export const MockUSDC_ABI = [
  // ERC-20
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "allowance", type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "decimals", type: "function", stateMutability: "pure", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  // Faucet
  { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "lastFaucetTime", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ type: "uint256" }] },
  // Events
  { name: "Transfer", type: "event", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "value", type: "uint256" }] },
  { name: "Approval", type: "event", inputs: [{ name: "owner", type: "address", indexed: true }, { name: "spender", type: "address", indexed: true }, { name: "value", type: "uint256" }] },
  { name: "Faucet", type: "event", inputs: [{ name: "recipient", type: "address", indexed: true }, { name: "amount", type: "uint256" }] },
];

// ABI for PredictionMarket
export const PredictionMarket_ABI = [
  // Views
  { name: "question", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "category", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "resolutionTime", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "resolved", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { name: "outcome", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { name: "yesPool", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "noPool", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "creator", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { name: "getYesPrice", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getNoPrice", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getTotalPool", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getMarketInfo", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "_question", type: "string" }, { name: "_category", type: "string" }, { name: "_resolutionTime", type: "uint256" }, { name: "_resolved", type: "bool" }, { name: "_outcome", type: "bool" }, { name: "_yesPrice", type: "uint256" }, { name: "_noPrice", type: "uint256" }, { name: "_totalPool", type: "uint256" }] },
  { name: "getUserPosition", type: "function", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ name: "yesAmount", type: "uint256" }, { name: "noAmount", type: "uint256" }, { name: "claimed", type: "bool" }] },
  // Writes
  { name: "buyShares", type: "function", stateMutability: "nonpayable", inputs: [{ name: "isYes", type: "bool" }, { name: "usdcIn", type: "uint256" }], outputs: [] },
  { name: "resolve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "_outcome", type: "bool" }], outputs: [] },
  { name: "claimWinnings", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  // Events
  { name: "SharesBought", type: "event", inputs: [{ name: "buyer", type: "address", indexed: true }, { name: "isYes", type: "bool", indexed: true }, { name: "usdcIn", type: "uint256" }, { name: "priceAtBuy", type: "uint256" }] },
  { name: "MarketResolved", type: "event", inputs: [{ name: "outcome", type: "bool", indexed: true }, { name: "resolver", type: "address" }] },
  { name: "WinningsClaimed", type: "event", inputs: [{ name: "claimer", type: "address", indexed: true }, { name: "usdcOut", type: "uint256" }] },
];

// ABI for MarketFactory
export const MarketFactory_ABI = [
  { name: "usdc", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { name: "getMarketCount", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "allMarkets", type: "function", stateMutability: "view", inputs: [{ name: "", type: "uint256" }], outputs: [{ type: "address" }] },
  { name: "getMarketsByCreator", type: "function", stateMutability: "view", inputs: [{ name: "creator", type: "address" }], outputs: [{ type: "address[]" }] },
  { name: "getMarkets", type: "function", stateMutability: "view", inputs: [{ name: "offset", type: "uint256" }, { name: "limit", type: "uint256" }], outputs: [{ type: "address[]" }] },
  { name: "createMarket", type: "function", stateMutability: "nonpayable", inputs: [{ name: "question", type: "string" }, { name: "category", type: "string" }, { name: "resolutionTime", type: "uint256" }], outputs: [{ name: "market", type: "address" }] },
  { name: "MarketCreated", type: "event", inputs: [{ name: "market", type: "address", indexed: true }, { name: "creator", type: "address", indexed: true }, { name: "question", type: "string" }, { name: "category", type: "string" }, { name: "resolutionTime", type: "uint256" }] },
];
