import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { sepolia } from '../lib/wagmiConfig';

const AuthContext = createContext({
  user: null, walletAddress: null, isWalletConnected: false,
  usdcBalance: '0.00',
  login: () => {}, signup: () => {}, logout: () => {},
  connectWallet: async () => {}, disconnectWallet: () => {},
  chainId: null, switchNetwork: () => {},
});

// Mock influencer DB (sebelum backend nyata)
const MOCK_USERS = [
  {
    id: 'alex-chen',
    email: 'alex@predictl2.com',
    password: 'demo123',
    name: 'Alex Chen',
    handle: '@alexchen_eth',
    avatar: '/influencer_alex.png',
    bio: 'Full-time on-chain analyst. Specializes in ETH L2 ecosystem, DeFi protocols, and macro crypto trends.',
    xHandle: 'alexchen_eth',
    tier: 'Elite',
    tierColor: '#FFD700',
    followers: '48.2K',
  },
];

export const AuthProvider = ({ children }) => {
  const [influencer, setInfluencer] = useState(null); // logged-in influencer profile

  // Wagmi hooks — actual Web3 state
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Mock USDC balance (will be replaced with contract read in Phase 5)
  const [usdcBalance] = useState('1,000.00');

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setInfluencer({ ...found });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const signup = (formData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      handle: `@${formData.xHandle || formData.name.toLowerCase().replace(/\s/g, '')}`,
      avatar: formData.avatarUrl || '/influencer_alex.png',
      bio: formData.bio || '',
      xHandle: formData.xHandle || '',
      tier: 'Rising',
      tierColor: '#00C853',
      followers: '0',
    };
    MOCK_USERS.push(newUser);
    setInfluencer(newUser);
    return { success: true };
  };

  const logout = () => {
    setInfluencer(null);
  };

  const connectWallet = async (connectorType = 'injected') => {
    try {
      if (connectorType === 'injected') {
        connect({ connector: injected() });
      } else if (connectorType === 'walletConnect') {
        connect({ connector: walletConnect({ projectId: 'demo' }) });
      } else if (connectorType === 'coinbase') {
        connect({ connector: coinbaseWallet({ appName: 'ApolloView' }) });
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const disconnectWallet = () => disconnect();

  return (
    <AuthContext.Provider value={{
      user: influencer,
      walletAddress: address || null,
      isWalletConnected: isConnected,
      usdcBalance,
      login, signup, logout,
      connectWallet, disconnectWallet,
      chainId,
      switchNetwork: () => switchChain({ chainId: sepolia.id }),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
