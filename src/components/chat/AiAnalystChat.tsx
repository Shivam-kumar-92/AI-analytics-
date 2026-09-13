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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active: <strong>{context.productName}</strong></span>
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
                <div className="whitespace-pre-line font-sans">{msg.text}</div>
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

      {/* Input Box */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about sentiment, competitor pricing, demand trends, or launch risks..."
          className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
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
