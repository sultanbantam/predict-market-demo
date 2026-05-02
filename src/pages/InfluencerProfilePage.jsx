const InfluencerProfilePage = ({ influencer, onBack }) => {
  if (!influencer) return null;

  const isPositive = (val) => typeof val === 'string' ? val.startsWith('+') : val >= 0;

  // Computed bar heights for mini chart
  const maxAbs = Math.max(...influencer.monthlyPerf.map(m => Math.abs(m.ret)));

  return (
    <div className="animate-fade-in">

      {/* Back Button */}
      <button
        className="btn btn-secondary flex items-center gap-2"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}
        onClick={onBack}
      >
        ← Back to Predictors
      </button>

      {/* === HERO SECTION === */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient blob */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: '220px', height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(47,128,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="flex items-center gap-5" style={{ flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={influencer.avatar}
              alt={influencer.name}
              style={{
                width: '88px', height: '88px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-blue)',
                boxShadow: '0 0 24px rgba(47,128,237,0.4)',
              }}
            />
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: '18px', height: '18px',
              borderRadius: '50%', background: 'var(--color-yes)',
              border: '3px solid var(--bg-secondary)',
            }} />
          </div>

          {/* Name & Bio */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div className="flex items-center gap-3" style={{ flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <h2 className="font-bold" style={{ fontSize: '1.4rem' }}>{influencer.name}</h2>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                color: influencer.tierColor,
                background: `${influencer.tierColor}22`,
                border: `1px solid ${influencer.tierColor}44`,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {influencer.tier}
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{influencer.handle}</div>
            <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '500px' }}>
              {influencer.bio}
            </p>
          </div>

          {/* Follower / Follow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{influencer.followers}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>followers</div>
            </div>
            <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1.5rem' }}>
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* === STATS GRID === */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Win Rate', value: `${influencer.stats.winRate}%`, color: 'var(--accent-blue)' },
          { label: 'Total Volume', value: influencer.stats.totalVolume, color: 'var(--text-primary)' },
          { label: 'Total Trades', value: influencer.stats.totalTrades, color: 'var(--text-primary)' },
          { label: 'Total Profit', value: influencer.stats.profit, color: 'var(--color-yes)' },
          { label: 'Monthly Return', value: influencer.stats.monthlyReturn, color: isPositive(influencer.stats.monthlyReturn) ? 'var(--color-yes)' : 'var(--color-no)' },
          { label: 'Win Streak', value: `${influencer.stats.streak} 🔥`, color: '#FF9800' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* === TWO COLUMN: Monthly Perf Chart + Open Positions === */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* Monthly Performance Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
            Monthly Performance (6M)
          </h3>
          <div className="flex items-end gap-2" style={{ height: '100px', paddingBottom: '4px' }}>
            {influencer.monthlyPerf.map(m => {
              const ratio = Math.abs(m.ret) / maxAbs;
              const barHeight = Math.max(ratio * 80, 6);
              const pos = m.ret >= 0;
              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    borderRadius: '4px 4px 0 0',
                    background: pos ? 'var(--color-yes)' : 'var(--color-no)',
                    opacity: 0.85,
                    transition: 'height 0.4s ease',
                  }} />
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.month}</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between" style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-no)' }}>● Negative</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-yes)' }}>● Positive</span>
          </div>
        </div>

        {/* Open Positions */}
        <div className="card">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Open Positions ({influencer.openPositions.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {influencer.openPositions.length > 0 ? influencer.openPositions.map((pos, i) => {
              const pnlPct = (((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100).toFixed(1);
              const isGain = pnlPct >= 0;
              return (
                <div key={i} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {pos.market}
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      color: pos.position === 'Yes' ? 'var(--color-yes)' : 'var(--color-no)',
                      textTransform: 'uppercase',
                    }}>
                      {pos.position}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Size: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pos.size}</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: isGain ? 'var(--color-yes)' : 'var(--color-no)', fontWeight: 700 }}>
                      {isGain ? '+' : ''}{pnlPct}%
                    </span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-muted text-sm">No open positions currently.</p>
            )}
          </div>
        </div>
      </div>

      {/* === TRADE HISTORY TABLE === */}
      <div className="card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
          Trade History
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Market', 'Position', 'Entry', 'Exit', 'P&L', 'Status', 'Date'].map(col => (
                  <th key={col} style={{
                    textAlign: 'left', padding: '0.5rem 0.75rem',
                    color: 'var(--text-muted)', fontWeight: 600,
                    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {influencer.history.map((trade) => (
                <tr
                  key={trade.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem', maxWidth: '260px' }}>
                    <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{trade.market}</span>
                  </td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem',
                      color: trade.position === 'Yes' ? 'var(--color-yes)' : 'var(--color-no)',
                      background: trade.position === 'Yes' ? 'var(--color-yes-light)' : 'var(--color-no-light)',
                    }}>
                      {trade.position}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{trade.entry}¢</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{trade.exit}¢</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: isPositive(trade.pnl) ? 'var(--color-yes)' : 'var(--color-no)' }}>
                    {trade.pnl}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                      color: trade.status === 'Won' ? 'var(--color-yes)' : 'var(--color-no)',
                      background: trade.status === 'Won' ? 'var(--color-yes-light)' : 'var(--color-no-light)',
                    }}>
                      {trade.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{trade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfilePage;
