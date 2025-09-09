import React, { useEffect, useState } from 'react';
import { APIAuthenticated } from '../http';
import { EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ username: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await APIAuthenticated.get('/api/profile');
        setUser(res.data.data);
        setUserData({ username: res.data.data.username });
      } catch { console.log('Error fetching profile'); }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await APIAuthenticated.patch(`/api/updateUser/${user._id}`, { username: userData.username });
      alert('Username updated successfully');
      setUser({ ...user, username: userData.username });
      setIsEditing(false);
    } catch { alert('Failed to update username'); }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="cyber-spinner" />
      <p className="font-mono text-xs tracking-widest animate-pulse-glow" style={{ color: 'var(--neon-cyan)' }}>LOADING_PROFILE...</p>
    </div>
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-10">
        <p className="section-header mb-3">SYSTEM // USER</p>
        <h1 className="font-mono text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          YOUR<span className="neon-text-cyan">_</span>PROFILE
        </h1>
        <p className="font-mono text-sm mt-2" style={{ color: 'var(--text-muted)' }}>// manage account settings</p>
      </div>

      <div className="max-w-xl">
        {/* Profile Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.12)', position: 'relative' }}>
          {/* Top gradient bar */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))' }} />

          {/* Avatar section */}
          <div className="p-8 flex items-center gap-6" style={{ borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div className="flex items-center justify-center" style={{
                width: '80px', height: '80px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(184,67,255,0.1))',
                border: '2px solid rgba(0,212,255,0.3)',
                boxShadow: '0 0 20px rgba(0,212,255,0.2)',
              }}>
                <span className="font-mono text-3xl font-bold" style={{ color: 'var(--neon-cyan)' }}>
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Online dot */}
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: '12px', height: '12px', borderRadius: '50%',
                background: 'var(--neon-green)',
                boxShadow: '0 0 8px var(--neon-green)',
                border: '2px solid var(--bg-card)',
              }} />
            </div>

            {/* Username display */}
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>// USER_HANDLE</p>
              <h2 className="font-mono text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                @{user.username}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: 'var(--neon-green)', boxShadow: '0 0 4px var(--neon-green)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--neon-green)' }}>ONLINE</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">
            {/* Email field */}
            <div>
              <label className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// EMAIL_ADDRESS</label>
              <div className="flex items-center gap-3 p-4" style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)', borderLeft: '2px solid rgba(0,212,255,0.2)' }}>
                <EnvelopeIcon className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email || 'not set'}</span>
              </div>
            </div>

            {/* Username field */}
            <div>
              <label className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// USERNAME</label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    className="cyber-input font-mono"
                    autoFocus
                    placeholder="new username..."
                  />
                  <div className="flex gap-3">
                    <button onClick={handleUpdate} className="cyber-btn cyber-btn-success flex-1 py-2.5 text-xs">
                      <CheckIcon className="h-4 w-4" /> SAVE
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setUserData({ username: user.username }); }}
                      className="cyber-btn cyber-btn-danger flex-1 py-2.5 text-xs"
                    >
                      <XMarkIcon className="h-4 w-4" /> CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 cursor-pointer group" onClick={() => setIsEditing(true)}
                  style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)', borderLeft: '2px solid rgba(0,212,255,0.2)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderLeftColor = 'var(--neon-cyan)'; e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderLeftColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.background = 'rgba(0,212,255,0.03)'; }}
                >
                  <span className="font-mono text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{user.username}</span>
                  <span className="font-mono text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--neon-cyan)' }}>CLICK_TO_EDIT</span>
                </div>
              )}
            </div>

            <div className="cyber-divider" />

            {/* Edit button */}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="cyber-btn cyber-btn-primary w-full py-3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                EDIT_PROFILE
              </button>
            )}
          </div>

          {/* Bottom corner decoration */}
          <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '20px', height: '20px', borderBottom: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)' }} />
        </div>

        {/* System info */}
        <div className="mt-4 p-4" style={{ border: '1px solid rgba(0,212,255,0.06)', background: 'rgba(0,212,255,0.02)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            SYS // USER_ID: <span style={{ color: 'var(--neon-cyan)' }}>{user._id}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
