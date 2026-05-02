import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MarketFactory_ABI } from '../lib/abis';
import { CONTRACT_ADDRESSES } from '../lib/contracts';

const CATEGORIES = ['Crypto', 'Politics', 'Economics', 'Sports', 'Tech', 'Pop Culture', 'Science'];

const CreateMarket = ({ onNavigate }) => {
  const { user, isWalletConnected } = useAuth();
  const [step, setStep] = useState('form'); // form | preview | shared
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    resolutionDate: '',
    resolutionCriteria: '',
    initialLiquidity: '100',
  });
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const { data: txHash, isPending, writeContract, error: writeError } = useWriteContract();
  // const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
  //   hash: txHash || undefined,
  //   query: { enabled: Boolean(txHash) }
  // });
  const isConfirming = false;
  const isSuccess = false;

  // Handle successful creation
  useEffect(() => {
    if (isSuccess && step === 'pending') {
      setStep('shared');
    }
  }, [isSuccess, step]);

  if (!user) {
    onNavigate('influencer-login');
    return null;
  }

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const marketId = `market-${Date.now()}`;
  const shareUrl = `https://predictl2.app/market/${marketId}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔮 I just created a new prediction market!\n\n"${form.title}"\n\nCome bet on it 👇`)}&url=${encodeURIComponent(shareUrl)}`;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!isWalletConnected) return;

    const resTimeUnix = BigInt(Math.floor(new Date(form.resolutionDate).getTime() / 1000));
    
    writeContract({
      address: CONTRACT_ADDRESSES.MARKET_FACTORY,
      abi: MarketFactory_ABI,
      functionName: 'createMarket',
      args: [form.title, form.category, resTimeUnix],
    });
    
    setCreated({ ...form, id: marketId, createdAt: new Date().toISOString() });
    setStep('pending');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '1rem' }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '600px' }}>

        <button className="btn btn-secondary flex items-center gap-2"
          style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', fontSize: '0.875rem' }}
          onClick={() => onNavigate('influencer-dashboard')}>
          ← Back to Dashboard
        </button>

        {step === 'form' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create New Market</h1>
              <p className="text-secondary text-sm">Ask the crowd a question. Let the market decide the probability.</p>
            </div>

            {!isWalletConnected && (
              <div style={{
                padding: '0.75rem 1rem', marginBottom: '1rem',
                background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)',
                borderRadius: 'var(--radius-sm)', color: '#FF9800', fontSize: '0.82rem',
              }}>
                ⚠️ You need to connect your wallet before creating a market. Go to your dashboard to connect.
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                <Field label="Market Question *">
                  <input type="text" required
                    placeholder='e.g. "Will ETH surpass $5,000 before December 2026?"'
                    value={form.title}
                    onChange={e => update('title', e.target.value)}
                    style={inputStyle} />
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Tip: Must be answerable with Yes or No and have a clear, verifiable result.
                  </p>
                </Field>

                <Field label="Category *">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {CATEGORIES.map(cat => (
                      <button type="button" key={cat}
                        onClick={() => update('category', cat)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: 'var(--radius-full)', fontSize: '0.8rem',
                          border: '1px solid',
                          borderColor: form.category === cat ? 'var(--accent-blue)' : 'var(--border-color)',
                          background: form.category === cat ? 'rgba(47,128,237,0.15)' : 'var(--bg-primary)',
                          color: form.category === cat ? 'var(--accent-blue)' : 'var(--text-muted)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Resolution Date *">
                  <input type="date" required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.resolutionDate}
                    onChange={e => update('resolutionDate', e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }} />
                </Field>

                <Field label="Resolution Criteria *">
                  <textarea
                    required
                    placeholder='e.g. "Resolves YES if ETH/USDC price on CoinGecko is ≥ $5,000 at 00:00 UTC on the resolution date."'
                    value={form.resolutionCriteria}
                    onChange={e => update('resolutionCriteria', e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                  />
                </Field>

                <Field label="Description (optional)">
                  <textarea
                    placeholder="Provide additional context or links for participants..."
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </Field>

                <Field label="Initial Liquidity (USDC)">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>$</span>
                    <input type="number" min="10"
                      value={form.initialLiquidity}
                      onChange={e => update('initialLiquidity', e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '1.6rem' }} />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Seed liquidity helps bootstrap the market. You'll earn fees from trading volume.
                  </p>
                </Field>

                <button type="submit"
                  className="btn btn-primary"
                  disabled={!isWalletConnected}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', opacity: isWalletConnected ? 1 : 0.5, cursor: isWalletConnected ? 'pointer' : 'not-allowed' }}>
                  {isWalletConnected ? '🚀 Create Market' : '🔗 Connect Wallet First'}
                </button>
              </div>
            </form>
          </>
        )}
        {step === 'pending' && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="animate-spin" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>⏳</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {isConfirming ? 'Confirming on Blockchain...' : 'Awaiting Signature...'}
            </h2>
            <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>
              Your market is being deployed to Ethereum Sepolia. Please wait for the transaction to complete.
            </p>
            {txHash && (
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>
                View on Etherscan ↗
              </a>
            )}
            {writeError && (
              <div style={{ marginTop: '1rem', color: 'var(--color-no)', fontSize: '0.8rem' }}>
                Error: {writeError.shortMessage || 'Transaction failed'}
              </div>
            )}
            {!isConfirming && !txHash && (
              <button className="btn btn-secondary" onClick={() => setStep('form')} style={{ marginTop: '1rem' }}>
                Cancel
              </button>
            )}
          </div>
        )}

        {/* === SHARE SCREEN === */}
        {step === 'shared' && created && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--color-yes-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', margin: '0 auto 1.5rem',
            }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Market Created!</h2>
            <p className="text-secondary text-sm" style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
              Your market is now live. Share it with your followers to get bets flowing in!
            </p>

            {/* Market Preview Card */}
            <div className="card" style={{ textAlign: 'left', marginBottom: '1.5rem', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                📊 {created.category}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4 }}>{created.title}</h3>
              <div className="flex gap-2">
                <div style={{ flex: 1, padding: '0.5rem', background: 'var(--color-yes-light)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-yes)' }}>50¢</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Yes</div>
                </div>
                <div style={{ flex: 1, padding: '0.5rem', background: 'var(--color-no-light)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-no)' }}>50¢</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No</div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* X/Twitter */}
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  padding: '0.85rem', borderRadius: 'var(--radius-sm)',
                  background: '#000', color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                  textDecoration: 'none', border: '1px solid #333',
                  transition: 'opacity 0.15s',
                }}>
                <span style={{ fontSize: '1.1rem' }}>𝕏</span> Share on X / Twitter
              </a>

              {/* Copy link */}
              <button
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}
                onClick={handleCopy}>
                {copied ? '✅ Copied!' : '🔗 Copy Market Link'}
              </button>

              <button className="btn" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}
                onClick={() => onNavigate('influencer-dashboard')}>
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={{
      display: 'block', fontSize: '0.78rem', fontWeight: 600,
      color: 'var(--text-secondary)', marginBottom: '0.4rem',
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
  fontSize: '0.9rem', fontFamily: 'var(--font-family)', outline: 'none',
};

export default CreateMarket;
