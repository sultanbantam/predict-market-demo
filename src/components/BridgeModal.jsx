import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WalletConnectModal from './WalletConnectModal';

const NETWORKS = [
  { id: 'arb', name: 'Arbitrum', icon: '🔵' },
  { id: 'op', name: 'Optimism', icon: '🔴' },
  { id: 'pol', name: 'Polygon', icon: '🟣' },
  { id: 'base', name: 'Base', icon: '🔵' },
];

const BridgeModal = ({ onClose }) => {
  const { isWalletConnected } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const [fromNetwork, setFromNetwork] = useState(NETWORKS[0]);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | approving | bridging | success

  const handleBridge = () => {
    if (!isWalletConnected) {
      setShowWallet(true);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) return;

    setStatus('approving');
    setTimeout(() => {
      setStatus('bridging');
      setTimeout(() => {
        setStatus('success');
      }, 2500);
    }, 1500);
  };

  return (
    <>
      {showWallet && <WalletConnectModal onClose={() => setShowWallet(false)} />}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '440px',
            padding: '1.75rem', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            position: 'relative', overflow: 'hidden',
          }}
          onClick={e => e.stopPropagation()}
          className="animate-fade-in"
        >
          {/* LayerZero Watermark Background */}
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', opacity: 0.03, pointerEvents: 'none', transform: 'rotate(15deg)'
          }}>
            ⚡
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--color-yes-light)', border: '2px solid var(--color-yes)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto 1rem',
                boxShadow: '0 0 20px var(--color-yes-light)'
              }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.25rem' }}>Bridge Successful!</h3>
              <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Successfully bridged <strong>${amount} USDC</strong> from {fromNetwork.name} to ApolloView via LayerZero.
              </p>
              
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.8rem', textAlign: 'left' }}>
                <div className="flex justify-between" style={{ marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status</span>
                  <span style={{ color: 'var(--color-yes)', fontWeight: 600 }}>Delivered</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>LayerZero Scan</span>
                  <a href="#" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>View Tx ↗</a>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }} onClick={onClose}>
                Start Trading →
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Bridge USDC <span style={{ fontSize: '0.75rem', background: '#000', color: '#fff', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px' }}>OFT</span>
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Powered by ⚡ LayerZero
                  </div>
                </div>
                <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>✕</button>
              </div>

              {/* Network Selection */}
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                {/* From Network */}
                <div style={{
                  padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>From</div>
                  <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                    {NETWORKS.map(net => (
                      <button key={net.id} onClick={() => setFromNetwork(net)} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid',
                        borderColor: fromNetwork.id === net.id ? 'var(--accent-blue)' : 'var(--border-color)',
                        background: fromNetwork.id === net.id ? 'rgba(47,128,237,0.1)' : 'transparent',
                        color: fromNetwork.id === net.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                      }}>
                        {net.icon} {net.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '32px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                  fontSize: '1rem', color: 'var(--text-muted)'
                }}>↓</div>

                {/* To Network (ApolloView) */}
                <div style={{
                  padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>To</div>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: '20px', height: '20px', background: 'linear-gradient(135deg, var(--accent-blue), #a78bfa)', borderRadius: '50%'
                    }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>ApolloView (Sepolia)</span>
                  </div>
                </div>
              </div>

              {/* Amount input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="flex justify-between" style={{ marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Amount (USDC)</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Balance: 5,000.00 USDC</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                  <input
                    type="number" min="1" placeholder="0.00"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    style={{
                      width: '100%', padding: '0.85rem 0.9rem', paddingLeft: '1.6rem',
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                      fontSize: '1rem', fontWeight: 600, outline: 'none',
                    }}
                  />
                  <button onClick={() => setAmount('5000')} style={{
                    position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                    padding: '0.25rem 0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600
                  }}>MAX</button>
                </div>
              </div>

              {/* Bridge Info */}
              <div style={{
                padding: '0.75rem', background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem',
                fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>LayerZero Fee</span>
                  <span style={{ fontWeight: 600 }}>$0.42 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Time</span>
                  <span style={{ fontWeight: 600 }}>~45 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>You will receive</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-yes)' }}>${amount ? (parseFloat(amount) - 0.42).toFixed(2) : '0.00'} USDC</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                disabled={!amount || status !== 'idle'}
                onClick={handleBridge}
                style={{
                  width: '100%', padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.95rem',
                  opacity: !amount || status !== 'idle' ? 0.6 : 1,
                  cursor: !amount ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative', overflow: 'hidden'
                }}>
                {status === 'approving' ? 'Approving USDC...' :
                 status === 'bridging' ? 'Initiating LayerZero Tx...' :
                 !isWalletConnected ? '🔗 Connect Wallet to Bridge' :
                 `Bridge to ApolloView`}
                
                {status === 'bridging' && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default BridgeModal;
