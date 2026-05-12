// frontend/src/store/useStore.ts
import { create } from 'zustand';

interface Metric {
  active_sessions?: number;
  queue_length?: number;
  system_load?: number;
  avg_response_time?: number;
  [key: string]: any;
}

interface Prompt {
  id: string;
  content: string;
  user: string;
  timestamp: Date;
}

interface Store {
  metrics: Metric;
  activeUsers: number;
  queueLength: number;
  prompts: Prompt[];
  stressEvents: any[];
  setMetrics: (metrics: Metric) => void;
  setActiveUsers: (count: number) => void;
  addPrompt: (prompt: Prompt) => void;
  addStressEvent: (event: any) => void;
  clearPrompts: () => void;
}

const useStore = create<Store>((set) => ({
  metrics: {},
  activeUsers: 0,
  queueLength: 0,
  prompts: [],
  stressEvents: [],
  
  setMetrics: (metrics) => set((state) => ({ 
    metrics: { ...state.metrics, ...metrics } 
  })),
  
  setActiveUsers: (count) => set({ activeUsers: count }),
  
  addPrompt: (prompt) => set((state) => ({ 
    prompts: [prompt, ...state.prompts].slice(0, 100) 
  })),
  
  addStressEvent: (event) => set((state) => ({ 
    stressEvents: [event, ...state.stressEvents].slice(0, 50) 
  })),
  
  clearPrompts: () => set({ prompts: [] }),
}));

export default useStore;