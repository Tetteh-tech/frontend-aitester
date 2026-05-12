// frontend/src/components/Leaderboard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Award, Star, Zap, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const Leaderboard: React.FC = () => {
  const [category, setCategory] = useState('overall');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', category],
    queryFn: async () => {
      const response = await api.get(`/leaderboard?category=${category}`);
      return response.data;
    },
    refetchInterval: 30000,
    enabled: !!localStorage.getItem('token')
  });

  const categories = [
    { value: 'overall', label: 'Overall Score', icon: Trophy },
    { value: 'success_rate', label: 'Success Rate', icon: TrendingUp },
    { value: 'logic', label: 'Logic Masters', icon: Target },
    { value: 'memory', label: 'Memory Breakers', icon: Zap },
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Medal className="text-amber-600" size={24} />;
      default: return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-500/50';
      case 2: return 'bg-gradient-to-r from-gray-600/20 to-gray-500/20 border-gray-500/50';
      case 3: return 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-600/50';
      default: return 'bg-white/5 border-white/10';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-red-400">Failed to load leaderboard. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-block"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Franklin Agent Breakers
          </h1>
          <p className="text-gray-400 mt-2">Top AI Breakers from around the world</p>
        </div>

        {/* Category Selector */}
        <div className="flex gap-3 justify-center flex-wrap">
          {categories.map(cat => (
            <motion.button
              key={cat.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${
                category === cat.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <cat.icon size={18} />
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl border border-purple-500/30 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Breaker</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-semibold">
                    {category === 'success_rate' ? 'Success Rate' : 'Score'}
                  </th>
                  <th className="px-6 py-4 text-right text-gray-300 font-semibold">Total Attacks</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-semibold">Breaks</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-semibold">Badges</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {data?.leaderboard?.map((user: any, index: number) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-purple-500/20 hover:bg-white/5 transition ${getRankColor(user.rank)}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{user.username || user.name}</div>
                          {user.rank <= 3 && (
                            <div className="text-xs text-yellow-400">
                              {user.rank === 1 ? '👑 Supreme Breaker' : user.rank === 2 ? '🥈 Elite Breaker' : '🥉 Skilled Breaker'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-2xl font-bold text-white">
                          {category === 'success_rate' ? `${user.success_rate?.toFixed(1)}%` : user.score}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">
                        {user.total_attacks}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-green-400 font-semibold">{user.successful_breaks}</div>
                        <div className="text-xs text-gray-500">
                          {user.total_attacks > 0 ? ((user.successful_breaks / user.total_attacks) * 100).toFixed(1) : 0}% rate
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 justify-center">
                          {user.badges?.slice(0, 3).map((badge: string, i: number) => (
                            <span key={i} className="text-xl" title={badge}>
                              {badge.includes('Logic') ? '🧠' : badge.includes('Memory') ? '💾' : badge.includes('Speed') ? '⚡' : '💥'}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Statistics Footer */}
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">{data.total_users}</div>
              <div className="text-gray-400 text-sm">Total Challengers</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">
                {data.leaderboard?.reduce((sum: number, user: any) => sum + (user.successful_breaks || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Total AI Breaks</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {data.leaderboard?.[0]?.score || 0}
              </div>
              <div className="text-gray-400 text-sm">Top Score</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;