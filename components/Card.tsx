
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02] hover:shadow-2xl ${className}`}>
      {title && (
        <h3 className="text-2xl font-black mb-6 text-indigo-600 dark:text-indigo-400 flex items-center gap-3 tracking-tight">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
