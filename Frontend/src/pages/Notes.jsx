import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APIAuthenticated } from '../http';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await APIAuthenticated.get('/api/note/getAll');
            setNotes(response.data.data);
        } catch (err) {
            console.error('Error fetching notes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await APIAuthenticated.delete(`/api/note/delete/${id}`);
            setNotes(notes.filter(n => n._id !== id));
        } catch {
            alert('Failed to delete note');
        }
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="section-header mb-3">SYSTEM // NOTES</p>
                    <h1 className="font-mono text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        SECOND<span className="neon-text-purple">_</span>BRAIN
                    </h1>
                    <p className="font-mono text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                        // {notes.length} note(s) stored
                    </p>
                </div>
                <Link to="/createNote" className="cyber-btn self-start md:self-auto" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)', background: 'rgba(184,67,255,0.06)' }}>
                    <PlusIcon className="h-4 w-4" />
                    NEW_NOTE
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="cyber-spinner" />
                    <p className="font-mono text-xs tracking-widest animate-pulse-glow" style={{ color: 'var(--neon-cyan)' }}>LOADING_NOTES...</p>
                </div>
            ) : notes.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {notes.map((note, idx) => (
                        <div
                            key={note._id}
                            className="break-inside-avoid cyber-card p-6 group animate-slide-up"
                            style={{ animationDelay: `${idx * 60}ms`, position: 'relative', paddingLeft: '20px' }}
                        >
                            {/* Color accent bar */}
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: note.color || 'var(--neon-purple)', opacity: 0.8 }} />

                            {/* Actions */}
                            <div className="flex justify-between items-start mb-4 gap-3">
                                <h2 className="font-mono text-base font-bold line-clamp-2 flex-1" style={{ color: 'var(--text-primary)' }}>
                                    {note.title}
                                </h2>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                                    <Link
                                        to={`/singleNote/${note._id}`}
                                        className="p-1.5 rounded-sm transition-all"
                                        style={{ color: 'var(--text-muted)', border: '1px solid transparent' }}
                                        onMouseOver={e => { e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
                                        onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <PencilSquareIcon className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="p-1.5 rounded-sm transition-all"
                                        style={{ color: 'var(--text-muted)', border: '1px solid transparent', background: 'none', cursor: 'pointer' }}
                                        onMouseOver={e => { e.currentTarget.style.color = 'var(--neon-pink)'; e.currentTarget.style.borderColor = 'rgba(255,59,139,0.3)'; e.currentTarget.style.background = 'rgba(255,59,139,0.06)'; }}
                                        onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content preview */}
                            <p className="font-mono text-xs line-clamp-5 leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                                {note.content}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(0,212,255,0.06)' }}>
                                <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                                    {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: note.color, boxShadow: `0 0 6px ${note.color}` }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24" style={{ border: '1px solid var(--border-dim)', background: 'var(--bg-card)' }}>
                    <div className="mb-4" style={{ color: 'var(--text-muted)' }}>
                        <svg className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <h3 className="font-mono text-lg font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>NO_NOTES_FOUND</h3>
                    <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>// start capturing your thoughts</p>
                    <Link to="/createNote" className="cyber-btn" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>
                        <PlusIcon className="h-4 w-4" /> CREATE_FIRST_NOTE
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Notes;
