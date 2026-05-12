// frontend/src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, Trophy, BarChart3, LogOut, User, Zap, Brain, Menu, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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

  // Fetch user score for display
  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/user/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserScore(response.data.user?.score || 0);
        }
      } catch (error) {
        console.error('Failed to fetch user score:', error);
      }
    };
    
    fetchUserScore();
  }, [location.pathname]); // Refetch when navigating

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
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
      className="bg-black/50 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className="text-purple-400 group-hover:text-purple-300 transition-colors" size={24} />
              <div className="absolute inset-0 bg-purple-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BreakFranklin
            </span>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full hidden md:inline-block">
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
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Score Display */}
            {userScore !== null && (
              <div className="hidden md:flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/30">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">{userScore}</span>
                <span className="text-xs text-gray-400">pts</span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>

            {/* Logout Button (Desktop) */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-purple-500/30"
          >
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
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