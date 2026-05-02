const solc = require('solc');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Contract source paths
const factoryPath = path.join(__dirname, '../contracts/MarketFactory.sol');
const marketPath = path.join(__dirname, '../contracts/PredictionMarket.sol');

function findImports(importPath) {
    if (importPath === 'PredictionMarket.sol') {
        return { contents: fs.readFileSync(marketPath, 'utf8') };
    }
    if (importPath.startsWith('@openzeppelin/')) {
        const fullPath = path.join(__dirname, '../node_modules', importPath);
        return { contents: fs.readFileSync(fullPath, 'utf8') };
    }
    return { error: 'File not found' };
}

async function main() {
    console.log("🛠️ Compiling contracts...");
    
    const input = {
        language: 'Solidity',
        sources: {
            'MarketFactory.sol': { content: fs.readFileSync(factoryPath, 'utf8') },
            'PredictionMarket.sol': { content: fs.readFileSync(marketPath, 'utf8') }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode']
                }
            },
            optimizer: { enabled: true, runs: 200 }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    
    if (output.errors) {
        output.errors.forEach(err => console.error(err.formattedMessage));
        if (output.errors.some(err => err.severity === 'error')) process.exit(1);
    }

    const factoryData = output.contracts['MarketFactory.sol']['MarketFactory'];
    const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

    console.log("🚀 Deploying to Sepolia...");
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    
    console.log("Account:", wallet.address);
    console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");

    const Factory = new ethers.ContractFactory(factoryData.abi, factoryData.evm.bytecode.object, wallet);
    const factory = await Factory.deploy(usdcAddress);
    await factory.waitForDeployment();
    const factoryAddr = await factory.getAddress();
    
    console.log("✅ Factory Deployed:", factoryAddr);

    // Initial market
    console.log("📦 Creating demo market...");
    const tx = await factory.createMarket("Ethereum to reach $4,000 by June 2026?", "Crypto", Math.floor(Date.now()/1000) + 86400 * 30);
    await tx.wait();
    console.log("✅ Demo market created");

    // Update contracts.js
    const contractsPath = path.join(__dirname, '../src/lib/contracts.js');
    fs.writeFileSync(contractsPath, `// AUTO-GENERATED
export const CONTRACT_ADDRESSES = {
  USDC: "${usdcAddress}",
  MARKET_FACTORY: "${factoryAddr}",
};
export const NETWORK = { chainId: 11155111, name: "Ethereum Sepolia" };
export const IS_DEPLOYED = true;
`);
    console.log("✨ Updated contracts.js");
}

main().catch(console.error);
