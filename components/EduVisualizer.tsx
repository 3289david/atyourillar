
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { Card } from './Card';

export const EduVisualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateEduImage = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A highly detailed, inspirational educational visualization or illustration showing: ${prompt}. Cinematic lighting, conceptual art style, high quality.` }]
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      alert("지식의 시각화 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card title="🎨 에듀 크리에이티브 스튜디오" className="h-full flex flex-col">
      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl mb-6 relative overflow-hidden min-h-[300px] flex items-center justify-center border-4 border-dashed border-slate-200 dark:border-slate-700">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-purple-600 font-black animate-pulse">지혜를 그리는 중...</p>
            </motion.div>
          ) : imageUrl ? (
            <motion.img 
              key="image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={imageUrl} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="text-center p-8">
              <span className="text-6xl mb-4 block opacity-20">🖼️</span>
              <p className="text-slate-400 font-medium">배우고 싶은 개념을 입력하여<br/>지식의 그림을 생성하세요.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 양자역학을 공부하는 토끼, 르네상스 예술 지도..."
          className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-50 dark:border-slate-800 focus:border-purple-500 outline-none text-sm dark:text-white"
        />
        <button 
          onClick={generateEduImage}
          disabled={isGenerating}
          className="px-8 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          시각화
        </button>
      </div>
    </Card>
  );
};
