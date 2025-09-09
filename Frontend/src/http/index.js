import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/';

// Without login
const API = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Authenticated user
const APIAuthenticated = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

APIAuthenticated.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export { API, APIAuthenticated };