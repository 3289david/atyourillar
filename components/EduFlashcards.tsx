import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';

const FLASHCARDS = [
  { q: "교육의 어원은 무엇인가요?", a: "라틴어 'Educare' (안에서 밖으로 이끌어내다)" },
  { q: "가장 강력한 무기는 무엇인가요?", a: "넬슨 만델라는 교육이 세상을 바꾸는 무기라고 했습니다." },
  { q: "At You는 어떤 의미인가요?", a: "교육은 항상 당신 곁에 있다는 동반자적 의미입니다." },
  { q: "평생 교육이란?", a: "요람에서 무덤까지 이어지는 전 생애적 학습 과정입니다." },
  { q: "학습의 효율을 높이는 방법은?", a: "남에게 가르쳐보는 것이 가장 효과적인 학습법 중 하나입니다." }
];

export const EduFlashcards: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => { 
    setIdx((idx + 1) % FLASHCARDS.length); 
    setFlipped(false); 
  };

  return (
    <Card title="🗂️ EDU 플래시카드" className="h-full flex flex-col justify-between">
      <p className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest text-center">지식의 카드를 뒤집어 핵심 개념을 익히세요</p>
      <div className="flex-1 flex items-center justify-center p-4 min-h-[250px]">
        <motion.div 
          onClick={() => setFlipped(!flipped)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full h-full bg-white dark:bg-slate-800 rounded-[2.5rem] cursor-pointer flex items-center justify-center text-center p-8 border-4 border-indigo-100 dark:border-slate-700 shadow-xl relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
           <div className={`absolute w-full h-full flex flex-col items-center justify-center px-8 backface-hidden ${flipped ? 'opacity-0' : 'opacity-100'}`}>
             <span className="text-[10px] font-black text-indigo-400 block mb-4 uppercase tracking-[0.3em]">QUESTION</span>
             <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">{FLASHCARDS[idx].q}</p>
             <span className="mt-8 text-slate-300 text-[10px] font-bold">카드를 눌러 정답 확인</span>
           </div>
           <div className={`absolute w-full h-full flex flex-col items-center justify-center px-8 backface-hidden [transform:rotateY(180deg)] ${flipped ? 'opacity-100' : 'opacity-0'}`}>
             <span className="text-[10px] font-black text-emerald-500 block mb-4 uppercase tracking-[0.3em]">ANSWER</span>
             <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">{FLASHCARDS[idx].a}</p>
             <span className="mt-8 text-slate-300 text-[10px] font-bold">다시 눌러 질문 보기</span>
           </div>
        </motion.div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); next(); }} 
        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black mt-6 hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
      >
        다음 카드 탐색
      </button>
    </Card>
  );
};