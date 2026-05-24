import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './components/Card';
import { RabbitGame } from './components/RabbitGame';
import { AITutor } from './components/AITutor';
import { PomodoroTimer } from './components/PomodoroTimer';
import { EduFlashcards } from './components/EduFlashcards';
import { EduMemoryGame } from './components/EduMemoryGame';
import { EduPlanner } from './components/EduPlanner';
import { EduSoundZone } from './components/EduSoundZone';
import { Theme, Achievement } from './types';
import { QUOTES, MISSIONS, EDU_LINKS, IDENTITY_TYPES, COMPASS_CATEGORIES } from './constants';
import confetti from 'canvas-confetti';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_score', title: '배움의 시작', description: '첫 100포인트를 달성했습니다!', icon: '🌟', unlocked: false },
  { id: 'math_master', title: '수리적 천재', description: '수학 퀴즈를 5회 이상 맞췄습니다.', icon: '📐', unlocked: false },
  { id: 'echo_friend', title: '에듀-버니의 팬', description: '에듀-버니 에코와 5번 대화했습니다.', icon: '🐰', unlocked: false },
  { id: 'focus_king', title: '몰입의 왕', description: '포모도로 집중 시간을 완료했습니다.', icon: '👑', unlocked: false },
  { id: 'scramble_pro', title: '언어의 달인', description: '스크램블 퀴즈를 3회 이상 해결했습니다.', icon: '📝', unlocked: false },
  { id: 'memory_master', title: '천재적인 기억력', description: '메모리 게임을 1회 이상 완수했습니다.', icon: '🧩', unlocked: false },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [mission, setMission] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [compassResult, setCompassResult] = useState<string | null>(null);
  const [compassCount, setCompassCount] = useState(0);
  const [echoCount, setEchoCount] = useState(0);
  const [highlightText, setHighlightText] = useState("");
  
  const [score, setScore] = useState(() => Number(localStorage.getItem('eduScore') || 0));
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('eduAchievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [mathGame, setMathGame] = useState({ a: 0, b: 0, ans: 0, input: "", solvedCount: 0 });
  const scrambleWords = ['EDUCATION', 'LEARNING', 'KNOWLEDGE', 'WISDOM', 'GROWTH', 'CURIOSITY', 'STUDENT', 'TEACHER', 'FUTURE'];
  const [scramble, setScramble] = useState({ original: '', scrambled: '', input: '', solvedCount: 0 });

  const eduWords = ['교육', 'EDU', '에듀', 'At You', 'at you'];

  useEffect(() => {
    localStorage.setItem('eduScore', score.toString());
    localStorage.setItem('eduAchievements', JSON.stringify(achievements));
    checkAchievements();
  }, [score, achievements, mathGame.solvedCount, scramble.solvedCount, compassCount, echoCount]);

  useEffect(() => {
    document.body.className = theme === Theme.Dark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(1, scrolled / docHeight));
    };
    window.addEventListener('scroll', handleScroll);
    generateMath();
    generateScramble();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAchievements = () => {
    let updated = false;
    const newAchievements = achievements.map(a => {
      if (a.unlocked) return a;
      let shouldUnlock = false;
      if (a.id === 'first_score' && score >= 100) shouldUnlock = true;
      if (a.id === 'math_master' && mathGame.solvedCount >= 5) shouldUnlock = true;
      if (a.id === 'scramble_pro' && scramble.solvedCount >= 3) shouldUnlock = true;
      if (a.id === 'compass_explorer' && compassCount >= 5) shouldUnlock = true;
      if (a.id === 'echo_friend' && echoCount >= 5) shouldUnlock = true;
      
      if (shouldUnlock) {
        updated = true;
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#7c3aed', '#10b981'] });
        return { ...a, unlocked: true };
      }
      return a;
    });
    if (updated) setAchievements(newAchievements);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        confetti({ particleCount: 150, spread: 60, colors: ['#a855f7', '#10b981'] });
        return { ...a, unlocked: true };
      }
      return a;
    }));
  };

  const generateMath = () => {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    setMathGame(prev => ({ ...prev, a, b, ans: a + b, input: "" }));
  };

  const checkMath = () => {
    if (parseInt(mathGame.input) === mathGame.ans) {
      setScore(s => s + 10);
      setMathGame(prev => ({ ...prev, solvedCount: prev.solvedCount + 1 }));
      generateMath();
    } else {
      alert("다시 한번 도전해보세요! 실패는 학습의 일부입니다.");
    }
  };

  const generateScramble = () => {
    const word = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    setScramble(prev => ({ ...prev, original: word, scrambled, input: '' }));
  };

  const checkScramble = () => {
    if (scramble.input.toUpperCase() === scramble.original) {
      setScore(s => s + 20);
      setScramble(prev => ({ ...prev, solvedCount: prev.solvedCount + 1 }));
      generateScramble();
    } else {
      alert("철자를 다시 확인해볼까요?");
    }
  };

  const highlightContent = (text: string) => {
    if (!text) return text;
    let newText = text;
    eduWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      newText = newText.replace(regex, `<span class="edu-glow keyword-reveal">$1</span>`);
    });
    return newText;
  };

  const handleCompassClick = (path: string) => {
    setCompassResult(path);
    setCompassCount(c => c + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen selection:bg-purple-500 selection:text-white transition-colors duration-700">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 z-[100] bg-slate-200 dark:bg-slate-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-400 shadow-[0_0_15px_rgba(124,58,237,0.5)]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Floating Score Display */}
      <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[90] flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 sm:px-6 sm:py-3 glass-card rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 border-purple-200"
        >
           <span className="text-[10px] sm:text-xs font-black text-purple-600 uppercase tracking-[0.2em]">KNOWLEDGE POINT</span>
           <span className="text-xl sm:text-3xl font-black text-purple-700 dark:text-purple-400">{score}</span>
        </motion.div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]" />
          <div className="grid grid-cols-6 gap-2 opacity-5 absolute -rotate-12 scale-150">
             {Array.from({length: 60}).map((_, i) => (
               <div key={i} className="text-6xl font-black italic">EDU</div>
             ))}
           </div>
        </div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <div className="flex gap-4 sm:gap-6 justify-center mb-12">
            {['E','D','U'].map((char, i) => (
              <motion.span 
                key={i}
                animate={{ y: [0, -30, 0], scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: i * 0.4 }}
                className="text-7xl md:text-[15rem] font-black edu-glow drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
              >
                {char}
              </motion.span>
            ))}
          </div>
          <h1 className="text-4xl md:text-9xl font-black mb-10 tracking-tighter leading-none">
            성장은 <span className="text-emerald-400 italic">배움</span>에서<br/>
            완성됩니다
          </h1>
          <p className="text-lg md:text-4xl opacity-80 mb-16 max-w-5xl mx-auto font-light leading-snug">
             당신만을 위한 고도화된 <span className="text-purple-400 font-black">에듀(EDU)</span> 생태계, <br/>
             지금 <span className="text-purple-400 font-black">At You</span>가 당신의 길을 비춥니다.
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center">
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-10 py-5 sm:px-16 sm:py-7 bg-purple-600 text-white rounded-3xl font-black text-xl sm:text-3xl hover:bg-purple-500 transition-all shadow-[0_25px_50px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95"
            >
              교육 탐험 시작
            </button>
            <button 
              onClick={() => setTheme(t => t === Theme.Light ? Theme.Dark : Theme.Light)}
              className="px-8 py-5 sm:px-14 sm:py-7 bg-white/10 backdrop-blur-3xl border-2 border-white/20 text-white rounded-3xl font-bold text-xl sm:text-3xl hover:bg-white/20 transition-all"
            >
              {theme === Theme.Light ? "🌙 다크 모드" : "☀️ 라이트 모드"}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-20 sm:py-40 space-y-32 sm:space-y-48">
        
        {/* Interaction Hub: Rabbit & Game Dashboard */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20"
        >
          <div className="space-y-8 sm:space-y-12">
            <h2 className="text-3xl sm:text-5xl font-black flex items-center gap-4 text-purple-700 dark:text-purple-400">
              🐰 <span dangerouslySetInnerHTML={{ __html: highlightContent("토끼 성장 EDU 월드") }} />
            </h2>
            <RabbitGame />
          </div>

          <div className="space-y-8 sm:space-y-12">
            <Card title="📊 실시간 배움 통계" className="bg-white dark:bg-slate-900 shadow-2xl">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 p-2">
                <div className="p-4 sm:p-6 bg-purple-50 dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700">
                  <span className="text-[10px] font-black text-purple-600 uppercase block mb-1">Total Score</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{score}</div>
                </div>
                <div className="p-4 sm:p-6 bg-emerald-50 dark:bg-slate-800 rounded-3xl border border-emerald-100 dark:border-slate-700">
                  <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">Badges Won</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                    {achievements.filter(a => a.unlocked).length} / {achievements.length}
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-amber-50 dark:bg-slate-800 rounded-3xl border border-amber-100 dark:border-slate-700">
                  <span className="text-[10px] font-black text-amber-600 uppercase block mb-1">Math Puzzles</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{mathGame.solvedCount}</div>
                </div>
                <div className="p-4 sm:p-6 bg-cyan-50 dark:bg-slate-800 rounded-3xl border border-cyan-100 dark:border-slate-700">
                  <span className="text-[10px] font-black text-cyan-600 uppercase block mb-1">Word Decodes</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{scramble.solvedCount}</div>
                </div>
              </div>
            </Card>

             <Card title="🎮 EDU 지능 개발 스테이션" className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 border-none shadow-2xl overflow-hidden">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-3xl shadow-lg border border-purple-50 dark:border-slate-700">
                  <span className="text-[10px] font-black text-purple-600 tracking-widest block mb-4 uppercase">Neural Math Logic</span>
                  <div className="text-3xl sm:text-4xl font-black mb-6 text-center flex items-center justify-center gap-4">
                    <span className="text-slate-300">{mathGame.a}</span>
                    <span className="text-purple-600">+</span>
                    <span className="text-slate-300">{mathGame.b}</span>
                    <span className="text-emerald-500">= ?</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="number"
                      value={mathGame.input}
                      onChange={(e) => setMathGame(prev => ({ ...prev, input: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && checkMath()}
                      className="w-full sm:flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 font-black text-xl text-center outline-none border-2 border-transparent focus:border-purple-300 transition-all dark:text-white"
                      placeholder="정답"
                    />
                    <button onClick={checkMath} className="w-full sm:w-auto px-10 py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-500 transition-all active:scale-95 whitespace-nowrap">확인</button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-50 dark:border-slate-700">
                  <span className="text-[10px] font-black text-emerald-600 tracking-widest block mb-4 uppercase">Linguistic Decode</span>
                  <div className="text-center mb-6">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-[0.2em] block mb-2">{scramble.scrambled}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text"
                      value={scramble.input}
                      onChange={(e) => setScramble(prev => ({ ...prev, input: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && checkScramble()}
                      className="w-full sm:flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 font-black text-xl text-center uppercase outline-none border-2 border-transparent focus:border-emerald-300 transition-all dark:text-white"
                      placeholder="ENTER"
                    />
                    <button onClick={checkScramble} className="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 transition-all active:scale-95 whitespace-nowrap">해독</button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Echo Tutor & Flashcards */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <AITutor onAction={() => {
            setScore(s => s + 5);
            setEchoCount(c => c + 1);
          }} />
          <EduFlashcards />
        </motion.section>

        {/* Planner & Memory Game */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-1 space-y-8">
            <PomodoroTimer onComplete={(type) => {
              if (type === 'focus') {
                setScore(s => s + 50);
                unlockAchievement('focus_king');
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.8 } });
              }
            }} />
            <EduSoundZone />
          </div>
          <div className="lg:col-span-2 space-y-8 flex flex-col">
            <EduMemoryGame onWin={() => {
              setScore(s => s + 100);
              unlockAchievement('memory_master');
              confetti({ particleCount: 200, spread: 90, origin: { y: 0.7 } });
            }} />
            <EduPlanner />
          </div>
        </motion.section>

        {/* Achievement Hall */}
        <section>
          <Card title="🏆 배움의 전당 (Achievements)" className="overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 p-1">
              {achievements.map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-[2rem] flex items-center justify-center text-4xl shadow-md border-4 transition-all ${
                    a.unlocked 
                      ? 'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-400 text-purple-600 shadow-purple-200' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 grayscale'
                  }`}
                  title={`${a.title}: ${a.description}`}
                >
                  {a.icon}
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-xs font-black text-slate-400 text-center uppercase tracking-[0.3em]">
              학습 목표를 달성하여 당신의 발자취를 남기세요
            </p>
          </Card>
        </section>

        {/* EDU Compass Feature */}
        <section>
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-4xl sm:text-6xl font-black mb-4 sm:mb-6 text-purple-800 dark:text-purple-300 tracking-tighter">
              🧭 <span dangerouslySetInnerHTML={{ __html: highlightContent("성장 EDU 콤파스") }} />
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium">당신의 현재 상태를 선택하세요. 가장 필요한 학습의 방향을 가리킵니다.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-8">
            {COMPASS_CATEGORIES.map((cat) => (
              <button 
                key={cat.label}
                onClick={() => handleCompassClick(cat.path)}
                className="group p-6 sm:p-10 glass-card rounded-[2rem] sm:rounded-[3rem] flex flex-col items-center gap-4 sm:gap-6 transition-all hover:bg-purple-600 hover:text-white hover:-translate-y-5 shadow-2xl shadow-purple-100"
              >
                <span className="text-5xl sm:text-7xl group-hover:scale-125 transition-transform duration-500">{cat.icon}</span>
                <span className="font-black text-lg sm:text-2xl">{cat.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence>
            {compassResult && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 sm:mt-16 p-8 sm:p-14 bg-purple-50 dark:bg-slate-900 border-4 border-purple-200 dark:border-purple-900/50 rounded-[3rem] sm:rounded-[4rem] text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                <p className="text-xs font-black text-purple-600 mb-4 uppercase tracking-[0.4em]">Personalized Learning Path</p>
                <p className="text-2xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">{compassResult}</p>
                <button 
                  onClick={() => setCompassResult(null)} 
                  className="mt-8 sm:mt-10 text-base sm:text-lg font-black text-purple-400 hover:text-purple-600 transition-colors underline underline-offset-8"
                >
                  다시 길 찾기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Global Education Links */}
        <section id="global-edu">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-7xl font-black mb-12 sm:mb-20 text-purple-700 dark:text-purple-400 flex flex-wrap items-center gap-4 sm:gap-8 tracking-tighter"
          >
            🌐 <span className="underline decoration-purple-600 decoration-[8px] sm:decoration-[16px] underline-offset-[12px] sm:underline-offset-[20px]">글로벌 교육 플랫폼</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {EDU_LINKS.map((link, idx) => (
              <motion.a 
                key={link.name}
                href={link.url}
                target="_blank"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group p-8 sm:p-12 glass-card rounded-[3rem] sm:rounded-[4rem] border border-purple-100 dark:border-slate-800 hover:border-purple-500 transition-all hover:shadow-[0_40px_80px_rgba(124,58,237,0.2)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 sm:p-10 opacity-5 group-hover:opacity-100 transition-all duration-700 transform group-hover:rotate-45">
                   <span className="text-6xl sm:text-8xl text-purple-500 font-black italic">↗</span>
                </div>
                <div className="relative z-10">
                  <span className="inline-block px-4 sm:px-6 py-1 sm:py-2 bg-purple-50 dark:bg-purple-900/40 text-[10px] sm:text-xs font-black uppercase text-purple-700 dark:text-purple-300 mb-4 sm:mb-6 rounded-full tracking-widest">{link.category}</span>
                  <h4 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-5 text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors leading-none tracking-tight">{link.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed font-medium">{link.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Wisdom & Missions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
          <Card className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white border-none p-10 sm:p-20 shadow-[0_30px_60px_rgba(124,58,237,0.4)] relative overflow-hidden rounded-[3rem] sm:rounded-[4rem]">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] pointer-events-none"></div>
            <h3 className="text-2xl sm:text-4xl font-black mb-8 sm:mb-12 flex items-center gap-4 sm:gap-5">📚 <span dangerouslySetInnerHTML={{ __html: highlightContent("오늘의 지혜") }} /></h3>
            <div className="min-h-[180px] sm:min-h-[250px] flex items-center">
               <p className="text-2xl sm:text-5xl font-light leading-tight italic tracking-tight drop-shadow-2xl">"{quote}"</p>
            </div>
            <button 
              onClick={() => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])}
              className="mt-10 sm:mt-14 px-8 py-4 sm:px-12 sm:py-5 bg-white text-purple-900 rounded-[1.5rem] sm:rounded-[2rem] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl text-lg sm:text-xl"
            >
              새로운 영감 충전
            </button>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-800 text-white border-none p-10 sm:p-20 shadow-[0_30px_60px_rgba(16,185,129,0.3)] relative overflow-hidden rounded-[3rem] sm:rounded-[4rem]">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] pointer-events-none"></div>
            <h3 className="text-2xl sm:text-4xl font-black mb-8 sm:mb-12 flex items-center gap-4 sm:gap-5">🎲 <span dangerouslySetInnerHTML={{ __html: highlightContent("랜덤 EDU 미션") }} /></h3>
            <div className="min-h-[180px] sm:min-h-[250px] flex items-center">
               <p className="text-3xl sm:text-5xl font-black leading-tight tracking-tighter drop-shadow-xl">
                 {mission || "지혜를 향한 도전을 시작해볼까요?"}
               </p>
            </div>
            <button 
              onClick={() => setMission(MISSIONS[Math.floor(Math.random() * MISSIONS.length)])}
              className="mt-10 sm:mt-14 px-8 py-4 sm:px-12 sm:py-5 bg-slate-900 text-white rounded-[1.5rem] sm:rounded-[2rem] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl text-lg sm:text-xl"
            >
              미션 제안 받기
            </button>
          </Card>
        </section>

        {/* Smart Highlighter Tool */}
        <section>
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-6xl font-black mb-6 text-purple-800 dark:text-purple-300 tracking-tighter">
              🔠 <span dangerouslySetInnerHTML={{ __html: highlightContent("스마트 하이라이터 V2") }} />
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium">학습 내용을 입력하면 핵심 키워드를 실시간으로 추출하고 시각화합니다.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            <div className="space-y-4 sm:space-y-6">
              <label className="text-[10px] sm:text-xs font-black uppercase text-purple-400 tracking-[0.4em] ml-4 sm:ml-6">STUDY INPUT STREAM</label>
              <textarea 
                value={highlightText}
                onChange={(e) => setHighlightText(e.target.value)}
                placeholder="학습한 내용을 여기에 기록하세요. '교육', '에듀', 'At You' 등이 지능적으로 강조됩니다."
                className="w-full h-72 sm:h-96 p-8 sm:p-12 bg-white dark:bg-slate-900 rounded-[3rem] sm:rounded-[4rem] border-4 border-slate-100 dark:border-slate-800 outline-none focus:border-purple-500 transition-all font-medium text-xl sm:text-2xl shadow-inner dark:text-white leading-relaxed"
              />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <label className="text-[10px] sm:text-xs font-black uppercase text-purple-400 tracking-[0.4em] ml-4 sm:ml-6">VISUALIZED INSIGHTS</label>
              <div className="w-full h-72 sm:h-96 p-8 sm:p-12 bg-purple-50/40 dark:bg-slate-900 rounded-[3rem] sm:rounded-[4rem] border-4 border-purple-100 dark:border-slate-800 overflow-y-auto whitespace-pre-wrap text-xl sm:text-2xl font-medium leading-relaxed shadow-sm custom-scrollbar">
                {highlightText ? (
                  <div dangerouslySetInnerHTML={{ __html: highlightContent(highlightText) }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-300 italic text-xl">
                    분석할 내용을 입력하면 실시간 하이라이팅이 적용됩니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24 sm:py-48 px-6 sm:px-8 border-t-8 border-purple-600">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 sm:gap-32">
          <div className="max-w-3xl">
            <div className="text-5xl sm:text-8xl font-black mb-8 sm:mb-12 tracking-tighter">
              <span dangerouslySetInnerHTML={{ __html: highlightContent("EDU At You") }} />
            </div>
            <p className="text-slate-400 text-xl sm:text-3xl font-light leading-relaxed mb-10 sm:mb-12">
              지식은 인류를 자유롭게 하는 유일한 힘입니다. <br/>
              우리는 모든 학습자가 자신만의 잠재력을 발견하고, <br/>
              더 넓은 세상으로 나아갈 수 있도록 돕습니다. <br/>
              교육의 미래, <span className="text-purple-400 font-black">At You</span>가 함께합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-12 sm:gap-24">
             <div>
               <h5 className="text-purple-500 font-black mb-6 sm:mb-10 uppercase tracking-[0.3em] text-[10px] sm:text-sm">Philosophy</h5>
               <ul className="space-y-4 sm:space-y-6 text-slate-400 text-base sm:text-xl font-medium">
                 <li>지속적 성장</li>
                 <li>가치 연결</li>
                 <li>지식 혁신</li>
                 <li>무한한 공유</li>
               </ul>
             </div>
             <div>
               <h5 className="text-purple-500 font-black mb-6 sm:mb-10 uppercase tracking-[0.3em] text-[10px] sm:text-sm">Support</h5>
               <ul className="space-y-4 sm:space-y-6 text-slate-400 text-base sm:text-xl font-medium">
                 <li>가이드북</li>
                 <li>고객센터</li>
                 <li>피드백 제안</li>
                 <li>학습 통계</li>
               </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 sm:mt-40 pt-10 sm:pt-20 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-12 text-slate-600 font-bold uppercase tracking-[0.6em] text-[10px] sm:text-sm text-center md:text-left">
          <span>&copy; 2025 Education At You Platform. Pioneers of Wisdom.</span>
          <span className="text-purple-900/50 text-[10px]">MADE WITH PASSION FOR LEARNING</span>
        </div>
      </footer>
    </div>
  );
};

export default App;