import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Stable RPC
const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';

// WC Project ID (Demo ID)
const projectId = '3fcc6b4464bd44820986703c7379d9d4';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'ApolloView' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http(RPC_URL),
  },
});

export { sepolia };
