// frontend/src/components/Profile.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Trophy, Zap, Brain, Target, Shield, Clock, 
  Calendar, Award, BarChart3, TrendingUp, Medal,
  Settings, LogOut, Edit2, Copy, Check
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserStats {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    score: number;
    rank: number;
    total_attacks: number;
    successful_breaks: number;
    success_rate: number;
    badges: string[];
  };
  recent_attacks: Array<{
    id: number;
    content: string;
    type: string;
    success: boolean;
    created_at: string;
  }>;
  achievements: Array<{
    name: string;
    icon: string;
    earned: boolean;
  }>;
}

const Profile: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'badges'>('stats');
  const queryClient = useQueryClient();

  // Fetch user stats
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axios.get('/api/user/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data as UserStats;
    }
  });

  // Copy referral link
  const copyReferralLink = () => {
    const link = `https://franklin-agent.com/ref/${userData?.user.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Referral link copied!');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const { user, recent_attacks, achievements } = userData || {};

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 mb-6 border border-purple-500/30"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-1">{user?.name}</h1>
            <p className="text-purple-400 mb-2">@{user?.username}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>

          {/* Stats Quick View */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user?.rank || '-'}</div>
              <div className="text-xs text-gray-400">Global Rank</div>
            </div>
            <div className="w-px h-10 bg-purple-500/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{user?.score || 0}</div>
              <div className="text-xs text-gray-400">Total Score</div>
            </div>
            <div className="w-px h-10 bg-purple-500/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{user?.success_rate || 0}%</div>
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Brain className="text-purple-400" size={20} />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">{user?.total_attacks || 0}</div>
          <div className="text-xs text-gray-400">Attacks Launched</div>
        </div>

        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="text-yellow-400" size={20} />
            <span className="text-xs text-gray-400">Successful</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{user?.successful_breaks || 0}</div>
          <div className="text-xs text-gray-400">AI Breaks</div>
        </div>

        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-blue-400" size={20} />
            <span className="text-xs text-gray-400">Conversion</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{user?.success_rate || 0}%</div>
          <div className="text-xs text-gray-400">Break Rate</div>
        </div>

        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Shield className="text-cyan-400" size={20} />
            <span className="text-xs text-gray-400">Badges</span>
          </div>
          <div className="text-2xl font-bold text-white">{user?.badges?.length || 0}</div>
          <div className="text-xs text-gray-400">Achievements</div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-purple-500/30">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'stats'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <BarChart3 size={16} className="inline mr-2" />
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'history'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Clock size={16} className="inline mr-2" />
          Attack History
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'badges'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Award size={16} className="inline mr-2" />
          Badges & Achievements
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'stats' && (
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-gray-400">Total Attacks</span>
                <span className="text-white font-semibold">{user?.total_attacks || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-gray-400">Successful Breaks</span>
                <span className="text-green-400 font-semibold">{user?.successful_breaks || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-gray-400">Total Score</span>
                <span className="text-yellow-400 font-semibold">{user?.score || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-gray-400">Global Rank</span>
                <span className="text-purple-400 font-semibold">#{user?.rank || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-gray-400">Success Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${user?.success_rate || 0}%` }}
                    />
                  </div>
                  <span className="text-white">{user?.success_rate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Attacks</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recent_attacks?.map((attack, idx) => (
                <div key={idx} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {attack.success ? (
                        <Trophy size={14} className="text-green-400" />
                      ) : (
                        <Target size={14} className="text-red-400" />
                      )}
                      <span className="text-sm font-medium text-white capitalize">{attack.type} Attack</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(attack.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{attack.content}</p>
                  <div className="mt-2">
                    {attack.success ? (
                      <span className="text-xs text-green-400">✓ Break Successful</span>
                    ) : (
                      <span className="text-xs text-red-400">✗ Failed to Break</span>
                    )}
                  </div>
                </div>
              ))}
              {(!recent_attacks || recent_attacks.length === 0) && (
                <p className="text-center text-gray-500 py-8">No attacks recorded yet. Start challenging Franklin Agent!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Achievements & Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements?.map((badge, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl text-center transition-all ${
                    badge.earned 
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                      : 'bg-white/5 border border-white/10 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="text-sm font-medium text-white">{badge.name}</div>
                  {!badge.earned && (
                    <div className="text-xs text-gray-500 mt-1">Locked</div>
                  )}
                </div>
              ))}
              {(!achievements || achievements.length === 0) && (
                <p className="text-center text-gray-500 py-8 col-span-3">No badges earned yet. Break some AI to earn badges!</p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Referral Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl p-4 border border-purple-500/30"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Invite Friends</h4>
            <p className="text-xs text-gray-400">Share your referral link and earn bonus points!</p>
          </div>
          <div className="flex gap-2">
            <code className="px-3 py-1 bg-black/50 rounded-lg text-xs text-purple-400">
              franklin-agent.com/ref/{user?.username}
            </code>
            <button
              onClick={copyReferralLink}
              className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-purple-400" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;