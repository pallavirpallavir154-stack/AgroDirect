import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Compass, TrendingUp, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../../shared/i18n';
import { LanguageCode } from '../../shared/types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { language, setLanguage } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const langCodeMap: Record<LanguageCode, string> = {
    en: 'en-IN',
    kn: 'kn-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
  };

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      return;
    }

    // Initialize Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = langCodeMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          processVoiceQuery(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isOpen, language]);

  const startListening = () => {
    setTranscript('');
    setAiReply('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = langCodeMap[language] || 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition start failed or already active', e);
      }
    } else {
      alert(t.voice.browserNotSupported);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const processVoiceQuery = async (query: string) => {
    const q = query.toLowerCase();

    // Check voice navigation commands
    if (q.includes('market') || q.includes('मंडी') || q.includes('ಮಾರುಕಟ್ಟೆ') || q.includes('buy') || q.includes('ಉತ್ಪನ್ನ')) {
      speakResponse('Navigating to AgroDirect Marketplace.');
      setTimeout(() => {
        onNavigate('marketplace');
        onClose();
      }, 1500);
      return;
    }

    if (q.includes('harvest') || q.includes('ಕಟಾವು') || q.includes('फसल') || q.includes('contract') || q.includes('agreement')) {
      speakResponse('Opening Direct Upcoming Harvest Pipeline.');
      setTimeout(() => {
        onNavigate('direct-harvest');
        onClose();
      }, 1500);
      return;
    }

    if (q.includes('recommend') || q.includes('soil') || q.includes('मृदा') || q.includes('ಮಣ್ಣು') || q.includes('tool') || q.includes('ai')) {
      speakResponse('Opening AI Agronomy and Crop Advisory Tools.');
      setTimeout(() => {
        onNavigate('ai-tools');
        onClose();
      }, 1500);
      return;
    }

    // Server-side AI Agrobot query
    try {
      const res = await fetch('/api/ai/agrobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiReply(data.reply);
        speakResponse(data.reply);
      }
    } catch (e) {
      const fallback = 'I heard: ' + query + '. You can ask me about Mandi prices, crop diseases, or direct harvest deals.';
      setAiReply(fallback);
      speakResponse(fallback);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCodeMap[language] || 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="voice-assistant-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-[#12281a] border border-emerald-800/40 rounded-3xl w-full max-w-xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-300">
                {t.aiTools.voiceAssistant}
              </h3>
              <p className="text-xs text-stone-400">Speech-enabled in 7 Regional Languages</p>
            </div>
          </div>
          <button
            id="voice-modal-close"
            onClick={() => {
              stopListening();
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language selector chips */}
        <div className="my-4 flex flex-wrap gap-1.5 justify-center">
          {(['en', 'kn', 'hi', 'te', 'ta', 'ml', 'mr'] as LanguageCode[]).map((code) => {
            const labels: Record<LanguageCode, string> = {
              en: 'English',
              kn: 'ಕನ್ನಡ',
              hi: 'हिन्दी',
              te: 'తెలుగు',
              ta: 'தமிழ்',
              ml: 'മലയാളം',
              mr: 'मराठी',
            };
            return (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${
                  language === code
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {labels[code]}
              </button>
            );
          })}
        </div>

        {/* Center Microphone Orb */}
        <div className="flex flex-col items-center justify-center my-6">
          <button
            id="voice-mic-trigger"
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
              isListening
                ? 'bg-red-600 ring-8 ring-red-500/30 animate-pulse text-white scale-105'
                : 'bg-emerald-600 hover:bg-emerald-500 ring-8 ring-emerald-500/20 text-white'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
          <p className="mt-4 text-sm font-medium text-stone-300">
            {isListening ? t.voice.listening : t.voice.clickToSpeak}
          </p>
        </div>

        {/* Live Transcript / AI Answer */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 min-h-[110px] max-h-56 overflow-y-auto mb-4 text-sm space-y-2">
          {transcript && (
            <div className="text-emerald-300">
              <span className="text-xs text-stone-400 uppercase tracking-wider block mb-0.5">You said:</span>
              "{transcript}"
            </div>
          )}
          {aiReply && (
            <div className="text-stone-200 border-t border-stone-800/80 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                Agrobot Answer:
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{aiReply}</p>
            </div>
          )}
          {!transcript && !aiReply && (
            <p className="text-stone-500 italic text-center py-4">
              {t.voice.speakCommandPrompt}
            </p>
          )}
        </div>

        {/* Quick Voice Prompt Shortcuts */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setTranscript('What is the current tomato price?');
              processVoiceQuery('What is the current tomato price?');
            }}
            className="flex items-center justify-center gap-1.5 p-2 bg-stone-800/60 hover:bg-stone-800 rounded-xl text-xs text-stone-300 border border-stone-700/50"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Check Price
          </button>
          <button
            onClick={() => {
              setTranscript('Recommend crops for my farm');
              processVoiceQuery('Recommend crops for my farm');
            }}
            className="flex items-center justify-center gap-1.5 p-2 bg-stone-800/60 hover:bg-stone-800 rounded-xl text-xs text-stone-300 border border-stone-700/50"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            Crop Advice
          </button>
          <button
            onClick={() => {
              onNavigate('marketplace');
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 p-2 bg-stone-800/60 hover:bg-stone-800 rounded-xl text-xs text-stone-300 border border-stone-700/50"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
