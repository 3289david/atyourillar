
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';

export const EduSoundZone: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);

  const SOUNDS = [
    { id: 'rain', name: '빗소리', icon: '🌧️', color: 'bg-blue-500' },
    { id: 'forest', name: '숲의 고요', icon: '🌲', color: 'bg-emerald-500' },
    { id: 'library', name: '도서관', icon: '📚', color: 'bg-amber-600' },
    { id: 'cafe', name: '백색소음', icon: '☕', color: 'bg-orange-700' },
  ];

  return (
    <Card title="🎵 집중력 사운드 존" className="text-center">
      <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">최적의 학습 환경을 조성하세요</p>
      <div className="grid grid-cols-2 gap-4">
        {SOUNDS.map(sound => (
          <button
            key={sound.id}
            onClick={() => setPlaying(playing === sound.id ? null : sound.id)}
            className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all ${
              playing === sound.id ? `${sound.color} text-white scale-105 shadow-xl` : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="text-4xl">{sound.icon}</span>
            <span className="font-bold text-sm">{sound.name}</span>
            {playing === sound.id && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 bg-white rounded-full mt-1"
              />
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};
