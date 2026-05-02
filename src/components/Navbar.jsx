import { useAuth } from '../context/AuthContext';

const Navbar = ({ activePage, onNavigate, onShowWallet, onShowBridge }) => {
  const { user, walletAddress, isWalletConnected, logout } = useAuth();
  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); onNavigate('markets'); }}>
            <div style={{
              width: '26px', height: '26px',
              background: 'linear-gradient(135deg, var(--accent-blue), #a78bfa)',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(47,128,237,0.5)',
            }} />
            <span className="font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>
              Apollo<span style={{ color: 'var(--accent-blue)' }}>View</span>
            </span>
          </a>

          <div className="flex gap-4" style={{ marginLeft: '0.5rem' }}>
            {[
              { key: 'markets', label: 'Markets' },
              { key: 'influencers', label: '🏆 Predictors' },
              { key: 'portfolio', label: 'Portfolio' },
            ].map(item => (
              <a key={item.key} href="#" className={`nav-link ${activePage === item.key ? 'active' : ''}`}
                style={{ fontSize: '0.9rem' }}
                onClick={(e) => { e.preventDefault(); onNavigate(item.key); }}>
                {item.label}
              </a>
            ))}
            <button
              onClick={onShowBridge}
              className="nav-link"
              style={{
                fontSize: '0.9rem', background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', padding: 0
              }}
            >
              Bridge <span style={{ color: '#F7931A', fontSize: '1.1rem' }}>⚡</span>
            </button>
          </div>
        </div>

        {/* Right: Network + Wallet + Auth */}
        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem', color: 'var(--text-secondary)',
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
            Sepolia
          </div>

          {/* Wallet button */}
          {isWalletConnected ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--color-yes-light)', border: '1px solid var(--color-yes)',
              padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem', color: 'var(--color-yes)', fontFamily: 'monospace', fontWeight: 600,
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-yes)' }} />
              {shortAddr(walletAddress)}
            </div>
          ) : (
            <button className="btn btn-secondary"
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.82rem', padding: '0.4rem 1rem' }}
              onClick={onShowWallet}>
              🔗 Connect Wallet
            </button>
          )}

          {/* User auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('influencer-dashboard')}
                style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                title={user.name}>
                <img src={user.avatar} alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-blue)' }} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', fontSize: '0.82rem', padding: '0.4rem 1rem' }}
                onClick={() => onNavigate('influencer-login')}>
                Log In
              </button>
              <button className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', fontSize: '0.82rem', padding: '0.4rem 1rem' }}
                onClick={() => onNavigate('influencer-signup')}>
                Become Predictor
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
