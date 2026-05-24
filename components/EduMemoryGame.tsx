
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

const ICONS = ['📖', '🎓', '🧠', '✏️', '🧪', '🔭', '🌍', '📐'];
const ALL_CARDS = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);

export const EduMemoryGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [cards, setCards] = useState(ALL_CARDS.map((icon, index) => ({ id: index, icon, flipped: false, solved: false })));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  const handleFlip = (index: number) => {
    if (disabled || cards[index].flipped || cards[index].solved) return;
    
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlipped([...flipped, index]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true);
      const [first, second] = flipped;
      if (cards[first].icon === cards[second].icon) {
        setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, solved: true } : c));
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flipped]);

  useEffect(() => {
    if (cards.every(c => c.solved)) {
      onWin();
    }
  }, [cards]);

  const reset = () => {
    setCards(ALL_CARDS.sort(() => Math.random() - 0.5).map((icon, index) => ({ id: index, icon, flipped: false, solved: false })));
    setFlipped([]);
  };

  return (
    <Card title="🧩 EDU 메모리 챌린지" className="h-full flex flex-col items-center">
      <p className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">기억력을 높여 지능 수치를 올리세요!</p>
      <div className="grid grid-cols-4 gap-3 w-full max-w-[400px]">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.flipped || card.solved ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(i)}
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl cursor-pointer shadow-md transition-colors ${
              card.flipped || card.solved ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            {card.flipped || card.solved ? card.icon : '❓'}
          </motion.div>
        ))}
      </div>
      <button 
        onClick={reset}
        className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
      >
        게임 초기화
      </button>
    </Card>
  );
};
