import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HomeIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/outline';

const NavItem = ({ to, icon: Icon, label, isActive }) => (
    <Link
        to={to}
        className={`cyber-nav-link ${isActive ? 'active' : ''}`}
    >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{label}</span>
        {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
        )}
    </Link>
);

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className="w-64 fixed inset-y-0 left-0 flex flex-col z-40 hidden md:flex"
            style={{
                background: 'var(--bg-secondary)',
                borderRight: '1px solid rgba(0,212,255,0.08)',
            }}
        >
            {/* Logo */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="logo-glow p-2.5 rounded-sm">
                        <CheckCircleIcon className="h-5 w-5" style={{ color: 'var(--neon-cyan)' }} />
                    </div>
                    <div>
                        <span
                            className="font-mono text-lg font-bold tracking-wider block"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            TASK<span style={{ color: 'var(--neon-cyan)' }}>FLOW</span>
                        </span>
                        <span
                            className="font-mono text-[9px] tracking-widest uppercase"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            v2.0.0 // SYSTEM
                        </span>
                    </div>
                </Link>
            </div>

            {/* Status indicator */}
            <div className="px-6 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                    style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--neon-green)' }}>
                    SYS ONLINE
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <p className="section-header mb-4" style={{ fontSize: '9px', paddingLeft: '16px' }}>
                    Navigation
                </p>
                <NavItem to="/" icon={HomeIcon} label="Dashboard" isActive={isActive('/')} />
                <NavItem to="/notes" icon={DocumentTextIcon} label="Notes" isActive={isActive('/notes')} />
            </nav>

            {/* New Task CTA */}
            <div className="p-4" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                <Link to="/createTodo" className="cyber-btn cyber-btn-primary w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                    <PlusCircleIcon className="h-4 w-4" />
                    NEW TASK
                </Link>
            </div>
        </aside>
    );
};

const Topbar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const map = {
            '/': 'DASHBOARD',
            '/notes': 'NOTES',
            '/createTodo': 'CREATE_TASK',
            '/createNote': 'CREATE_NOTE',
            '/profile': 'PROFILE',
        };
        return map[location.pathname] || 'TASKFLOW';
    };

    return (
        <header
            className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 md:ml-64"
            style={{
                background: 'rgba(8,11,20,0.95)',
                borderBottom: '1px solid rgba(0,212,255,0.08)',
                backdropFilter: 'blur(20px)',
            }}
        >
            <div className="flex items-center gap-3">
                {/* Terminal-style breadcrumb */}
                <span className="font-mono text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                    ~/
                </span>
                <span className="font-mono text-sm font-bold tracking-wider neon-text-cyan hidden sm:block">
                    {getPageTitle()}
                </span>
                <span className="font-mono text-xs blink-cursor hidden sm:block" style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
                {user && (
                    <span
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 font-mono text-xs"
                        style={{
                            background: 'rgba(0,212,255,0.05)',
                            border: '1px solid rgba(0,212,255,0.1)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <span style={{ color: 'var(--neon-cyan)' }}>@</span>
                        {user?.username || 'user'}
                    </span>
                )}
                <Link
                    to="/profile"
                    className="p-2 transition-all rounded-sm"
                    style={{ color: 'var(--text-muted)' }}
                    title="Profile"
                    onMouseOver={e => { e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                    <UserCircleIcon className="h-5 w-5" />
                </Link>
                <button
                    onClick={logout}
                    className="p-2 transition-all rounded-sm"
                    style={{ color: 'var(--text-muted)' }}
                    title="Sign Out"
                    onMouseOver={e => { e.currentTarget.style.color = 'var(--neon-pink)'; e.currentTarget.style.background = 'rgba(255,59,139,0.06)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        return children;
    }

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 min-w-0">
                <Topbar />
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div
                className="md:hidden fixed bottom-0 inset-x-0 flex justify-around p-3 z-50"
                style={{
                    background: 'rgba(13,17,23,0.97)',
                    borderTop: '1px solid rgba(0,212,255,0.12)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <Link className="p-2 transition-all" style={{ color: 'var(--text-muted)' }} to="/"
                    onMouseOver={e => e.currentTarget.style.color = 'var(--neon-cyan)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <HomeIcon className="h-6 w-6" />
                </Link>
                <Link to="/createTodo" className="p-2">
                    <div
                        className="p-2.5 rounded-sm -mt-5"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(184,67,255,0.15))',
                            border: '1px solid var(--neon-cyan)',
                            boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                            color: 'var(--neon-cyan)',
                        }}
                    >
                        <PlusCircleIcon className="h-6 w-6" />
                    </div>
                </Link>
                <Link className="p-2 transition-all" style={{ color: 'var(--text-muted)' }} to="/notes"
                    onMouseOver={e => e.currentTarget.style.color = 'var(--neon-cyan)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <DocumentTextIcon className="h-6 w-6" />
                </Link>
            </div>
        </div>
    );
};

const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Layout;
