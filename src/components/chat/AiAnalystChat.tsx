import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  Database,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { AIAnalystEngine, AnalystContext } from '../../engine/aiAnalystEngine';

interface AiAnalystChatProps {
  context: AnalystContext;
}

const PRESET_QUESTIONS = [
  'Is this product worth launching?',
  'Why are customers unhappy?',
  'What is the biggest problem with this product?',
  'Which competitor is strongest?',
  'What price should we target?',
  'Is demand increasing?',
  'Summarize this dataset.',
  'Find unusual patterns in this data.',
  'Give me a business recommendation.',
];

export const AiAnalystChat: React.FC<AiAnalystChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **Yuktivya AI** — your Indian Market Research Analyst & Quantitative Data Intelligence Engine.\n\nI have profiled and analyzed the active dataset for **${context.productName}** (${context.industry}). All my insights are grounded directly in computed statistical matrices, customer sentiment NLP polarity, competitor benchmarks, and verified demand dynamics.\n\nHow can I guide your strategic decision-making today?`,
      timestamp: 'Just now',
      evidence: [
        { metric: 'Active Records', value: context.cleaningReport.cleanedRowCount, context: 'Cleaned sample' },
        { metric: 'Data Quality', value: `${context.cleaningReport.dataQualityScore}/100`, context: `Grade ${context.cleaningReport.qualityGrade}` },
      ],
      suggestedFollowUps: [
        'Is this product worth launching?',
        'Why are customers unhappy?',
        'Which competitor is strongest?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [isBriefingPlaying, setIsBriefingPlaying] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Clean up any ongoing TTS on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = voiceLang;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [voiceLang]);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }
      try {
        recognitionRef.current.lang = voiceLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech functions
  const speakText = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (activeSpeakingMsgId === msgId || (!msgId && isBriefingPlaying)) {
        setActiveSpeakingMsgId(null);
        setIsBriefingPlaying(false);
        return;
      }
    }

    // Clean markdown symbols from spoken text
    const cleanText = text.replace(/[*_#`~[\]]/g, '').replace(/\n+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang;
    utterance.rate = 1.0;

    utterance.onend = () => {
      setActiveSpeakingMsgId(null);
      setIsBriefingPlaying(false);
    };

    utterance.onerror = () => {
      setActiveSpeakingMsgId(null);
      setIsBriefingPlaying(false);
    };

    if (msgId) {
      setActiveSpeakingMsgId(msgId);
    } else {
      setIsBriefingPlaying(true);
    }

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayBriefing = () => {
    const briefingText = `Executive strategic briefing for ${context.productName}. Commercial market viability is classified as ${context.successScore.classification}, with a product success score of ${context.successScore.overallScore} out of 100. Demand velocity score is ${context.demandIntel.score} out of 100. Category pricing benchmark is ${context.marketValue.currencySymbol}${context.marketValue.productPrice}, positioned as ${context.marketValue.pricePositionLabel}. Verified dataset quality is grade ${context.cleaningReport.qualityGrade}. Key strategic recommendation: ${context.successScore.aiVerdict}`;
    speakText(briefingText);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setIsTyping(true);

    // Stop listening if user sent message
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    // Simulate quick intelligent analytical inference
    setTimeout(() => {
      const response = AIAnalystEngine.answerQuery(textToSend, context);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-600/20 to-emerald-600/20 border border-orange-500/30 text-orange-400">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Yuktivya AI</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500/15 to-emerald-500/15 text-orange-300 border border-orange-500/30">
                Analytical Intelligence Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded strictly in active dataset calculations — zero unsupported statistical hallucination.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Executive Audio Briefing Trigger */}
          <button
            onClick={handlePlayBriefing}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isBriefingPlaying
                ? 'bg-orange-500/20 text-orange-300 border-orange-500 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
            title="Listen to synthesized 60-second strategic audio briefing"
          >
            {isBriefingPlaying ? <VolumeX className="w-3.5 h-3.5 text-orange-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isBriefingPlaying ? 'Stop Briefing' : '60s Audio Briefing'}</span>
          </button>

          {/* Voice Language Toggle for Dictation */}
          <button
            onClick={() => setVoiceLang(voiceLang === 'en-IN' ? 'hi-IN' : 'en-IN')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Speech recognition accent: Indian English or Hindi"
          >
            Voice: <span className="text-orange-400">{voiceLang === 'en-IN' ? 'EN' : 'हि'}</span>
          </button>

          <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>{context.productName}</span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Strategic Prompts
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all cursor-pointer text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-card rounded-3xl p-6 min-h-[440px] max-h-[580px] overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-indigo-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className={`space-y-3 max-w-[80%]`}>
              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="whitespace-pre-line font-sans flex-1">{msg.text}</div>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors shrink-0"
                      title={activeSpeakingMsgId === msg.id ? 'Stop audio' : 'Listen to this analytical insight'}
                    >
                      {activeSpeakingMsgId === msg.id ? (
                        <VolumeX className="w-4 h-4 text-orange-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <div
                  className={`text-[10px] text-right font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Underlying Data Evidence Badges */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px]"
                    >
                      <span className="text-slate-400 font-semibold">{ev.metric}:</span>
                      <span className="text-indigo-400 font-mono font-bold">{ev.value}</span>
                      <span className="text-slate-500 text-[10px]">({ev.context})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up suggestion pills */}
              {msg.suggestedFollowUps && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowUps.map((fu) => (
                    <button
                      key={fu}
                      onClick={() => handleSend(fu)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium transition-colors cursor-pointer"
                    >
                      → {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI Analyst is computing dataset evidence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Dictation Active Banner */}
      {isListening && (
        <div className="flex items-center justify-between text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 px-4 py-2.5 rounded-2xl animate-pulse">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-orange-400 animate-spin" />
            <span>
              Listening to voice query in <strong className="text-white">{voiceLang === 'en-IN' ? 'Indian English' : 'Hindi'}</strong>... Speak your query clearly.
            </span>
          </div>
          <button
            onClick={toggleVoiceInput}
            className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
          >
            Stop Recording
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Voice Input Microphone Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/25 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-orange-400 hover:border-orange-500/40'
          }`}
          title={isListening ? 'Listening to speech... Click to finish' : `Start Voice Query in ${voiceLang === 'en-IN' ? 'English' : 'Hindi'}`}
        >
          {isListening ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask or speak: "What are customer friction points?" or "हमारे उत्पाद की मांग कैसी है?"`}
          className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-4 sm:px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
