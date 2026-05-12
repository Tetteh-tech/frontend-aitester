// frontend/src/components/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Clock, AlertCircle, Calendar, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await axios.get(`/api/analytics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    },
    refetchInterval: 60000
  });

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

  const StatCard = ({ title, value, change, icon: Icon }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
          <Icon className="text-white" size={24} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp size={16} className={change < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Comprehensive system insights and performance metrics</p>
          </div>
          <div className="flex gap-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {range.label}
              </button>
            ))}
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <RefreshCw size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Requests"
            value={data?.total_requests?.toLocaleString() || '0'}
            icon={Target}
            change={12}
          />
          <StatCard
            title="Success Rate"
            value={`${data?.success_rate || 0}%`}
            icon={TrendingUp}
            change={-3}
          />
          <StatCard
            title="Avg Response Time"
            value={`${data?.avg_response_time || 0}s`}
            icon={Clock}
            change={-8}
          />
          <StatCard
            title="Active Users"
            value={data?.active_users || 0}
            icon={Calendar}
            change={15}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4">Request Volume Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.request_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attack Type Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4">Attack Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.attack_distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data?.attack_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Response Time by Agent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4">Response Time by Agent</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.agent_performance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="agent" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6' }}
                />
                <Legend />
                <Bar dataKey="response_time" fill="#8b5cf6" name="Response Time (s)" />
                <Bar dataKey="confidence" fill="#ec4899" name="Confidence" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Success Rate Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4">Success Rate Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.success_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Attackers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <h3 className="text-white font-semibold mb-4">Top Attackers This Period</h3>
          <div className="space-y-3">
            {data?.top_attackers?.map((attacker: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{attacker.username}</div>
                    <div className="text-xs text-gray-400">{attacker.attack_count} attacks</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">{attacker.success_rate}%</div>
                  <div className="text-xs text-gray-400">success rate</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={() => window.location.href = '/api/analytics/export'}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition"
          >
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;