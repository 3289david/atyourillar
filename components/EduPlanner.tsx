
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { PlannerTask } from '../types';

export const EduPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<PlannerTask[]>(() => {
    const saved = localStorage.getItem('eduPlannerTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('eduPlannerTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Card title="📝 스마트 학습 플래너" className="h-full flex flex-col">
      <div className="flex gap-2 mb-6">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="오늘의 학습 목표를 입력하세요..."
          className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-400 outline-none font-medium dark:text-white"
        />
        <button onClick={addTask} className="px-6 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-500 transition-all active:scale-95">+</button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm group"
            >
              <input 
                type="checkbox" 
                checked={task.done} 
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className={`flex-1 font-medium text-slate-700 dark:text-slate-200 ${task.done ? 'line-through opacity-40' : ''}`}>
                {task.text}
              </span>
              <button 
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity p-2"
              >
                ✕
              </button>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-10 text-slate-400 italic">오늘의 학습 계획이 비어있습니다.</div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
