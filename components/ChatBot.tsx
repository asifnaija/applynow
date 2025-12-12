import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hi! I'm your ApplyNow admissions assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    const session = createChatSession();
    if (session) {
        chatSessionRef.current = session;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatSessionRef.current) {
            // Re-attempt init if failed or missing key
            chatSessionRef.current = createChatSession();
        }

        if (chatSessionRef.current) {
            const response = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const text = response.text || "I'm not sure how to respond to that.";
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text }]);
        } else {
             setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "I'm currently offline. Please check your API configuration." }]);
        }
    } catch (error) {
        console.error("Chat error", error);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I encountered an error connecting to the AI. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  return (
    <>
        {/* Trigger Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-white
                ${isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/30'}
            `}
            aria-label="Toggle Chat"
        >
            {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </button>

        {/* Chat Window */}
        <div className={`fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col transition-all duration-300 origin-bottom-right
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}
        `}
        style={{ height: '500px', maxHeight: '80vh' }}
        >
            {/* Header */}
            <div className="p-4 bg-brand-600 text-white rounded-t-2xl flex items-center gap-3 shadow-md">
                <div className="p-2 bg-white/20 rounded-full">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Admissions Assistant</h3>
                    <p className="text-xs text-brand-100">Powered by Gemini AI</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                            ${msg.role === 'user' 
                                ? 'bg-brand-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}
                        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-brand-600" />
                            <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 transition-all">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask a question..."
                        className="flex-grow bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-1.5 bg-brand-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    </>
  );
};