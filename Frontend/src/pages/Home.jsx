import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APIAuthenticated } from '../http';
import { MagnifyingGlassIcon, PlusIcon, CheckCircleIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');

    const fetchTodos = async () => {
        try {
            setLoading(true);
            let endpoint = '/api/todo/getAll';
            if (searchQuery) {
                endpoint = `/api/todo/all/search?query=${searchQuery}`;
            } else {
                const params = new URLSearchParams();
                if (statusFilter) params.append('status', statusFilter);
                if (priorityFilter) params.append('priority', priorityFilter);
                if (sortBy) params.append('sortBy', sortBy);
                const qs = params.toString();
                if (qs) endpoint += `?${qs}`;
            }
            const response = await APIAuthenticated.get(endpoint);
            setTodos(response.data.data);
        } catch (err) {
            console.error('Error fetching todos', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => fetchTodos(), 300);
        return () => clearTimeout(delay);
    }, [searchQuery, statusFilter, priorityFilter, sortBy]);

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
            await APIAuthenticated.patch(`/api/todo/update/${id}`, { status: newStatus });
            setTodos(todos.map(t => t._id === id ? { ...t, status: newStatus } : t));
        } catch {
            alert('Failed to update status');
        }
    };

    const completed = todos.filter(t => t.status === 'completed').length;
    const pending = todos.filter(t => t.status === 'pending').length;
    const completionRate = todos.length ? Math.round((completed / todos.length) * 100) : 0;

    return (
        <div className="min-h-screen pb-20">
            {/* Page Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="section-header mb-3">SYSTEM // TASKS</p>
                    <h1 className="font-mono text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        DAILY<span className="neon-text-cyan">_</span>FOCUS
                    </h1>
                    <p className="font-mono text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                        // {todos.length} task(s) loaded · {completionRate}% complete
                    </p>
                </div>
                <Link to="/createTodo" className="cyber-btn cyber-btn-primary self-start md:self-auto">
                    <PlusIcon className="h-4 w-4" />
                    NEW_TASK
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="stat-card cyan">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-sm" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                            <ChartBarIcon className="h-6 w-6" style={{ color: 'var(--neon-cyan)' }} />
                        </div>
                        <div>
                            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>TOTAL</p>
                            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--neon-cyan)', textShadow: '0 0 10px rgba(0,212,255,0.4)' }}>
                                {String(todos.length).padStart(2, '0')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-sm" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
                            <ClockIcon className="h-6 w-6" style={{ color: 'var(--neon-yellow)' }} />
                        </div>
                        <div>
                            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>PENDING</p>
                            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--neon-yellow)', textShadow: '0 0 10px rgba(255,215,0,0.4)' }}>
                                {String(pending).padStart(2, '0')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-sm" style={{ background: 'rgba(0,255,170,0.06)', border: '1px solid rgba(0,255,170,0.15)' }}>
                            <CheckCircleIcon className="h-6 w-6" style={{ color: 'var(--neon-green)' }} />
                        </div>
                        <div>
                            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>DONE</p>
                            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--neon-green)', textShadow: '0 0 10px rgba(0,255,170,0.4)' }}>
                                {String(completed).padStart(2, '0')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            {todos.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>COMPLETION_RATE</span>
                        <span className="font-mono text-xs font-bold" style={{ color: 'var(--neon-cyan)' }}>{completionRate}%</span>
                    </div>
                    <div className="h-1 rounded-sm" style={{ background: 'rgba(0,212,255,0.1)' }}>
                        <div
                            className="h-full rounded-sm transition-all duration-700"
                            style={{
                                width: `${completionRate}%`,
                                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
                                boxShadow: '0 0 8px rgba(0,212,255,0.4)',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <div className="cyber-field-icon">
                        <MagnifyingGlassIcon className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="search_tasks..."
                        className="cyber-input cyber-input--icon font-mono"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="cyber-input py-2 text-sm font-mono" style={{ width: 'auto', minWidth: '120px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">ALL_STATUS</option>
                        <option value="pending">PENDING</option>
                        <option value="completed">DONE</option>
                    </select>
                    <select className="cyber-input py-2 text-sm font-mono" style={{ width: 'auto', minWidth: '120px' }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                        <option value="">ALL_PRIO</option>
                        <option value="low">LOW</option>
                        <option value="medium">MED</option>
                        <option value="high">HIGH</option>
                    </select>
                    <select className="cyber-input py-2 text-sm font-mono" style={{ width: 'auto', minWidth: '110px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="createdAt">NEWEST</option>
                        <option value="dueDate">DUE_DATE</option>
                        <option value="priority">PRIORITY</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="cyber-spinner" />
                    <p className="font-mono text-xs tracking-widest animate-pulse-glow" style={{ color: 'var(--neon-cyan)' }}>
                        LOADING_TASKS...
                    </p>
                </div>
            ) : todos.length > 0 ? (
                <div className="space-y-3">
                    {todos.map((todo, idx) => (
                        <div
                            key={todo._id}
                            className="cyber-card flex items-center gap-4 p-5 group animate-slide-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* Status toggle */}
                            <button
                                onClick={() => toggleStatus(todo._id, todo.status)}
                                className="flex-shrink-0 p-2 rounded-sm transition-all"
                                style={{
                                    background: todo.status === 'completed' ? 'rgba(0,255,170,0.08)' : 'rgba(0,212,255,0.05)',
                                    border: `1px solid ${todo.status === 'completed' ? 'rgba(0,255,170,0.3)' : 'rgba(0,212,255,0.15)'}`,
                                    color: todo.status === 'completed' ? 'var(--neon-green)' : 'var(--text-muted)',
                                }}
                                title={todo.status === 'completed' ? 'Mark pending' : 'Mark complete'}
                            >
                                {todo.status === 'completed'
                                    ? <CheckCircleIcon className="h-5 w-5" />
                                    : <ClockIcon className="h-5 w-5" />
                                }
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <Link to={`/singleTodo/${todo._id}`} className="block">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <h2
                                            className={`font-mono text-base font-bold truncate transition-colors group-hover:text-[var(--neon-cyan)] ${todo.status === 'completed' ? 'line-through' : ''}`}
                                            style={{ color: todo.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}
                                        >
                                            {todo.title}
                                        </h2>
                                        <span className={`cyber-badge ${todo.status === 'completed' ? 'badge-completed' : 'badge-pending'}`}>
                                            {todo.status}
                                        </span>
                                        <span className={`cyber-badge ${todo.priority === 'high' ? 'badge-high' : todo.priority === 'medium' ? 'badge-medium' : 'badge-low'}`}>
                                            {todo.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-mono text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                                            {todo.description}
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Meta */}
                            <div className="flex-shrink-0 text-right hidden sm:block">
                                {todo.dueDate && (
                                    <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--neon-pink)' }}>
                                        DUE {new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                )}
                                <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                    #{todo.category || 'General'}
                                </p>
                            </div>

                            {/* Arrow indicator */}
                            <Link to={`/singleTodo/${todo._id}`} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" style={{ color: 'var(--neon-cyan)' }}>
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className="text-center py-24"
                    style={{ border: '1px solid var(--border-dim)', background: 'var(--bg-card)' }}
                >
                    <div className="mb-4" style={{ color: 'var(--text-muted)' }}>
                        <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="font-mono text-lg font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                        NO_TASKS_FOUND
                    </h3>
                    <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                        // initialize your task list
                    </p>
                    <Link to="/createTodo" className="cyber-btn cyber-btn-primary">
                        <PlusIcon className="h-4 w-4" /> CREATE_FIRST_TASK
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
