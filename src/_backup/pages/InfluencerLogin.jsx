import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const InfluencerLogin = ({ onNavigate }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaChecked) {
      setError('Please verify that you are not a bot.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        onNavigate('influencer-dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, var(--accent-blue), #a78bfa)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            boxShadow: '0 0 24px rgba(47,128,237,0.4)',
          }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Influencer Login</h1>
          <p className="text-secondary text-sm">Sign in to your predictor account</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex@predictl2.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Mock CAPTCHA */}
            <div style={{
              padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <input
                type="checkbox"
                id="captcha"
                checked={captchaChecked}
                onChange={e => setCaptchaChecked(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="captcha" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                I am not a robot
              </label>
              <div style={{ marginLeft: 'auto', fontSize: '1.25rem', opacity: 0.5 }}>🛡️</div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem', background: 'var(--color-no-light)',
                border: '1px solid var(--color-no)', borderRadius: 'var(--radius-sm)',
                color: 'var(--color-no)', fontSize: '0.85rem',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Demo hint */}
            <div style={{
              padding: '0.6rem 0.75rem', background: 'rgba(47,128,237,0.1)',
              border: '1px solid rgba(47,128,237,0.3)', borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem', color: 'var(--text-secondary)',
            }}>
              🧪 Demo: <code style={{ color: 'var(--accent-blue)' }}>alex@predictl2.com</code> / <code style={{ color: 'var(--accent-blue)' }}>demo123</code>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Social Logins */}
            <div style={{ margin: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Or continue with</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <SocialButton icon="🌐" label="Google" />
                <SocialButton icon="🍎" label="Apple" />
                <SocialButton icon="🔵" label="Facebook" />
              </div>
            </div>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('influencer-signup')}
              style={{ color: 'var(--accent-blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign up as Influencer
            </button>
          </div>
          <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Just want to bet?{' '}
            <button
              onClick={() => onNavigate('markets')}
              style={{ color: 'var(--text-secondary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Browse markets →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialButton = ({ icon, label }) => (
  <button
    type="button"
    className="btn btn-secondary"
    style={{
      padding: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '0.4rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem',
    }}
  >
    <span style={{ fontSize: '1.25rem' }}>{icon}</span>
    <span style={{ fontWeight: 600 }}>{label}</span>
  </button>
);

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-family)',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

export default InfluencerLogin;
