
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { ChatMessage } from '../types';

export const AITutor: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '반갑습니다! 교육! 에듀! At you! 무엇이든 물어보세요! (에듀-버니는 배움을 응원합니다 🐰)' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const EDU_KEYWORDS = ['교육!', '에듀!', 'EDU!', 'At you!', 'Education!', '배움!', '성장!', '학습!'];
  const EDU_PHRASES = [
    '교육은 미래입니다 ✨',
    '에듀와 함께라면 두렵지 않아요!',
    '당신 곁의 EDU, At you!',
    '오늘도 교육적인 하루 되세요 📖',
    '무한한 배움, 무한한 EDU!',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    // AI 대신 키워드 조합 응답 생성 (1초 딜레이로 실제 채팅 느낌 부여)
    setTimeout(() => {
      const randomKeywords = Array.from({ length: 2 }, () => EDU_KEYWORDS[Math.floor(Math.random() * EDU_KEYWORDS.length)]).join(' ');
      const randomPhrase = EDU_PHRASES[Math.floor(Math.random() * EDU_PHRASES.length)];
      const response = `${randomKeywords} ${randomPhrase}`;

      setMessages(prev => [...prev, { role: 'model', text: response }]);
      setIsTyping(false);
      if (onAction) onAction();
    }, 800);
  };

  return (
    <Card title="🐰 에듀-버니 에코" className="flex flex-col h-[650px] shadow-2xl">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-inner"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-black leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none border border-purple-100 dark:border-slate-600'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 p-5 rounded-3xl rounded-tl-none border border-purple-100 shadow-sm">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex gap-4 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="에듀-버니에게 인사해보세요! (예: 안녕!)"
          className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-50 dark:border-slate-800 focus:border-purple-500 outline-none text-base font-medium dark:text-white shadow-sm transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isTyping}
          className="px-8 bg-purple-600 text-white rounded-2xl hover:bg-purple-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </div>
    </Card>
  );
};
