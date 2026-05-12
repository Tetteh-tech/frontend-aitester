// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, Trophy, BarChart3, LogOut, User, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

interface NavbarProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  
  const navItems = [
    { path: '/', label: 'Challenge', icon: MessageCircle },
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/user/stats');
          setUserScore(response.data.user?.score || 0);
        }
      } catch (error) {
        console.error('Failed to fetch user score:', error);
      }
    };
    
    fetchUserScore();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/logout');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black/95 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl text-white">
              BreakFranklin
            </span>
            <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full hidden md:inline-block">
              Beta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {userScore !== null && (
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <span className="text-sm font-semibold text-white">{userScore}</span>
                <span className="text-xs text-gray-400">pts</span>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;