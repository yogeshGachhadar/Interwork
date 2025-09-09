import React, { createContext, useContext, useState, useEffect } from 'react';
import { APIAuthenticated } from '../http';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Optionally, fetch user profile to verify token
            const fetchProfile = async () => {
                try {
                    const response = await APIAuthenticated.get('/api/profile');
                    setUser(response.data.data); // Adjust according to your backend response structure
                } catch (error) {
                    console.error("Token verification failed", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
