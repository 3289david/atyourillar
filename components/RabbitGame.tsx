
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from './Card';
import { RABBIT_STAGES } from '../constants';
import { RabbitState } from '../types';

export const RabbitGame: React.FC = () => {
  const [rabbit, setRabbit] = useState<RabbitState>(() => {
    const saved = localStorage.getItem('rabbitState');
    return saved ? JSON.parse(saved) : {
      level: 0,
      exp: 0,
      maxExp: 10,
      energy: 100,
      happiness: 80,
      intelligence: 10,
      stageName: RABBIT_STAGES[0].name,
      emoji: RABBIT_STAGES[0].emoji
    };
  });

  const [message, setMessage] = useState("지식의 알이 따뜻한 관심을 기다립니다.");

  useEffect(() => {
    localStorage.setItem('rabbitState', JSON.stringify(rabbit));
  }, [rabbit]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b']
    });
  };

  const handleAction = (type: 'feed' | 'study' | 'play' | 'rest') => {
    // Fix: Using individual variable assignments to avoid binding element errors during destructuring
    let level = rabbit.level;
    let exp = rabbit.exp;
    let maxExp = rabbit.maxExp;
    let energy = rabbit.energy;
    let happiness = rabbit.happiness;
    let intelligence = rabbit.intelligence;
    let msg = "";

    switch (type) {
      case 'feed':
        energy = Math.min(100, energy + 15);
        happiness = Math.min(100, happiness + 5);
        exp += 2;
        msg = "냠냠! 교육 영양분을 섭취했습니다.";
        break;
      case 'study':
        if (energy < 20) { msg = "너무 지쳐서 공부할 수 없어요.."; break; }
        energy -= 20;
        intelligence += 5;
        exp += 8;
        happiness -= 5;
        msg = "집중! 지능과 지식이 쑥쑥 자랍니다.";
        break;
      case 'play':
        happiness = Math.min(100, happiness + 20);
        energy -= 10;
        exp += 3;
        msg = "까르르! 배움이 즐거워요!";
        break;
      case 'rest':
        energy = Math.min(100, energy + 40);
        happiness = Math.min(100, happiness + 10);
        msg = "Zzz... 충분한 휴식이 성장을 돕습니다.";
        break;
    }

    // Level up logic
    if (exp >= maxExp) {
      if (level < RABBIT_STAGES.length - 1) {
        level += 1;
        exp = 0;
        maxExp = Math.floor(maxExp * 1.8);
        triggerConfetti();
        msg = `🎉 축하합니다! ${RABBIT_STAGES[level].name}(으)로 진화했습니다!`;
      } else {
        exp = maxExp;
      }
    }

    setRabbit({
      ...rabbit,
      level, exp, maxExp, energy, happiness, intelligence,
      stageName: RABBIT_STAGES[level].name,
      emoji: RABBIT_STAGES[level].emoji
    });
    setMessage(msg);
  };

  const StatBar = ({ label, value, color, icon }: any) => (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-bold mb-1 px-1 text-slate-500 uppercase tracking-tighter">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color} transition-all duration-500`}
        />
      </div>
    </div>
  );

  return (
    <Card className="relative overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/30">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-900/20 -z-10" />
      
      <div className="flex flex-col items-center py-6">
        <motion.div 
          key={rabbit.level}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-9xl mb-6 cursor-pointer select-none animate-float drop-shadow-2xl"
          onClick={() => handleAction('play')}
        >
          {rabbit.emoji}
        </motion.div>

        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black mb-3 shadow-lg shadow-indigo-200"
          >
            LV. {rabbit.level} | {rabbit.stageName}
          </motion.div>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-medium px-4 h-10 flex items-center justify-center italic">
            "{message}"
          </p>
        </div>

        <div className="w-full grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
          <StatBar label="경험치 (EXP)" value={(rabbit.exp / rabbit.maxExp) * 100} color="bg-indigo-500" icon="🎓" />
          <StatBar label="체력 (Energy)" value={rabbit.energy} color="bg-amber-400" icon="⚡" />
          <StatBar label="행복도 (Happy)" value={rabbit.happiness} color="bg-rose-400" icon="❤️" />
          <StatBar label="지능 (Intel)" value={Math.min(100, rabbit.intelligence)} color="bg-cyan-400" icon="🧠" />
        </div>

        <div className="grid grid-cols-4 gap-3 w-full">
          {[
            { id: 'feed', icon: '🥙', label: '영양', color: 'bg-emerald-500' },
            { id: 'study', icon: '📖', label: '공부', color: 'bg-indigo-600' },
            { id: 'play', icon: '🎾', label: '놀이', color: 'bg-rose-500' },
            { id: 'rest', icon: '😴', label: '휴식', color: 'bg-slate-700' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleAction(btn.id as any)}
              className={`${btn.color} text-white p-3 rounded-2xl flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md group`}
            >
              <span className="text-xl group-hover:rotate-12 transition-transform">{btn.icon}</span>
              <span className="text-[10px] font-bold">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
