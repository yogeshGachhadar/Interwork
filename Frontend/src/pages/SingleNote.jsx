import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APIAuthenticated } from '../http';
import { ArrowLeftIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const SingleNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatedNote, setUpdatedNote] = useState({ title: '', content: '', color: '' });

    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);
                const res = await APIAuthenticated.get(`/api/note/${id}`);
                setNote(res.data.data);
                setUpdatedNote({ title: res.data.data.title, content: res.data.data.content, color: res.data.data.color });
            } catch { console.error('Error fetching note'); }
            finally { setLoading(false); }
        };
        fetchNote();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const res = await APIAuthenticated.patch(`/api/note/update/${id}`, updatedNote);
            setNote(res.data.data);
            setEditMode(false);
        } catch { alert('Failed to update note'); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this note?')) return;
        try { await APIAuthenticated.delete(`/api/note/delete/${id}`); navigate('/notes'); }
        catch { alert('Failed to delete note'); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="cyber-spinner" />
            <p className="font-mono text-xs tracking-widest animate-pulse-glow" style={{ color: 'var(--neon-cyan)' }}>LOADING...</p>
        </div>
    );

    if (!note) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <p className="font-mono text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>NOTE_NOT_FOUND</p>
            <button onClick={() => navigate('/notes')} className="cyber-btn" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>← BACK_TO_NOTES</button>
        </div>
    );

    return (
        <div className="pb-20">
            <button onClick={() => navigate('/notes')} className="flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-widest group" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span style={{ color: 'var(--neon-purple)' }}>← BACK_TO_NOTES</span>
            </button>

            <div className="max-w-4xl" style={{ background: 'var(--bg-card)', border: '1px solid rgba(184,67,255,0.12)', position: 'relative' }}>
                {/* Color accent bar */}
                <div style={{ height: '3px', background: `linear-gradient(90deg, ${note.color || 'var(--neon-purple)'}, transparent)` }} />

                <div className="p-8 md:p-10">
                    {editMode ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-mono text-lg font-bold" style={{ color: 'var(--neon-purple)' }}>EDIT_NOTE</h2>
                                <button onClick={() => setEditMode(false)} className="font-mono text-xs" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ CANCEL</button>
                            </div>
                            <input
                                className="cyber-input font-mono text-2xl font-bold w-full"
                                value={updatedNote.title}
                                onChange={e => setUpdatedNote({ ...updatedNote, title: e.target.value })}
                                placeholder="Note title..."
                            />
                            <textarea
                                className="cyber-input font-mono text-sm leading-relaxed resize-none w-full"
                                style={{ minHeight: '400px' }}
                                value={updatedNote.content}
                                onChange={e => setUpdatedNote({ ...updatedNote, content: e.target.value })}
                                placeholder="Start writing..."
                            />
                            <div className="cyber-divider" />
                            <div className="flex gap-4">
                                <button onClick={handleUpdate} className="cyber-btn flex-1 py-3" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)', background: 'rgba(184,67,255,0.08)' }}>
                                    💾 SAVE_CHANGES
                                </button>
                                <button onClick={() => setEditMode(false)} className="cyber-btn flex-1 py-3" style={{ borderColor: 'rgba(0,212,255,0.2)', color: 'var(--text-secondary)' }}>
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Header */}
                            <div className="flex justify-between items-start gap-6 mb-8">
                                <h1 className="font-mono text-3xl font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
                                    {note.title}
                                </h1>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => setEditMode(true)} className="p-2.5 rounded-sm transition-all" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--neon-cyan)', cursor: 'pointer' }}>
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={handleDelete} className="p-2.5 rounded-sm transition-all" style={{ background: 'rgba(255,59,139,0.06)', border: '1px solid rgba(255,59,139,0.2)', color: 'var(--neon-pink)', cursor: 'pointer' }}>
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)', minHeight: '300px' }}>
                                {note.content}
                            </div>

                            {/* Footer */}
                            <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,212,255,0.06)' }}>
                                <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                    LAST_EDITED: {new Date(note.updatedAt).toLocaleString()}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: note.color, boxShadow: `0 0 8px ${note.color}` }} />
                                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{note.color}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleNote;
