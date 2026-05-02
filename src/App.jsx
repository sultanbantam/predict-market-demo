import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import LivePriceTicker from './components/LivePriceTicker';
// import MarketCard from './components/MarketCard';
// import WalletConnectModal from './components/WalletConnectModal';
// import BridgeModal from './components/BridgeModal';
// import InfluencersPage from './pages/InfluencersPage';
// import InfluencerProfilePage from './pages/InfluencerProfilePage';
// import InfluencerLogin from './pages/InfluencerLogin';
// import InfluencerSignup from './pages/InfluencerSignup';
// import InfluencerDashboard from './pages/InfluencerDashboard';
// import CreateMarket from './pages/CreateMarket';
// import PortfolioPage from './pages/PortfolioPage';
// import MarketDetailPage from './pages/MarketDetailPage';
// import { useMarkets } from './hooks/useMarkets';
import './App.css';

export const DUMMY_MARKETS = [
  { id: 1, title: 'Ethereum to reach $4,000 by June 2026?', volume: '$2.4M', yesPrice: 65, noPrice: 35, category: 'Crypto', icon: '⟠' },
  { id: 2, title: 'Will AI regulation bill pass in US this year?', volume: '$850K', yesPrice: 42, noPrice: 58, category: 'Politics', icon: '🏛️' },
  { id: 3, title: 'LayerZero to announce V3 by Q3 2026?', volume: '$1.2M', yesPrice: 78, noPrice: 22, category: 'Crypto', icon: '⚡' },
  { id: 4, title: 'Bitcoin Spot ETF total AUM > $100B in 2026?', volume: '$5.1M', yesPrice: 89, noPrice: 11, category: 'Crypto', icon: '₿' },
  { id: 5, title: 'Alchemy to go public via IPO in 2026?', volume: '$320K', yesPrice: 38, noPrice: 62, category: 'Tech', icon: '🔮' },
  { id: 6, title: 'US Fed cut rates at least 3x before EOY 2026?', volume: '$3.7M', yesPrice: 54, noPrice: 46, category: 'Economics', icon: '🏦' },
];

const TABS = ['Trending', 'Crypto', 'Politics', 'Tech', 'Economics'];

function AppContent() {
  const [page, setPage] = useState('markets');
  
  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>System Isolated</h2>
      <p style={{ color: '#888' }}>All components disabled for tracking.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #333', display: 'inline-block' }}>
        Status: Base React Environment OK
      </div>
    </div>;
  };

  return (
    <main className="container">
      {renderPage()}
    </main>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
