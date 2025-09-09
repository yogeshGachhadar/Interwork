import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon, HomeIcon, PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 py-4 px-6 md:top-8">
            <div className="mx-auto max-w-5xl glass-card px-6 py-4 flex items-center justify-between border-white/40 shadow-2xl backdrop-blur-2xl">
                <Link className="flex items-center gap-3 group" to="/">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-all shadow-lg shadow-indigo-200">
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tighter text-slate-800 font-outfit">
                        Task<span className="text-indigo-600">Flow</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-2">
                    <Link className="nav-link" to="/">
                        <HomeIcon className="h-4 w-4" />
                        Dashboard
                    </Link>
                    {isLoggedIn && (
                        <>
                            <Link className="nav-link" to="/notes">
                                <DocumentTextIcon className="h-4 w-4" />
                                Notes
                            </Link>
                            <Link className="nav-link" to="/createTodo">
                                <PlusCircleIcon className="h-4 w-4" />
                                New Task
                            </Link>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 px-4 py-2" to="/register">
                                Join
                            </Link>
                            <Link className="premium-button !py-2.5 !text-sm" to="/login">
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 border-l border-slate-100 pl-3 ml-2">
                            <Link className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" to="/profile" title="Profile Settings">
                                <UserCircleIcon className="h-7 w-7" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <ArrowRightOnRectangleIcon className="h-7 w-7" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// Helper for the logo icon if not imported correctly
const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Navbar;
