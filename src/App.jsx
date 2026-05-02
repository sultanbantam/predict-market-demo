import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LivePriceTicker from './components/LivePriceTicker';
import MarketCard from './components/MarketCard';
import WalletConnectModal from './components/WalletConnectModal';
import BridgeModal from './components/BridgeModal';
import InfluencersPage from './pages/InfluencersPage';
import InfluencerProfilePage from './pages/InfluencerProfilePage';
import InfluencerLogin from './pages/InfluencerLogin';
import InfluencerSignup from './pages/InfluencerSignup';
import InfluencerDashboard from './pages/InfluencerDashboard';
import CreateMarket from './pages/CreateMarket';
import PortfolioPage from './pages/PortfolioPage';
import MarketDetailPage from './pages/MarketDetailPage';
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

function MarketsPage({ onViewMarket }) {
  // const { markets, isLoading, isError } = useMarkets();
  const markets = null;
  const isLoading = false;
  const isError = false;
  
  const [activeTab, setActiveTab] = useState('Trending');
  
  const displayMarkets = (markets && markets.length > 0) ? markets : DUMMY_MARKETS;
  const filtered = activeTab === 'Trending' ? displayMarkets : displayMarkets.filter(m => m.category === activeTab);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="animate-pulse" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          🔍 Scanning Blockchain for Markets...
        </div>
      </div>
    );
  }

  return (
    <>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 className="text-3xl font-bold animate-fade-in" style={{ marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Predict the Future
        </h1>
        <p className="text-secondary animate-fade-in" style={{ animationDelay: '0.05s', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          The world's most accurate prediction market. Bet on crypto, politics, and tech outcomes on Ethereum Sepolia.
        </p>
        <div className="flex justify-center gap-3 animate-fade-in" style={{ overflowX: 'auto', paddingBottom: '0.5rem', animationDelay: '0.1s' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid',
              borderColor: activeTab === tab ? 'var(--accent-blue)' : 'var(--border-color)',
              background: activeTab === tab ? 'rgba(47,128,237,0.1)' : 'var(--bg-secondary)',
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease',
            }}>{tab}</button>
          ))}
        </div>
      </header>

      {isError && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'var(--color-no-light)', color: 'var(--color-no)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.85rem' }}>
          ⚠️ Failed to connect to Sepolia. Showing cached markets.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((market, idx) => (
          <div key={market.id} className="animate-fade-in" style={{ animationDelay: `${0.05 + idx * 0.05}s` }}>
            <MarketCard market={market} onViewDetail={() => onViewMarket(market)} />
          </div>
        ))}
      </div>
    </>
  );
}

function AppContent() {
  const [page, setPage] = useState('markets');
  
  // Auto-fix for GitHub Pages subfolder routing
  useEffect(() => {
    if (window.location.pathname.includes('predict-market-demo') && page === '') {
      setPage('markets');
    }
  }, [page]);

  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showWallet, setShowWallet] = useState(false);
  const [showBridge, setShowBridge] = useState(false);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'markets':
        return <MarketsPage onViewMarket={(m) => { setSelectedMarket(m); navigate('market-detail'); }} />;
      case 'market-detail':
        return <MarketDetailPage market={selectedMarket} onBack={() => navigate('markets')} />;
      case 'influencers':
        return <InfluencersPage onViewProfile={(inf) => { setSelectedInfluencer(inf); navigate('profile'); }} />;
      case 'profile':
        return <InfluencerProfilePage influencer={selectedInfluencer} onBack={() => navigate('influencers')} />;
      case 'portfolio':
        return <PortfolioPage onNavigate={navigate} />;
      case 'influencer-login':
        return <InfluencerLogin onNavigate={navigate} />;
      case 'influencer-signup':
        return <InfluencerSignup onNavigate={navigate} />;
      case 'influencer-dashboard':
        return <InfluencerDashboard onNavigate={navigate} />;
      case 'create-market':
        return <CreateMarket onNavigate={navigate} />;
      default:
        return <MarketsPage onViewMarket={(m) => { setSelectedMarket(m); navigate('market-detail'); }} />;
    }
  };

  const activeNavPage = ['influencer-login', 'influencer-signup', 'influencer-dashboard', 'create-market', 'profile'].includes(page)
    ? (page === 'profile' ? 'influencers' : 'influencers') : page === 'market-detail' ? 'markets' : page;

  return (
    <>
      {/* <Navbar activePage={activeNavPage} onNavigate={navigate} onShowWallet={() => setShowWallet(true)} onShowBridge={() => setShowBridge(true)} /> */}
      <LivePriceTicker />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {renderPage()}
      </main>
      {/* {showWallet && <WalletConnectModal onClose={() => setShowWallet(false)} />} */}
      {/* {showBridge && <BridgeModal onClose={() => setShowBridge(false)} />} */}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
