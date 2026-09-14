import React from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Sparkles } from 'lucide-react';

export const BabuFloatingTrigger: React.FC = () => {
  const { openBabu, isBabuOpen, isSpeaking } = useApp();

  if (isBabuOpen) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40">
      <button
        onClick={() => openBabu()}
        className="group relative flex items-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/40 focus:outline-none"
        title="Chat or speak with Babu AI"
      >
        {/* Pulsing indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>

        {/* Icon */}
        <div className="relative flex items-center justify-center">
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
        </div>

        {/* Label on desktop or expanded */}
        <div className="hidden md:flex flex-col items-start ml-3 text-left">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-sm leading-none">Babu AI</span>
            <span className="bg-emerald-400/30 text-emerald-100 text-[9px] font-bold px-1 rounded">
              ONLINE
            </span>
          </div>
          <span className="text-[11px] text-blue-100 font-medium">
            {isSpeaking ? 'Speaking...' : 'Ask / Speak anything'}
          </span>
        </div>
      </button>
    </div>
  );
};
