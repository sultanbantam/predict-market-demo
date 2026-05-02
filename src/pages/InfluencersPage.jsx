import { INFLUENCERS } from '../data/influencers';

const InfluencerCard = ({ influencer, onView }) => {
  const isPositive = influencer.stats.monthlyReturn.startsWith('+');

  return (
    <div
      className="card"
      onClick={() => onView(influencer)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-3">
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={influencer.avatar}
            alt={influencer.name}
            style={{
              width: '52px', height: '52px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-color)',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '14px', height: '14px',
            borderRadius: '50%',
            background: 'var(--color-yes)',
            border: '2px solid var(--bg-secondary)',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2">
            <span className="font-semibold" style={{ fontSize: '0.95rem' }}>{influencer.name}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)',
              color: influencer.tierColor,
              background: `${influencer.tierColor}22`,
              border: `1px solid ${influencer.tierColor}44`,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {influencer.tier}
            </span>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{influencer.handle}</div>
        </div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
          {influencer.followers} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>followers</span>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.75rem',
      }}>
        <StatBox label="Win Rate" value={`${influencer.stats.winRate}%`} highlight />
        <StatBox label="Total Vol" value={influencer.stats.totalVolume} />
        <StatBox label="Monthly" value={influencer.stats.monthlyReturn} positive={isPositive} />
      </div>

      {/* Categories */}
      <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
        {influencer.categories.map(c => (
          <span key={c} className="badge">{c}</span>
        ))}
      </div>

      {/* View Profile */}
      <button
        className="btn btn-secondary"
        style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
        onClick={(e) => { e.stopPropagation(); onView(influencer); }}
      >
        View Profile
      </button>
    </div>
  );
};

const StatBox = ({ label, value, highlight, positive }) => {
  let color = 'var(--text-primary)';
  if (positive === true) color = 'var(--color-yes)';
  if (positive === false) color = 'var(--color-no)';
  if (highlight) color = 'var(--accent-blue)';

  return (
    <div style={{
      background: 'var(--bg-primary)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.5rem 0.75rem',
      textAlign: 'center',
    }}>
      <div style={{ color, fontWeight: 700, fontSize: '0.9rem' }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
};

const InfluencersPage = ({ onViewProfile }) => {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-2xl font-bold animate-fade-in" style={{ marginBottom: '0.5rem' }}>
          🏆 Top Predictors
        </h1>
        <p className="text-secondary animate-fade-in" style={{ animationDelay: '0.05s' }}>
          Follow expert traders, track their performance, and copy their best positions.
        </p>
      </div>

      {/* Leaderboard summary bar */}
      <div
        className="animate-fade-in"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          animationDelay: '0.1s',
        }}
      >
        {[
          { label: 'Active Predictors', value: '1,248' },
          { label: 'Total Volume Predicted', value: '$48.2M' },
          { label: 'Avg Win Rate (Top 10)', value: '68%' },
          { label: 'Markets Covered', value: '340+' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div
        className="animate-fade-in"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
          animationDelay: '0.15s',
        }}
      >
        {INFLUENCERS.map((inf) => (
          <InfluencerCard key={inf.id} influencer={inf} onView={onViewProfile} />
        ))}
      </div>
    </div>
  );
};

export default InfluencersPage;
