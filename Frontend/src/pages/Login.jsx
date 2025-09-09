import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../http';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/api/login', userData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background accent circles */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,67,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="w-full" style={{ maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="logo-glow p-3 rounded-sm">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-mono text-xl font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
              TASK<span style={{ color: 'var(--neon-cyan)' }}>FLOW</span>
            </span>
          </div>
          <h1 className="font-mono text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            SYS<span style={{ color: 'var(--neon-cyan)' }}>_</span>LOGIN
          </h1>
          <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
            // authenticate to access your workspace
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card corner-cut animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                // EMAIL_ADDRESS
              </label>
              <div className="relative">
                <div className="cyber-field-icon">
                  <EnvelopeIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  className="cyber-input cyber-input--icon"
                  placeholder="user@domain.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                // PASSWORD
              </label>
              <div className="relative">
                <div className="cyber-field-icon">
                  <LockClosedIcon className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  className="cyber-input cyber-input--icon"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cyber-btn cyber-btn-primary w-full py-4 text-sm"
              style={{ marginTop: '8px' }}
            >
              {loading ? (
                <span className="cyber-btn-inner">
                  <div className="cyber-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="cyber-btn-inner">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  INITIATE_LOGIN
                </span>
              )}
            </button>

            <div className="cyber-divider" />

            <p className="text-center font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              NO_ACCOUNT ?{' '}
              <Link to="/register" className="hover-underline-cyan font-bold">
                REGISTER_HERE →
              </Link>
            </p>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center font-mono text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          SECURE_CONNECTION ● ENCRYPTED
        </p>
      </div>
    </div>
  );
};

export default Login;
