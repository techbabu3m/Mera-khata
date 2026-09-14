import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speech } from '../services/speech';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Square,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Bot
} from 'lucide-react';

export const BabuAssistantModal: React.FC = () => {
  const {
    isBabuOpen,
    closeBabu,
    babuMessages,
    isBabuThinking,
    sendBabuMessage,
    isSpeaking,
    isMuted,
    toggleMute,
    stopSpeaking,
    replayLastSpeech,
    voiceLanguage,
    setVoiceLanguage,
    currentScreen,
    selectedCustomer,
    showToast,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionObj, setRecognitionObj] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isBabuOpen) {
      scrollToBottom();
    }
  }, [babuMessages, isBabuOpen, isBabuThinking]);

  // Voice Recognition Handler
  const toggleListening = () => {
    if (isListening) {
      if (recognitionObj) {
        recognitionObj.stop();
      }
      setIsListening(false);
      return;
    }

    const rec = speech.initRecognition(
      (transcript) => {
        setInputVal(transcript);
        setIsListening(false);
        // Automatically send after natural voice capture
        sendBabuMessage(transcript);
        setInputVal('');
      },
      (error) => {
        setIsListening(false);
        showToast(error);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      setRecognitionObj(rec);
      setIsListening(true);
      try {
        rec.start();
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const text = inputVal;
    setInputVal('');
    sendBabuMessage(text);
  };

  if (!isBabuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-lg leading-tight">Babu AI</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-400/30 text-emerald-100 rounded border border-emerald-300/40">
                  SMART AGENT
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                Natural Bengali • Hindi • English Business Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Replay */}
            <button
              onClick={replayLastSpeech}
              title="Replay Voice"
              className="p-2 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Stop speaking if active */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                title="Stop Speaking"
                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition animate-pulse"
              >
                <Square className="w-4 h-4" />
              </button>
            )}

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
              className={`p-2 rounded-full transition ${isMuted ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:bg-white/20 text-white'}`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={closeBabu}
              className="p-2 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Language Selector & Screen Context Bar */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Voice Language:</span>
            <div className="inline-flex rounded-md shadow-xs bg-white border border-slate-200 p-0.5">
              {(['Bengali', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setVoiceLanguage(lang)}
                  className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                    voiceLanguage === lang
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-blue-700'
                  }`}
                >
                  {lang === 'Bengali' ? 'বাংলা' : lang === 'Hindi' ? 'हिन्दी' : 'EN'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded font-medium truncate max-w-[170px]">
            {selectedCustomer ? `Customer: ${selectedCustomer.name}` : `Screen: ${currentScreen}`}
          </div>
        </div>

        {/* Audio Wave Visualizer when speaking */}
        {isSpeaking && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 flex items-center justify-center space-x-1.5 text-xs text-emerald-800 font-medium animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Babu is speaking...</span>
            <div className="flex items-center space-x-0.5 ml-2">
              <span className="w-1 h-3 bg-emerald-500 rounded-full animate-wave"></span>
              <span className="w-1 h-4 bg-emerald-600 rounded-full animate-wave delay-75"></span>
              <span className="w-1 h-2 bg-emerald-500 rounded-full animate-wave delay-150"></span>
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {babuMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Real Action Execution Pill */}
                {msg.actionExecuted && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start space-x-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block">
                        Real Action Executed
                      </span>
                      <p className="font-medium text-emerald-900">{msg.actionExecuted.details}</p>
                    </div>
                  </div>
                )}

                {/* Clarification Pill */}
                {msg.clarificationNeeded && (
                  <div className="mt-2 pt-2 border-t border-amber-100 flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Clarification requested to protect your ledger data</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isBabuThinking && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs py-2 bg-white px-3 rounded-full border border-slate-200 w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span className="font-medium text-slate-600">Babu is thinking and verifying your ledger...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Try:</span>
          {[
            selectedCustomer ? `ওর due কত?` : 'আজকের business কেমন?',
            'Rahul ajke 500 taka dilo',
            'Rahul-er jonno ekta reminder baniye dao',
            'পোস্টার বানাও',
            'Invoice বানাও',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputVal(chip);
                sendBabuMessage(chip);
              }}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full border border-slate-200 whitespace-nowrap transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          {isListening && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-700 animate-pulse">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-semibold">Listening... Speak now in Bengali, Hindi, or English</span>
              </div>
              <button
                onClick={toggleListening}
                className="text-[11px] font-bold underline hover:text-red-900"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-full transition shadow-xs ${
                isListening
                  ? 'bg-red-600 text-white animate-bounce'
                  : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
              title={isListening ? "Stop Listening" : "Speak to Babu"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="বলুন বা লিখুন (e.g. Rahul ajke 500 taka dilo)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputVal.trim() || isBabuThinking}
              className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
