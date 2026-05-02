import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const InfluencerSignup = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [step, setStep] = useState(1); // 1: account, 2: profile
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    bio: '', xHandle: '', avatarUrl: '', avatarPreview: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setForm(p => ({ ...p, avatarPreview: previewUrl, avatarUrl: previewUrl }));
  };
  const handleStep1 = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters and include letters, numbers, and special characters.');
      return;
    }
    if (!captchaChecked) {
      setError('Please verify that you are not a bot.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = signup(form);
      if (result.success) {
        onNavigate('influencer-dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 800);
  };

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, var(--accent-blue), #a78bfa)',
            borderRadius: '50%', margin: '0 auto 1rem',
            boxShadow: '0 0 24px rgba(47,128,237,0.4)',
          }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Become a Predictor</h1>
          <p className="text-secondary text-sm">Create your influencer account and start building your reputation</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2" style={{ marginBottom: '1.5rem' }}>
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8rem',
                background: step >= s ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                color: step >= s ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>{s}</div>
              <span style={{ fontSize: '0.8rem', color: step >= s ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                {s === 1 ? 'Account' : 'Profile'}
              </span>
              {s < 2 && <div style={{ width: '32px', height: '1px', background: step > 1 ? 'var(--accent-blue)' : 'var(--border-color)' }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {/* STEP 1: Account Details */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Account Details</h3>

              <Field label="Full Name">
                <input type="text" required placeholder="Alex Chen" value={form.name}
                  onChange={e => update('name', e.target.value)} style={inputStyle} />
              </Field>

              <Field label="Email Address">
                <input type="email" required placeholder="you@example.com" value={form.email}
                  onChange={e => update('email', e.target.value)} style={inputStyle} />
              </Field>

              <Field label="Password">
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 characters (a1@...)" value={form.password}
                    onChange={e => update('password', e.target.value)} style={inputStyle} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleBtnStyle}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password">
                <div style={{ position: 'relative' }}>
                  <input type={showConfirmPassword ? 'text' : 'password'} required placeholder="Repeat your password" value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)} style={inputStyle} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={toggleBtnStyle}>
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </Field>

              {/* Mock CAPTCHA */}
              <div style={{
                padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem'
              }}>
                <input
                  type="checkbox"
                  id="signup-captcha"
                  checked={captchaChecked}
                  onChange={e => setCaptchaChecked(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="signup-captcha" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  I am not a robot
                </label>
                <div style={{ marginLeft: 'auto', fontSize: '1.25rem', opacity: 0.5 }}>🛡️</div>
              </div>

              {error && <ErrorBox msg={error} />}

              <button type="submit" className="btn btn-primary" style={btnStyle}>
                Next: Set Up Profile →
              </button>
            </form>
          )}

          {/* STEP 2: Profile */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Your Predictor Profile</h3>

              {/* Photo Upload */}
              <div>
                <label style={labelStyle}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    border: '2px dashed var(--border-color)',
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }} onClick={() => fileRef.current.click()}>
                    {form.avatarPreview
                      ? <img src={form.avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '1.5rem' }}>📷</span>
                    }
                  </div>
                  <div>
                    <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                      onClick={() => fileRef.current.click()}>
                      Choose Photo
                    </button>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      JPG, PNG or WebP. Max 5MB.
                    </p>
                    <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <Field label="Twitter / X Handle">
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', fontSize: '0.9rem',
                  }}>@</span>
                  <input type="text" placeholder="yourhandle" value={form.xHandle}
                    onChange={e => update('xHandle', e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
                </div>
              </Field>

              <Field label="Bio">
                <textarea
                  placeholder="Describe your expertise, trading style, and what markets you cover..."
                  value={form.bio}
                  onChange={e => update('bio', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                />
              </Field>

              {error && <ErrorBox msg={error} />}

              <div className="flex gap-3">
                <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ flex: 2, padding: '0.75rem', borderRadius: 'var(--radius-sm)', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Creating Account...' : '🚀 Create Account'}
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button onClick={() => onNavigate('influencer-login')}
              style={{ color: 'var(--accent-blue)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const ErrorBox = ({ msg }) => (
  <div style={{
    padding: '0.75rem', background: 'var(--color-no-light)',
    border: '1px solid var(--color-no)', borderRadius: 'var(--radius-sm)',
    color: 'var(--color-no)', fontSize: '0.85rem',
  }}>⚠️ {msg}</div>
);

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: '0.4rem',
  textTransform: 'uppercase', letterSpacing: '0.04em',
};

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)', fontSize: '0.9rem',
  fontFamily: 'var(--font-family)', outline: 'none',
};

const toggleBtnStyle = {
  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
  fontSize: '0.75rem', fontWeight: 600,
};

const btnStyle = {
  width: '100%', padding: '0.75rem',
  borderRadius: 'var(--radius-sm)', marginTop: '0.5rem',
};

export default InfluencerSignup;
