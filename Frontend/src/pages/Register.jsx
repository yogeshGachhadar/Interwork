import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../http';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/api/register', userData);
      alert('Account created successfully! You can now sign in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background accents */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,67,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
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
            NEW<span style={{ color: 'var(--neon-purple)' }}>_</span>USER
          </h1>
          <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
            // create your account to get started
          </p>
        </div>

        {/* Auth Card — purple accent on top */}
        <div
          className="auth-card corner-cut animate-slide-up"
          style={{ '--top-accent': 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))' }}
        >
          <style>{`.auth-card::before { background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan)); }`}</style>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                // USERNAME
              </label>
              <div className="relative">
                <div className="cyber-field-icon">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  className="cyber-input cyber-input--icon"
                  placeholder="your_handle"
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
              className="cyber-btn w-full py-4 text-sm"
              style={{
                borderColor: 'var(--neon-purple)',
                color: 'var(--neon-purple)',
                background: 'linear-gradient(135deg, rgba(184,67,255,0.1), rgba(0,212,255,0.05))',
                marginTop: '8px',
              }}
            >
              {loading ? (
                <span className="cyber-btn-inner">
                  <div className="cyber-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'var(--neon-purple)', borderRightColor: 'var(--neon-cyan)' }} />
                  CREATING_ACCOUNT...
                </span>
              ) : (
                <span className="cyber-btn-inner">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  CREATE_ACCOUNT
                </span>
              )}
            </button>

            <div className="cyber-divider" />

            <p className="text-center font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              HAVE_ACCOUNT ?{' '}
              <Link to="/login" className="hover-underline-cyan font-bold">
                SIGN_IN →
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center font-mono text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          SECURE_CONNECTION ● ENCRYPTED
        </p>
      </div>
    </div>
  );
};

export default Register;
