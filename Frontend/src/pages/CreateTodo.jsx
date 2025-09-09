import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIAuthenticated } from '../http';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreateToDo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [todoData, setTodoData] = useState({
    title: '', description: '', priority: 'medium', category: 'General', dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({ ...todoData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await APIAuthenticated.post('/api/todo/create', todoData);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating todo.');
    } finally {
      setLoading(false);
    }
  };

  const priorities = [
    { key: 'low', label: '◇ LOW', color: 'var(--neon-cyan)', border: 'rgba(0,212,255,0.4)', bg: 'rgba(0,212,255,0.08)' },
    { key: 'medium', label: '◆ MED', color: '#ff9f43', border: 'rgba(255,165,0,0.4)', bg: 'rgba(255,165,0,0.08)' },
    { key: 'high', label: '⚠ HIGH', color: 'var(--neon-pink)', border: 'rgba(255,59,139,0.4)', bg: 'rgba(255,59,139,0.08)' },
  ];

  return (
    <div className="pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-widest transition-all group" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span style={{ color: 'var(--neon-cyan)' }}>← BACK</span>
      </button>

      <div className="mb-8">
        <p className="section-header mb-3">SYSTEM // CREATE</p>
        <h1 className="font-mono text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          NEW<span className="neon-text-cyan">_</span>TASK
        </h1>
        <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-muted)' }}>// define task parameters</p>
      </div>

      <div className="max-w-2xl" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.12)', borderTop: '2px solid var(--neon-cyan)', padding: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '20px', height: '20px', borderBottom: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)' }} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// TASK_TITLE *</label>
            <input type="text" id="title" name="title" value={todoData.title} onChange={handleChange} placeholder="what needs to be done?" required className="cyber-input font-mono" />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// DESCRIPTION *</label>
            <textarea id="description" name="description" value={todoData.description} onChange={handleChange} placeholder="add details..." required rows={4} className="cyber-input font-mono resize-none" />
          </div>

          <div>
            <label className="block mb-3 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// PRIORITY_LEVEL</label>
            <div className="flex gap-3">
              {priorities.map(p => {
                const sel = todoData.priority === p.key;
                return (
                  <button key={p.key} type="button" onClick={() => setTodoData({ ...todoData, priority: p.key })}
                    className="flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all"
                    style={{ border: `1px solid ${sel ? p.border : 'rgba(0,212,255,0.1)'}`, background: sel ? p.bg : 'transparent', color: sel ? p.color : 'var(--text-muted)', boxShadow: sel ? `0 0 12px ${p.border}` : 'none', cursor: 'pointer' }}>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// CATEGORY</label>
              <select id="category" name="category" value={todoData.category} onChange={handleChange} className="cyber-input font-mono">
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block mb-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>// DUE_DATE</label>
              <input type="date" id="dueDate" name="dueDate" value={todoData.dueDate} onChange={handleChange} className="cyber-input font-mono" style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          <div className="cyber-divider" />

          <button type="submit" disabled={loading} className="cyber-btn cyber-btn-primary w-full py-4">
            {loading ? (
              <span className="cyber-btn-inner">
                <div className="cyber-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                CREATING_TASK...
              </span>
            ) : '+ DEPLOY_TASK'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateToDo;
