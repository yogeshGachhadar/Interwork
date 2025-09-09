import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { APIAuthenticated } from '../http';

const SingleTodo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [singleTodo, setSingleTodo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatedTodo, setUpdatedTodo] = useState({ title: '', description: '', status: '', priority: '', dueDate: '', category: '' });

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await APIAuthenticated.get(`/api/todo/${id}`);
                setSingleTodo(res.data.data);
                setUpdatedTodo({
                    title: res.data.data.title,
                    description: res.data.data.description,
                    status: res.data.data.status,
                    priority: res.data.data.priority,
                    dueDate: res.data.data.dueDate ? res.data.data.dueDate.split('T')[0] : '',
                    category: res.data.data.category
                });
            } catch { console.error('Error fetching todo'); }
            finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this task?')) return;
        try { await APIAuthenticated.delete(`/api/todo/delete/${id}`); navigate('/'); }
        catch { alert('Failed to delete todo'); }
    };

    const handleUpdate = async () => {
        try {
            const res = await APIAuthenticated.patch(`/api/todo/update/${id}`, updatedTodo);
            setSingleTodo(res.data.data);
            setEditMode(false);
        } catch { alert('Failed to update todo'); }
    };

    const handleChange = (e) => setUpdatedTodo({ ...updatedTodo, [e.target.name]: e.target.value });

    const priorityColor = (p) => ({ high: 'var(--neon-pink)', medium: '#ff9f43', low: 'var(--neon-cyan)' }[p] || 'var(--text-muted)');

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="cyber-spinner" />
            <p className="font-mono text-xs tracking-widest animate-pulse-glow" style={{ color: 'var(--neon-cyan)' }}>LOADING...</p>
        </div>
    );

    if (!singleTodo) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <p className="font-mono text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>TASK_NOT_FOUND</p>
            <button onClick={() => navigate('/')} className="cyber-btn cyber-btn-primary">← GO_HOME</button>
        </div>
    );

    return (
        <div className="pb-20">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-widest group" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span style={{ color: 'var(--neon-cyan)' }}>← BACK_TO_LIST</span>
            </button>

            <div className="max-w-3xl" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.12)', position: 'relative' }}>
                {/* Top accent */}
                <div style={{ height: '2px', background: singleTodo.status === 'completed' ? 'linear-gradient(90deg, var(--neon-green), transparent)' : 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))' }} />

                <div className="p-8 md:p-10">
                    {editMode ? (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="font-mono text-xl font-bold neon-text-cyan">EDIT_TASK</h1>
                                <button onClick={() => setEditMode(false)} className="font-mono text-xs" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ CANCEL</button>
                            </div>

                            <div>
                                <label className="block mb-2 font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// TITLE</label>
                                <input name="title" className="cyber-input font-mono text-lg font-bold" value={updatedTodo.title} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block mb-2 font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// DESCRIPTION</label>
                                <textarea name="description" className="cyber-input font-mono resize-none" style={{ minHeight: '120px' }} value={updatedTodo.description} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'priority', label: 'PRIORITY', opts: ['low', 'medium', 'high'] },
                                    { name: 'status', label: 'STATUS', opts: ['pending', 'completed'] },
                                    { name: 'category', label: 'CATEGORY', opts: ['General', 'Work', 'Personal', 'Shopping', 'Health'] },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="block mb-2 font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// {f.label}</label>
                                        <select name={f.name} className="cyber-input font-mono" value={updatedTodo[f.name]} onChange={handleChange}>
                                            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                ))}
                                <div>
                                    <label className="block mb-2 font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// DUE_DATE</label>
                                    <input type="date" name="dueDate" className="cyber-input font-mono" value={updatedTodo.dueDate} onChange={handleChange} style={{ colorScheme: 'dark' }} />
                                </div>
                            </div>
                            <div className="cyber-divider" />
                            <div className="flex gap-4">
                                <button onClick={handleUpdate} className="cyber-btn cyber-btn-primary flex-1">✓ SAVE_CHANGES</button>
                                <button onClick={() => setEditMode(false)} className="cyber-btn flex-1" style={{ borderColor: 'rgba(0,212,255,0.2)', color: 'var(--text-secondary)' }}>CANCEL</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className={`cyber-badge ${singleTodo.status === 'completed' ? 'badge-completed' : 'badge-pending'}`}>{singleTodo.status}</span>
                                <span className={`cyber-badge ${singleTodo.priority === 'high' ? 'badge-high' : singleTodo.priority === 'medium' ? 'badge-medium' : 'badge-low'}`}>
                                    PRIO: {singleTodo.priority}
                                </span>
                                <span className="cyber-badge" style={{ background: 'rgba(0,212,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(0,212,255,0.1)' }}>
                                    #{singleTodo.category || 'General'}
                                </span>
                                {singleTodo.dueDate && (
                                    <span className="cyber-badge" style={{ background: 'rgba(255,59,139,0.08)', color: 'var(--neon-pink)', border: '1px solid rgba(255,59,139,0.2)' }}>
                                        DUE: {new Date(singleTodo.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {/* Title + actions */}
                            <div className="flex justify-between items-start gap-6 mb-8">
                                <h1 className={`font-mono text-3xl font-bold flex-1 ${singleTodo.status === 'completed' ? 'line-through' : ''}`}
                                    style={{ color: singleTodo.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                    {singleTodo.title}
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

                            {/* Description */}
                            <div className="p-6 mb-8" style={{ background: 'rgba(0,212,255,0.02)', border: '1px solid rgba(0,212,255,0.06)', borderLeft: '2px solid rgba(0,212,255,0.2)' }}>
                                <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                                    {singleTodo.description}
                                </p>
                            </div>

                            {/* Complete button */}
                            {singleTodo.status !== 'completed' && (
                                <button
                                    onClick={() => { setUpdatedTodo({ ...updatedTodo, status: 'completed' }); handleUpdate(); }}
                                    className="cyber-btn cyber-btn-success w-full py-4"
                                >
                                    <CheckCircleIcon className="h-5 w-5" /> MARK_COMPLETE
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleTodo;
