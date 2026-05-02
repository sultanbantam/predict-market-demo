import { useState } from 'react';
import PriceChart from '../components/PriceChart';
import TradeModal from '../components/TradeModal';
import CommentSection from '../components/CommentSection';

const MarketDetailPage = ({ market, onBack }) => {
  const [showTrade, setShowTrade] = useState(false);
  const [chartDays, setChartDays] = useState(7);
  const [copied, setCopied] = useState(false);

  if (!market) return null;

  // Extract target price from title (e.g. "$4,000")
  const priceMatch = market.title.match(/\$([0-9,]+)/);
  const targetPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://predictl2.app/market/${market.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      {showTrade && <TradeModal market={market} onClose={() => setShowTrade(false)} />}

      {/* Back */}
      <button className="btn btn-secondary flex items-center gap-2"
        style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', fontSize: '0.875rem' }}
        onClick={onBack}>
        ← Back to Markets
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: Chart + Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Market Header */}
          <div className="card">
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{market.icon}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {market.category}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Vol {market.volume}
              </span>
              <button className="btn btn-secondary"
                style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
                onClick={handleCopy}>
                {copied ? '✅' : '🔗'} {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1rem' }}>
              {market.title}
            </h1>

            {/* Probability bar */}
            <div>
              <div className="flex justify-between" style={{ marginBottom: '6px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-yes)', fontWeight: 700 }}>YES {market.yesPrice}%</span>
                <span style={{ color: 'var(--color-no)', fontWeight: 700 }}>NO {market.noPrice}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${market.yesPrice}%`,
                  background: 'linear-gradient(90deg, var(--color-yes), #00e676)',
                  borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Market implies {market.yesPrice}% probability of YES
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Price Chart</h3>
              <div className="flex gap-1">
                {[1, 7, 30].map(d => (
                  <button key={d} onClick={() => setChartDays(d)}
                    style={{
                      padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 600,
                      borderRadius: 'var(--radius-full)', border: '1px solid',
                      borderColor: chartDays === d ? 'var(--accent-blue)' : 'var(--border-color)',
                      background: chartDays === d ? 'rgba(47,128,237,0.15)' : 'transparent',
                      color: chartDays === d ? 'var(--accent-blue)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}>
                    {d}D
                  </button>
                ))}
              </div>
            </div>
            <PriceChart marketTitle={market.title} targetPrice={targetPrice} days={chartDays} />
          </div>

          {/* Resolution Criteria */}
          <div className="card">
            <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Resolution Criteria
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {market.title.toLowerCase().includes('eth') || market.title.toLowerCase().includes('bitcoin') || market.title.toLowerCase().includes('btc')
                ? `Resolves YES if the spot price on CoinGecko / Binance is at or above the target on the resolution date at 00:00 UTC. Oracle source: CoinGecko + Binance API.`
                : `Resolves based on publicly verifiable information from credible news sources. The market creator is responsible for providing resolution evidence.`}
            </p>
            {targetPrice && (
              <div style={{
                marginTop: '0.75rem', padding: '0.6rem 0.9rem',
                background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#FFD700',
              }}>
                🎯 Target Price: <strong>${targetPrice.toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right: Trade Panel */}
        <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Trade */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Trade</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                className="btn btn-yes"
                style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', flexDirection: 'column', gap: '2px' }}
                onClick={() => setShowTrade(true)}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>YES</span>
                <span style={{ fontSize: '0.8rem' }}>{market.yesPrice}¢</span>
              </button>
              <button
                className="btn btn-no"
                style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', flexDirection: 'column', gap: '2px' }}
                onClick={() => setShowTrade(true)}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>NO</span>
                <span style={{ fontSize: '0.8rem' }}>{market.noPrice}¢</span>
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
              Bet with USDC · Ethereum Sepolia<br />
              <span style={{ color: 'var(--accent-blue)' }}>Powered by Alchemy</span>
            </div>
          </div>

          {/* Market Stats */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Market Stats
            </h3>
            {[
              { label: 'Total Volume', value: market.volume },
              { label: 'Yes Price', value: `${market.yesPrice}¢`, color: 'var(--color-yes)' },
              { label: 'No Price', value: `${market.noPrice}¢`, color: 'var(--color-no)' },
              { label: 'Liquidity', value: '$45,200' },
              { label: 'Traders', value: '1,284' },
            ].map(s => (
              <div key={s.label} className="flex justify-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontWeight: 600, color: s.color || 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div style={{ maxWidth: '820px' }}>
        <CommentSection />
      </div>
    </div>
  );
};

export default MarketDetailPage;
