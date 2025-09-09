import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIAuthenticated } from '../http';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreateNote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', content: '', color: '#00d4ff' });

  const colors = [
    { name: 'Cyan', value: '#00d4ff' },
    { name: 'Purple', value: '#b843ff' },
    { name: 'Pink', value: '#ff3b8b' },
    { name: 'Green', value: '#00ffaa' },
    { name: 'Yellow', value: '#ffd700' },
    { name: 'Orange', value: '#ff9f43' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await APIAuthenticated.post('/api/note/create', noteData);
      navigate('/notes');
    } catch {
      alert('Error creating note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-widest group" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span style={{ color: 'var(--neon-purple)' }}>← BACK</span>
      </button>

      <div className="mb-8">
        <p className="section-header mb-3">SYSTEM // NOTES</p>
        <h1 className="font-mono text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          NEW<span className="neon-text-purple">_</span>NOTE
        </h1>
        <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-muted)' }}>// capture your thoughts</p>
      </div>

      <div className="max-w-3xl" style={{ background: 'var(--bg-card)', border: '1px solid rgba(184,67,255,0.12)', borderTop: '2px solid var(--neon-purple)', padding: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '20px', height: '20px', borderBottom: '2px solid var(--neon-purple)', borderRight: '2px solid var(--neon-purple)' }} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// NOTE_TITLE *</label>
            <input type="text" name="title" value={noteData.title} onChange={handleChange} placeholder="note title..." required className="cyber-input font-mono text-lg" />
          </div>

          {/* Color picker */}
          <div>
            <label className="block mb-3 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// ACCENT_COLOR</label>
            <div className="flex gap-3 flex-wrap">
              {colors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setNoteData({ ...noteData, color: c.value })}
                  title={c.name}
                  style={{
                    width: '36px', height: '36px',
                    background: c.value,
                    border: noteData.color === c.value ? `3px solid white` : '3px solid transparent',
                    boxShadow: noteData.color === c.value ? `0 0 14px ${c.value}, 0 0 6px ${c.value}` : 'none',
                    transform: noteData.color === c.value ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                />
              ))}
              <div className="flex items-center gap-2 ml-2">
                <div style={{ width: '3px', height: '36px', background: noteData.color, boxShadow: `0 0 8px ${noteData.color}` }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{noteData.color}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// CONTENT *</label>
            <textarea name="content" value={noteData.content} onChange={handleChange} placeholder="write your thoughts here..." required rows={12} className="cyber-input font-mono resize-none leading-relaxed" />
          </div>

          <div className="cyber-divider" />

          <button type="submit" disabled={loading} className="cyber-btn w-full py-4" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)', background: 'rgba(184,67,255,0.08)' }}>
            {loading ? (
              <span className="cyber-btn-inner">
                <div className="cyber-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'var(--neon-purple)', borderRightColor: 'var(--neon-cyan)' }} />
                SAVING...
              </span>
            ) : '💾 SAVE_NOTE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
