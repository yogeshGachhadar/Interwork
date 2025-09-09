import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateToDo from './pages/CreateTodo';
import Profile from './pages/Profile';
import SingleTodo from './pages/SingleTodo';
import Notes from './pages/Notes';
import CreateNote from './pages/CreateNote';
import SingleNote from './pages/SingleNote';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { token } = useAuth();
    if (token) return <Navigate to="/" replace />;
    return children;
};

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/createTodo" element={<ProtectedRoute><CreateToDo /></ProtectedRoute>} />
                    <Route path="/singleTodo/:id" element={<ProtectedRoute><SingleTodo /></ProtectedRoute>} />
                    <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                    <Route path="/createNote" element={<ProtectedRoute><CreateNote /></ProtectedRoute>} />
                    <Route path="/singleNote/:id" element={<ProtectedRoute><SingleNote /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
