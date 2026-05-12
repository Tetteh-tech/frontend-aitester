// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useStore from './store/useStore';
import ChatArena from './components/ChatArena';
import StressDashboard from './components/StressDashboard';
import Leaderboard from './components/Leaderboard';
import Analytics from './components/Analytics';
import Profile from './components/Profile';  // Make sure this is imported
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  const { setMetrics, addPrompt, setActiveUsers } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Poll for metrics instead of WebSockets
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/ai/metrics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, setMetrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '0.5rem',
            },
          }}
        />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <Navbar setIsAuthenticated={setIsAuthenticated} />
          <AnimatePresence mode="wait">
            <Routes>
              {/* IMPORTANT: Put more specific routes FIRST */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<StressDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/" element={<ChatArena />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '0.5rem',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;