export type VoiceLanguage = 'Bengali' | 'Hindi' | 'English';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private lastSpokenText: string = '';
  private currentLanguage: VoiceLanguage = 'Bengali';
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      this.isMuted = localStorage.getItem('merakhata_babu_muted') === 'true';
      const savedLang = localStorage.getItem('merakhata_babu_voice_lang') as VoiceLanguage;
      if (savedLang) this.currentLanguage = savedLang;
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  setLanguage(lang: VoiceLanguage) {
    this.currentLanguage = lang;
    localStorage.setItem('merakhata_babu_voice_lang', lang);
  }

  getLanguage(): VoiceLanguage {
    return this.currentLanguage;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('merakhata_babu_muted', String(muted));
    if (muted) {
      this.stop();
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (this.isMuted || !this.synth || !text) return;

    this.stop();
    this.lastSpokenText = text;

    // Clean markdown asterisks or special tokens for natural speech
    const cleanText = text
      .replace(/\*/g, '')
      .replace(/₹/g, ' rupees ')
      .replace(/#/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    // Detect language code
    const langCode = this.currentLanguage === 'Bengali' 
      ? 'bn-IN' 
      : this.currentLanguage === 'Hindi' 
      ? 'hi-IN' 
      : 'en-IN';

    utterance.lang = langCode;

    // Find best voice match (prefer Google or high quality voices)
    const targetVoice = this.voices.find(v => 
      v.lang.startsWith(langCode.substring(0, 2)) && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Bengali') || v.name.includes('Hindi'))
    ) || this.voices.find(v => v.lang.startsWith(langCode.substring(0, 2))) || this.voices[0];

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    // Conversational, friendly cadence
    utterance.rate = 0.98;
    utterance.pitch = 1.02;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('TTS error:', e);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  replay(onStart?: () => void, onEnd?: () => void) {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, onStart, onEnd);
    }
  }

  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  // Voice Input Recognition
  initRecognition(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (typeof window === 'undefined') return null;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser. Please type your message.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const langCode = this.currentLanguage === 'Bengali' 
      ? 'bn-IN' 
      : this.currentLanguage === 'Hindi' 
      ? 'hi-IN' 
      : 'en-IN';
    recognition.lang = langCode;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      onError(event.error || 'Voice input error');
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  }
}

export const speech = new SpeechService();
