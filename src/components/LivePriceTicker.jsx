import { useEffect, useState } from 'react';

// Uses Binance WebSocket for real-time price (free, no API key)
// Falls back to CoinGecko REST for initial price

const PAIRS = [
  { symbol: 'ETHUSDT', label: 'ETH', cgId: 'ethereum', icon: '⟠' },
  { symbol: 'BTCUSDT', label: 'BTC', cgId: 'bitcoin', icon: '₿' },
  { symbol: 'SOLUSDT', label: 'SOL', cgId: 'solana', icon: '◎' },
  { symbol: 'LINKUSDT', label: 'LINK', cgId: 'chainlink', icon: '🔗' },
];

const LivePriceTicker = () => {
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [flash, setFlash] = useState({});

  useEffect(() => {
    // Initial prices from CoinGecko (free, no key)
    const ids = PAIRS.map(p => p.cgId).join(',');
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
      .then(r => r.json())
      .then(data => {
        const p = {};
        const c = {};
        PAIRS.forEach(pair => {
          if (data[pair.cgId]) {
            p[pair.symbol] = data[pair.cgId].usd;
            c[pair.symbol] = data[pair.cgId].usd_24h_change;
          }
        });
        setPrices(p);
        setChanges(c);
      })
      .catch(() => {
        // Fallback static prices if CoinGecko fails
        setPrices({ ETHUSDT: 3254.80, BTCUSDT: 63420.50, SOLUSDT: 142.30, LINKUSDT: 18.45 });
        setChanges({ ETHUSDT: 2.4, BTCUSDT: 1.8, SOLUSDT: -0.5, LINKUSDT: 3.2 });
      });

    // Binance WebSocket streams (free, multiple streams)
    const streams = PAIRS.map(p => `${p.symbol.toLowerCase()}@miniTicker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.data) {
        const { s: symbol, c: closePrice, P: changePercent } = msg.data;
        const price = parseFloat(closePrice);
        setPrices(prev => {
          if (prev[symbol] !== undefined && Math.abs(price - prev[symbol]) > 0.001) {
            setFlash(f => ({ ...f, [symbol]: price > prev[symbol] ? 'up' : 'down' }));
            setTimeout(() => setFlash(f => ({ ...f, [symbol]: null })), 600);
          }
          return { ...prev, [symbol]: price };
        });
        setChanges(prev => ({ ...prev, [symbol]: parseFloat(changePercent) }));
      }
    };

    ws.onerror = () => ws.close();

    return () => ws.close();
  }, []);

  const fmt = (val) => {
    if (!val) return '—';
    if (val > 10000) return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (val > 100) return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  return (
    <div style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-primary)',
      overflowX: 'auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        maxWidth: '1200px', margin: '0 auto',
        padding: '0.4rem 1.5rem', gap: '2rem',
      }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Live Prices
        </div>
        {PAIRS.map(pair => {
          const price = prices[pair.symbol];
          const change = changes[pair.symbol];
          const isPos = change >= 0;
          const flashDir = flash[pair.symbol];
          return (
            <div key={pair.symbol} className="flex items-center gap-2" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              <span style={{ fontSize: '0.85rem' }}>{pair.icon}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{pair.label}</span>
              <span style={{
                fontSize: '0.82rem', fontWeight: 700,
                color: flashDir === 'up' ? 'var(--color-yes)' : flashDir === 'down' ? 'var(--color-no)' : 'var(--text-primary)',
                transition: 'color 0.3s ease',
                fontFamily: 'monospace',
              }}>
                {price ? fmt(price) : '...'}
              </span>
              {change !== undefined && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600,
                  color: isPos ? 'var(--color-yes)' : 'var(--color-no)',
                  padding: '1px 5px',
                  background: isPos ? 'var(--color-yes-light)' : 'var(--color-no-light)',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {isPos ? '+' : ''}{change?.toFixed(2)}%
                </span>
              )}
            </div>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>
          via Binance · CoinGecko
        </div>
      </div>
    </div>
  );
};

export default LivePriceTicker;
