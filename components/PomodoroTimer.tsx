
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';

interface PomodoroProps {
  onComplete: (type: 'focus' | 'break') => void;
}

export const PomodoroTimer: React.FC<PomodoroProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    onComplete(mode);
    if (mode === 'focus') {
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <Card title="⏱️ 몰입 포모도로" className="flex flex-col items-center text-center">
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
          <motion.circle
            cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray="552.92"
            animate={{ strokeDashoffset: 552.92 * (1 - progress / 100) }}
            className={mode === 'focus' ? 'text-purple-600' : 'text-emerald-500'}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800 dark:text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'focus' ? 'text-purple-500' : 'text-emerald-500'}`}>
            {mode === 'focus' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 ${isActive ? 'bg-rose-500' : 'bg-purple-600'}`}
        >
          {isActive ? '일시 정지' : '시작'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black transition-all hover:bg-slate-200"
        >
          초기화
        </button>
      </div>
      <p className="mt-4 text-[10px] text-slate-400 font-bold">25분 몰입 완료 시 보상이 지급됩니다!</p>
    </Card>
  );
};
