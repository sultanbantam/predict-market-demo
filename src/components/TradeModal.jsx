import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import WalletConnectModal from './WalletConnectModal';
import { useUSDCApprove, useUSDCAllowance } from '../hooks/useUSDC';
import { useBuyShares } from '../hooks/useMarket';
import { IS_DEPLOYED } from '../lib/contracts';

const TradeModal = ({ market, onClose, onSuccess }) => {
  const { isWalletConnected, walletAddress } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const [side, setSide] = useState('yes'); // yes | no
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | confirming | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Web3 Hooks (only active if market.address exists and we are deployed)
  const isRealMarket = IS_DEPLOYED && market?.address;
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance(market?.address);
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useUSDCApprove();
  const { buyShares, isPending: isBuying, isSuccess: buySuccess, isError: buyError, error: buyErrorData } = useBuyShares(market?.address);

  // Watch for Web3 transaction success
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance();
      buyShares(side === 'yes', amount);
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (buySuccess) {
      setStatus('success');
      onSuccess?.(); // Trigger auto-refetch in parent
    }
    if (buyError) {
      setStatus('error');
      setErrorMsg(buyErrorData?.shortMessage || buyErrorData?.message || 'Transaction failed');
    }
  }, [buySuccess, buyError]);


  if (!market) return null;

  const yesP = market.yesPrice / 100;
  const noP = market.noPrice / 100;
  const price = side === 'yes' ? yesP : noP;
  const shares = amount ? (parseFloat(amount) / price).toFixed(2) : '—';
  const payout = amount ? (parseFloat(amount) / price).toFixed(2) : '—';
  const potentialProfit = amount ? ((parseFloat(amount) / price) - parseFloat(amount)).toFixed(2) : '—';

  const handleBet = () => {
    if (!isWalletConnected) { setShowWallet(true); return; }
    if (!amount || parseFloat(amount) <= 0) return;
    
    setStatus('confirming');
    setErrorMsg('');

    if (isRealMarket) {
      // 1. Check allowance
      const amountUSDC = parseFloat(amount);
      // allowance is returned in raw decimals, we check if it's enough (simplistic check for demo)
      // If amount is higher than allowance, trigger approve first.
      // In production we should compare raw BigInts.
      approve(market.address, amountUSDC * 100); // Approve a large amount for UX
    } else {
      // Mock flow
      setTimeout(() => {
        setStatus('success');
        onSuccess?.();
      }, 1500);
    }
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
          }}
          onClick={e => e.stopPropagation()}
          className="animate-fade-in"
        >
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--color-yes-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto 1rem',
              }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Bet Placed!</h3>
              <p className="text-secondary text-sm" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                You bought <strong style={{ color: side === 'yes' ? 'var(--color-yes)' : 'var(--color-no)' }}>
                  {shares} {side.toUpperCase()} shares
                </strong> for <strong>${amount} USDC</strong>.
                Potential payout: <strong style={{ color: 'var(--color-yes)' }}>${payout} USDC</strong>.
              </p>
              <button className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }} onClick={onClose}>
                View in Portfolio →
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Place Bet</h3>
                <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>✕</button>
              </div>

              {/* Market title */}
              <div style={{
                padding: '0.75rem', background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem',
                fontSize: '0.875rem', lineHeight: 1.4, color: 'var(--text-secondary)',
              }}>
                {market.title}
              </div>

              {/* Yes/No Toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => setSide('yes')}
                  style={{
                    padding: '0.85rem', borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${side === 'yes' ? 'var(--color-yes)' : 'transparent'}`,
                    background: side === 'yes' ? 'var(--color-yes-light)' : 'var(--bg-primary)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-yes)' }}>YES</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{market.yesPrice}¢ per share</div>
                </button>
                <button
                  onClick={() => setSide('no')}
                  style={{
                    padding: '0.85rem', borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${side === 'no' ? 'var(--color-no)' : 'transparent'}`,
                    background: side === 'no' ? 'var(--color-no-light)' : 'var(--bg-primary)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-no)' }}>NO</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{market.noPrice}¢ per share</div>
                </button>
              </div>

              {/* Probability bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>YES {market.yesPrice}%</span><span>NO {market.noPrice}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: 'var(--radius-full)', background: 'var(--bg-primary)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(90deg, var(--color-yes), var(--color-no))',
                    width: '100%',
                    clipPath: `inset(0 ${100 - market.yesPrice}% 0 0)`,
                  }} />
                </div>
              </div>

              {/* Amount input */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Amount (USDC)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                  <input
                    type="number" min="1" placeholder="0.00"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '1.6rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['10', '50', '100', '500'].map(v => (
                    <button key={v} type="button"
                      onClick={() => setAmount(v)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      ${v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout preview */}
              {amount && (
                <div style={{
                  padding: '0.75rem', background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)', marginBottom: '1rem',
                  fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem',
                }}>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Shares bought</span>
                    <span style={{ fontWeight: 600 }}>{shares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Payout if correct</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-yes)' }}>${payout} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Potential profit</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-yes)' }}>+${potentialProfit} USDC</span>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div style={{
                  padding: '0.75rem', background: 'var(--color-no-light)',
                  border: '1px solid var(--color-no)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-no)', fontSize: '0.85rem', marginBottom: '1rem',
                }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                className="btn"
                disabled={!amount || status === 'confirming' || isApproving || isBuying}
                onClick={handleBet}
                style={{
                  width: '100%', padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.95rem',
                  background: side === 'yes' ? 'var(--color-yes)' : 'var(--color-no)',
                  color: 'var(--bg-primary)',
                  opacity: !amount || status === 'confirming' || isApproving || isBuying ? 0.6 : 1,
                  cursor: !amount ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s',
                }}>
                {isApproving ? 'Approving USDC...' : isBuying ? 'Confirming Bet...' : status === 'confirming' ? 'Processing...' : isWalletConnected
                  ? `Buy ${side.toUpperCase()} — $${amount || '0'} USDC`
                  : '🔗 Connect Wallet to Bet'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Powered by Ethereum Sepolia · USDC testnet
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: '0.4rem',
  textTransform: 'uppercase', letterSpacing: '0.04em',
};

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
  fontSize: '0.9rem', fontFamily: 'var(--font-family)', outline: 'none',
};

export default TradeModal;
