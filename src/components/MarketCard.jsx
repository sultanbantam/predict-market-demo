const MarketCard = ({ market, onViewDetail }) => {
  return (
    <div
      className="card flex flex-col justify-between"
      style={{ height: '100%', gap: '1rem', cursor: 'pointer' }}
      onClick={onViewDetail}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.1rem' }}>{market.icon}</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {market.category}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vol {market.volume}</span>
        </div>

        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '1rem' }}>
          {market.title}
        </h3>

        {/* Probability bar */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-yes)', fontWeight: 600 }}>YES {market.yesPrice}%</span>
            <span style={{ color: 'var(--color-no)', fontWeight: 600 }}>NO {market.noPrice}%</span>
          </div>
          <div style={{ height: '5px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${market.yesPrice}%`,
              background: 'linear-gradient(90deg, var(--color-yes), #00e676)',
              borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Buy buttons */}
      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          className="btn btn-yes"
          style={{ flex: 1, padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}
          onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(); }}
        >
          Buy YES · {market.yesPrice}¢
        </button>
        <button
          className="btn btn-no"
          style={{ flex: 1, padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}
          onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(); }}
        >
          Buy NO · {market.noPrice}¢
        </button>
      </div>
    </div>
  );
};

export default MarketCard;
