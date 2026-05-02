import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConnect } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const WalletConnectModal = ({ onClose }) => {
  const { isWalletConnected, walletAddress } = useAuth();
  const { connectors, connect, isPending, error: connectError } = useConnect();
  const [localError, setLocalError] = useState('');

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  const handleConnect = (connectorType) => {
    setLocalError('');
    try {
      if (connectorType === 'injected') {
        connect({ connector: injected() });
      } else if (connectorType === 'walletConnect') {
        const projectId = import.meta.env.VITE_WC_PROJECT_ID || 'demo';
        connect({ connector: walletConnect({ projectId }) });
      } else if (connectorType === 'coinbase') {
        connect({ connector: coinbaseWallet({ appName: 'PredictL2' }) });
      }
    } catch (err) {
      setLocalError(err.message || 'Connection failed.');
    }
  };

  const WALLET_OPTIONS = [
    { key: 'injected', name: 'MetaMask', icon: '🦊', desc: 'Browser extension wallet' },
    { key: 'walletConnect', name: 'WalletConnect', icon: '🔗', desc: 'Mobile & multi-wallet' },
    { key: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', desc: 'Coinbase self-custody' },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '420px',
          padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
        className="animate-fade-in"
      >
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px' }}>Connect Wallet</h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Network: <span style={{ color: '#a78bfa', fontWeight: 600 }}>Ethereum Sepolia</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
        </div>

        {isWalletConnected ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--color-yes-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 1rem',
            }}>✅</div>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Wallet Connected!</div>
            <div style={{
              fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)',
              background: 'var(--bg-primary)', padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)', display: 'inline-block', marginBottom: '0.5rem',
            }}>
              {shortAddr(walletAddress)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Ethereum Sepolia Testnet
            </div>
            <button className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-sm)' }} onClick={onClose}>
              Continue →
            </button>
          </div>
        ) : (
          <>
            <p className="text-secondary text-sm" style={{ marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Connect your wallet to place bets using <strong style={{ color: 'var(--text-primary)' }}>USDC</strong> on Sepolia testnet.
            </p>

            {WALLET_OPTIONS.map((w) => (
              <button
                key={w.key}
                className="flex items-center gap-4"
                onClick={() => handleConnect(w.key)}
                disabled={isPending}
                style={{
                  width: '100%', padding: '1rem',
                  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.6 : 1, transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <span style={{ fontSize: '1.75rem' }}>{w.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{w.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.desc}</div>
                </div>
                {isPending && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Connecting...
                  </span>
                )}
              </button>
            ))}

            {(localError || connectError) && (
              <div style={{
                padding: '0.75rem', background: 'var(--color-no-light)',
                border: '1px solid var(--color-no)', borderRadius: 'var(--radius-sm)',
                color: 'var(--color-no)', fontSize: '0.85rem', marginTop: '0.5rem',
              }}>⚠️ {localError || connectError?.message || 'Connection failed. Please make sure your wallet is open.'}</div>
            )}

            <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              By connecting you agree to our Terms of Service.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletConnectModal;
