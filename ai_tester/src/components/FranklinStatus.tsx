// src/components/FranklinStatus.tsx
import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { Cpu, Zap, Shield, Brain } from 'lucide-react';

const FranklinStatus: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchStatus = async () => {
    try {
      const response = await api.get('/franklin/status');
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch Franklin status:', error);
    }
  };
  
  if (!status) return null;
  
  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 mb-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="text-purple-400" size={20} />
          <h3 className="text-white font-semibold">Franklin Agent</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${status.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {status.status === 'online' ? '🟢 Smart Routing Active' : '🔴 Offline'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 bg-white/5 rounded">
          <Zap size={14} className="mx-auto mb-1 text-yellow-400" />
          <div className="text-gray-400">Eco Mode</div>
          <div className="text-white font-semibold">Speed Attacks</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded">
          <Cpu size={14} className="mx-auto mb-1 text-blue-400" />
          <div className="text-gray-400">Smart Mode</div>
          <div className="text-white font-semibold">Auto Routing</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded">
          <Shield size={14} className="mx-auto mb-1 text-purple-400" />
          <div className="text-gray-400">Premium Mode</div>
          <div className="text-white font-semibold">Logic/Contradiction</div>
        </div>
      </div>
      
      <div className="mt-3 text-center text-xs text-gray-500">
        Franklin Agent is using smart routing to optimize for your attack type
      </div>
    </div>
  );
};

export default FranklinStatus;