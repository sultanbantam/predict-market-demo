import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WalletConnectModal from '../components/WalletConnectModal';

const CREATED_MARKETS_MOCK = [
  { id: 'm1', title: 'ETH to reach $4,000 by June 2026?', category: 'Crypto', yesPrice: 65, volume: '$2.4M', status: 'Active', created: '2026-04-10' },
  { id: 'm2', title: 'LayerZero V3 announced Q3 2026?', category: 'Crypto', yesPrice: 78, volume: '$1.2M', status: 'Active', created: '2026-04-01' },
  { id: 'm3', title: 'Fed rate cut before Q2 2026?', category: 'Economics', yesPrice: 30, volume: '$870K', status: 'Resolved', created: '2026-03-15' },
];

const InfluencerDashboard = ({ onNavigate }) => {
  const { user, walletAddress, isWalletConnected, logout } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const [activeTab, setActiveTab] = useState('markets');

  if (!user) {
    onNavigate('influencer-login');
    return null;
  }

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="animate-fade-in">
      {showWallet && <WalletConnectModal onClose={() => setShowWallet(false)} />}

      {/* Profile Hero */}
      <div className="card" style={{
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, #1a1f2e 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Blob */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="flex items-center gap-5" style={{ flexWrap: 'wrap', position: 'relative' }}>
          <img
            src={user.avatar || '/influencer_alex.png'}
            alt={user.name}
            style={{
              width: '88px', height: '88px', borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--accent-blue)',
              boxShadow: '0 0 24px rgba(47,128,237,0.35)',
            }}
          />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div className="flex items-center gap-3" style={{ flexWrap: 'wrap', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user.name}</h2>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                color: user.tierColor, background: `${user.tierColor}22`,
                border: `1px solid ${user.tierColor}44`,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{user.tier}</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              {user.handle} {user.xHandle && (
                <span style={{ color: 'var(--accent-blue)' }}>• 𝕏 @{user.xHandle}</span>
              )}
            </div>
            <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '480px' }}>
              {user.bio || 'No bio yet. Edit your profile to add one.'}
            </p>
          </div>

          {/* Wallet Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
            {isWalletConnected ? (
              <div style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                background: 'var(--color-yes-light)',
                border: '1px solid var(--color-yes)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-yes)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-yes)', fontFamily: 'monospace' }}>
                  {shortAddr(walletAddress)}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sepolia</span>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
                onClick={() => setShowWallet(true)}>
                🔗 Connect Wallet
              </button>
            )}
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)' }}
              onClick={() => { logout(); onNavigate('markets'); }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Wallet required banner */}
        {!isWalletConnected && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 152, 0, 0.1)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem', color: '#FF9800',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            ⚠️ Connect your wallet to create markets and receive earnings from your predictions.
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Markets Created', value: '3', icon: '📊' },
          { label: 'Total Volume', value: '$4.47M', icon: '💰' },
          { label: 'Followers', value: user.followers, icon: '👥' },
          { label: 'Win Rate', value: '74%', icon: '🎯' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ marginBottom: '1.25rem' }}>
        {['markets', 'activity', 'security'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: activeTab === tab ? 'var(--accent-blue)' : 'var(--border-color)',
            background: activeTab === tab ? 'rgba(47,128,237,0.15)' : 'var(--bg-secondary)',
            color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
            textTransform: 'capitalize',
          }}>{tab === 'markets' ? '📊 My Markets' : tab === 'activity' ? '📈 Activity' : '🛡️ Security'}</button>
        ))}

        <button className="btn btn-primary" style={{ marginLeft: 'auto', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', padding: '0.4rem 1.25rem' }}
          onClick={() => onNavigate('create-market')}>
          + Create Market
        </button>
      </div>

      {/* My Markets Table */}
      {activeTab === 'markets' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Market', 'Category', 'Yes Price', 'Volume', 'Status', 'Created', 'Actions'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left', padding: '0.5rem 0.75rem',
                      color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem',
                      textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CREATED_MARKETS_MOCK.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.75rem', maxWidth: '240px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{m.title}</td>
                    <td style={{ padding: '0.75rem' }}><span className="badge">{m.category}</span></td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--color-yes)' }}>{m.yesPrice}¢</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{m.volume}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                        color: m.status === 'Active' ? 'var(--color-yes)' : 'var(--text-muted)',
                        background: m.status === 'Active' ? 'var(--color-yes-light)' : 'var(--bg-tertiary)',
                      }}>{m.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{m.created}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://predictl2.app/market/${m.id}`);
                          alert('Link copied!');
                        }}>
                        Share 🔗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card" style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📈</div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Activity feed coming soon</div>
          <div style={{ fontSize: '0.875rem' }}>Your prediction history and follower interactions will appear here.</div>
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {/* Account Security */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡️ Account Protection
            </h3>
            
            <SecurityItem 
              icon="📱" 
              title="2FA Verification" 
              desc="Require a code from your phone or email to sign in." 
              enabled={true} 
            />
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />
            <SecurityItem 
              icon="🖐️" 
              title="Biometric Login" 
              desc="Use FaceID or Fingerprint for faster, secure access." 
              enabled={false} 
            />
          </div>

          {/* Wallet Security */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💳 Wallet & Assets
            </h3>
            
            <SecurityItem 
              icon="🔢" 
              title="Wallet Transaction PIN" 
              desc="A 6-digit PIN required for all USDC transactions." 
              enabled={true} 
            />
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />
            <SecurityItem 
              icon="🤖" 
              title="Bot Protection" 
              desc="Advanced bot detection for fair market participation." 
              status="Verified User" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SecurityItem = ({ icon, title, desc, enabled, status }) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center gap-4">
      <div style={{ fontSize: '1.5rem', background: 'var(--bg-tertiary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
      </div>
      {status ? (
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-yes)', background: 'var(--color-yes-light)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>{status}</span>
      ) : (
        <button 
          onClick={() => setIsOn(!isOn)}
          style={{
            width: '42px', height: '22px', borderRadius: 'var(--radius-full)',
            background: isOn ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
            position: 'relative', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
          }}>
          <div style={{
            position: 'absolute', top: '3px', left: isOn ? '23px' : '3px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'white', transition: 'all 0.2s',
          }} />
        </button>
      )}
    </div>
  );
};

export default InfluencerDashboard;
