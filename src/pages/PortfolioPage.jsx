import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WalletConnectModal from '../components/WalletConnectModal';

// Mock portfolio data (will be replaced with on-chain reads in Phase 5)
const MOCK_POSITIONS = [
  { id: 1, market: 'Ethereum to reach $4,000 by June 2026?', side: 'Yes', shares: 154.2, entryPrice: 58, currentPrice: 65, invested: 89.44, icon: '⟠', category: 'Crypto', status: 'Active' },
  { id: 2, market: 'LayerZero V3 announced Q3 2026?', side: 'Yes', shares: 222.2, entryPrice: 45, currentPrice: 78, invested: 100.00, icon: '⚡', category: 'Crypto', status: 'Active' },
  { id: 3, market: 'US AI regulation bill pass 2026?', side: 'No', shares: 100.0, entryPrice: 60, currentPrice: 42, invested: 60.00, icon: '🏛️', category: 'Politics', status: 'Active' },
];

const MOCK_HISTORY = [
  { id: 4, market: 'Bitcoin ETF AUM > $50B in 2025?', side: 'Yes', invested: 200, payout: 280, pnl: '+$80.00', status: 'Won', date: '2026-03-12', icon: '₿' },
  { id: 5, market: 'Fed cut rates 2x before March 2026?', side: 'No', invested: 150, payout: 0, pnl: '-$150.00', status: 'Lost', date: '2026-03-01', icon: '🏦' },
  { id: 6, market: 'ETH Dencun upgrade in Feb 2026?', side: 'Yes', invested: 100, payout: 140, pnl: '+$40.00', status: 'Won', date: '2026-02-20', icon: '⟠' },
];

const PortfolioPage = ({ onNavigate }) => {
  const { isWalletConnected, walletAddress, usdcBalance } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const [activeTab, setActiveTab] = useState('positions');

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  // Compute totals
  const totalInvested = MOCK_POSITIONS.reduce((s, p) => s + p.invested, 0);
  const totalCurrentValue = MOCK_POSITIONS.reduce((s, p) => s + (p.shares * p.currentPrice / 100), 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalWon = MOCK_HISTORY.filter(h => h.status === 'Won').reduce((s, h) => s + (h.payout - h.invested), 0);

  const isUp = totalPnL >= 0;

  if (!isWalletConnected) {
    return (
      <>
        {showWallet && <WalletConnectModal onClose={() => setShowWallet(false)} />}
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Connect Your Wallet</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem', maxWidth: '380px', lineHeight: 1.6 }}>
            Connect your Ethereum wallet to view your open positions, trade history, and claim your winnings.
          </p>
          <button className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 2rem', fontSize: '1rem' }}
            onClick={() => setShowWallet(true)}>
            🔗 Connect Wallet
          </button>
          <button className="btn"
            style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}
            onClick={() => onNavigate('markets')}>
            Browse Markets Without Wallet →
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem' }}>Portfolio</h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {shortAddr(walletAddress)} · Ethereum Sepolia
            </div>
          </div>
          <div style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Balance</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>${usdcBalance}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USDC</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Invested', value: `$${totalInvested.toFixed(2)}`, icon: '💰', color: 'var(--text-primary)' },
          { label: 'Current Value', value: `$${totalCurrentValue.toFixed(2)}`, icon: '📊', color: 'var(--accent-blue)' },
          { label: 'Unrealized P&L', value: `${isUp ? '+' : ''}$${totalPnL.toFixed(2)}`, icon: isUp ? '📈' : '📉', color: isUp ? 'var(--color-yes)' : 'var(--color-no)' },
          { label: 'Realized Profit', value: `+$${totalWon.toFixed(2)}`, icon: '🏆', color: 'var(--color-yes)' },
          { label: 'Open Positions', value: MOCK_POSITIONS.length, icon: '🎯', color: 'var(--text-primary)' },
          { label: 'Total Trades', value: MOCK_POSITIONS.length + MOCK_HISTORY.length, icon: '🔄', color: 'var(--text-primary)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ marginBottom: '1.25rem' }}>
        {[
          { key: 'positions', label: `🎯 Open Positions (${MOCK_POSITIONS.length})` },
          { key: 'history', label: `📋 History (${MOCK_HISTORY.length})` },
          { key: 'claimable', label: '💎 Claimable' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: activeTab === tab.key ? 'var(--accent-blue)' : 'var(--border-color)',
            background: activeTab === tab.key ? 'rgba(47,128,237,0.15)' : 'var(--bg-secondary)',
            color: activeTab === tab.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Open Positions */}
      {activeTab === 'positions' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Market', 'Side', 'Shares', 'Invested', 'Current Value', 'P&L', 'Action'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left', padding: '0.5rem 0.75rem',
                      color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem',
                      textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_POSITIONS.map(pos => {
                  const currentVal = pos.shares * pos.currentPrice / 100;
                  const pnl = currentVal - pos.invested;
                  const pnlPct = (pnl / pos.invested * 100).toFixed(1);
                  const isProfit = pnl >= 0;
                  return (
                    <tr key={pos.id}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.75rem', maxWidth: '220px' }}>
                        <div className="flex items-center gap-2">
                          <span>{pos.icon}</span>
                          <div>
                            <div style={{ lineHeight: 1.3, color: 'var(--text-primary)' }}>{pos.market}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pos.category}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem',
                          color: pos.side === 'Yes' ? 'var(--color-yes)' : 'var(--color-no)',
                          background: pos.side === 'Yes' ? 'var(--color-yes-light)' : 'var(--color-no-light)',
                        }}>{pos.side}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        {pos.shares.toFixed(1)}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                        ${pos.invested.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
                        ${currentVal.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: isProfit ? 'var(--color-yes)' : 'var(--color-no)' }}>
                          {isProfit ? '+' : ''}${pnl.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: isProfit ? 'var(--color-yes)' : 'var(--color-no)' }}>
                          ({isProfit ? '+' : ''}{pnlPct}%)
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button className="btn btn-secondary"
                          style={{ fontSize: '0.72rem', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-sm)' }}>
                          Sell
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Market', 'Side', 'Invested', 'Payout', 'P&L', 'Result', 'Date'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left', padding: '0.5rem 0.75rem',
                      color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem',
                      textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map(h => (
                  <tr key={h.id}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.75rem', maxWidth: '220px' }}>
                      <div className="flex items-center gap-2">
                        <span>{h.icon}</span>
                        <span style={{ lineHeight: 1.3 }}>{h.market}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem',
                        color: h.side === 'Yes' ? 'var(--color-yes)' : 'var(--color-no)',
                        background: h.side === 'Yes' ? 'var(--color-yes-light)' : 'var(--color-no-light)',
                      }}>{h.side}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>${h.invested}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>${h.payout}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: h.pnl.startsWith('+') ? 'var(--color-yes)' : 'var(--color-no)' }}>
                      {h.pnl}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                        color: h.status === 'Won' ? 'var(--color-yes)' : 'var(--color-no)',
                        background: h.status === 'Won' ? 'var(--color-yes-light)' : 'var(--color-no-light)',
                      }}>{h.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Claimable Winnings */}
      {activeTab === 'claimable' && (
        <div>
          <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))' }}>
            <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Claimable</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-yes)' }}>$120.00</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>From 2 resolved markets</div>
              </div>
              <button className="btn" style={{
                padding: '0.85rem 2rem', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-yes)', color: 'var(--bg-primary)',
                fontWeight: 700, fontSize: '1rem',
              }}>
                💎 Claim All USDC
              </button>
            </div>
          </div>

          {MOCK_HISTORY.filter(h => h.status === 'Won').map(h => (
            <div key={h.id} className="card flex items-center justify-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                  <span>{h.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.market}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Resolved {h.date} · Side: <span style={{ color: 'var(--color-yes)' }}>{h.side}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-yes)', fontSize: '1rem' }}>${h.payout}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>USDC claimable</div>
                </div>
                <button className="btn" style={{
                  padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-yes-light)', color: 'var(--color-yes)',
                  border: '1px solid var(--color-yes)', fontWeight: 600,
                }}>Claim</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
