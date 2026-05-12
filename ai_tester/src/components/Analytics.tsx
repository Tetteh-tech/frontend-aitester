// frontend/src/components/Analytics.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Clock, AlertCircle, Calendar, Download, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await api.get(`/analytics?range=${timeRange}`);
      return response.data;
    },
    refetchInterval: 60000,
    enabled: !!localStorage.getItem('token')
  });

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
          <Icon className="text-white" size={24} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">Failed to load analytics data</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              Franklin Agent Analytics
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
            trend={12}
          />
          <StatCard
            title="Success Rate"
            value={`${data?.success_rate || 0}%`}
            icon={TrendingUp}
            trend={-3}
          />
          <StatCard
            title="Avg Response Time"
            value={`${(data?.avg_response_time || 0).toFixed(2)}s`}
            icon={Clock}
            trend={-8}
          />
          <StatCard
            title="Active Users"
            value={data?.active_users || 0}
            icon={Calendar}
            trend={15}
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
            <h3 className="text-white font-semibold mb-4">Agent Performance</h3>
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
                <Bar dataKey="confidence" fill="#ec4899" name="Confidence (%)" />
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
            {data?.top_attackers?.length > 0 ? (
              data.top_attackers.map((attacker: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{attacker.username}</div>
                      <div className="text-xs text-gray-400">{attacker.attack_count || 0} attacks</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{attacker.success_rate || 0}%</div>
                    <div className="text-xs text-gray-400">success rate</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No attack data available</div>
            )}
          </div>
        </motion.div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={() => window.open('/api/analytics/export', '_blank')}
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