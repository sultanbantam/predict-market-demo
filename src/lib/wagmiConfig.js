import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// ⚠️ Ganti 'demo' dengan Alchemy API key Anda di .env
// VITE_ALCHEMY_KEY=your_key_here
const ALCHEMY_RPC = import.meta.env.VITE_ALCHEMY_KEY
  ? `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`
  : 'https://rpc.sepolia.org'; // public fallback

// WalletConnect ProjectID (dari https://cloud.walletconnect.com — free tier)
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID || 'demo';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: WC_PROJECT_ID }),
    coinbaseWallet({ appName: 'PredictL2' }),
  ],
  transports: {
    [sepolia.id]: http(ALCHEMY_RPC),
  },
});

export { sepolia };
