// frontend/src/components/StressDashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Cpu, Zap, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Server, Database, Wifi } from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';
import api from '../config/api';
import { useQuery } from '@tanstack/react-query';

const StressDashboard: React.FC = () => {
  const { metrics, setMetrics } = useStore();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  
  const { data: agentStats } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const response = await api.get('/api/ai/metrics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    },
    refetchInterval: 5000
  });

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      const now = new Date();
      const newData = {
        time: now.toLocaleTimeString(),
        responseTime: Math.random() * 2 + 0.5,
        confidence: Math.random() * 0.5 + 0.3,
        load: Math.random() * 100,
        queue: Math.floor(Math.random() * 50)
      };
      
      setRealtimeData(prev => [...prev.slice(-19), newData]);
      setMetrics(newData);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const agentPerformance = [
    { name: 'Logic', stress: 45, confidence: 0.78, load: 60, color: '#8b5cf6' },
    { name: 'Memory', stress: 62, confidence: 0.65, load: 75, color: '#ec4899' },
    { name: 'Creativity', stress: 38, confidence: 0.82, load: 45, color: '#06b6d4' },
    { name: 'Speed', stress: 71, confidence: 0.54, load: 85, color: '#f59e0b' },
    { name: 'Security', stress: 29, confidence: 0.88, load: 35, color: '#10b981' },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Stress Monitor
            </h1>
            <p className="text-gray-400 mt-1">Real-time system metrics and agent performance</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            <Wifi size={14} />
            <span>Live Updates</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Sessions"
            value={agentStats?.active_sessions || 0}
            icon={Activity}
            trend={12}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Queue Length"
            value={agentStats?.queue_length || 0}
            icon={Database}
            trend={-5}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="System Load"
            value={`${(agentStats?.system_load || 0).toFixed(1)}%`}
            icon={Cpu}
            trend={8}
            color="from-red-500 to-orange-500"
          />
          <StatCard
            title="Avg Response"
            value={`${(agentStats?.avg_response_time || 0).toFixed(2)}s`}
            icon={Zap}
            trend={-3}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-purple-400" />
              Response Time Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <defs>
                  <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="responseTime" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorResponse)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Agent Stress Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-400" />
              Agent Stress Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="stress"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {agentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Agent Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Server size={18} className="text-purple-400" />
            Agent Performance Metrics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-3 text-gray-400 font-medium">Agent</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Stress Level</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Confidence</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Current Load</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent, idx) => (
                  <tr key={idx} className="border-b border-purple-500/20 hover:bg-white/5 transition">
                    <td className="py-3 text-white">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-[${agent.color}]`} />
                        {agent.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.stress}%` }}
                            className={`h-full rounded-full ${agent.stress > 70 ? 'bg-red-500' : agent.stress > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          />
                        </div>
                        <span className="text-sm text-gray-300">{agent.stress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.confidence * 100}%` }}
                            className="h-full rounded-full bg-purple-500"
                          />
                        </div>
                        <span className="text-sm text-gray-300">{(agent.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.load}%` }}
                            className="h-full rounded-full bg-cyan-500"
                          />
                        </div>
                        <span className="text-sm text-gray-300">{agent.load}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.stress > 70 ? 'bg-red-500/20 text-red-400' :
                        agent.stress > 40 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {agent.stress > 70 ? 'Critical' : agent.stress > 40 ? 'Stressed' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Live Alert Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-yellow-400" />
            Live Alert Feed
          </h3>
          <div className="space-y-2">
            {agentStats?.agent_stats && Object.entries(agentStats.agent_stats).map(([name, stats]: [string, any]) => (
              stats.stress > 70 && (
                <div key={name} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3">
                  <AlertTriangle className="text-red-400" size={20} />
                  <div>
                    <div className="text-white font-medium">{name} Stress Critical</div>
                    <div className="text-sm text-gray-400">Stress level at {stats.stress}% - Performance degrading</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StressDashboard;