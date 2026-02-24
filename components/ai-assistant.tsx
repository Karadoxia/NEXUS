'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Bot, ChevronRight } from 'lucide-react';
import { processAiMessage, AiResponse } from '@/lib/ai-service';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

export function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'assistant',
            text: "Hello! I'm Neuromancer, your NEXUS assistant. How can I help you find the perfect upgrade today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response: AiResponse = await processAiMessage(userMsg.text);

            setIsTyping(false);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: response.text,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);

            if (response.intent === 'NAVIGATE' && response.data) {
                setTimeout(() => router.push(response.data), 1000);
            }
            if (response.intent === 'SEARCH' && response.data) {
                // Trigger global search (we'll implement this via event dispatch or URL param)
                // For now, just navigate to store
                setTimeout(() => router.push('/store'), 1000);
            }

        } catch (error) {
            console.error(error);
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                    <Bot className="h-5 w-5 text-cyan-400" suppressHydrationWarning />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Neuromancer</h3>
                                    <p className="text-[10px] text-cyan-300 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Minimize2 className="h-4 w-4" suppressHydrationWarning />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" suppressHydrationWarning />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-cyan-600 text-white rounded-br-none'
                                            : 'bg-slate-800 text-gray-200 border border-white/10 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-white/10 flex gap-1 items-center">
                                        <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-slate-900 border-t border-white/10">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about products, orders..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-2 p-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" suppressHydrationWarning />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                className={`pointer-events-auto shadow-lg shadow-cyan-500/20 group relative flex items-center justify-center rounded-full bg-cyan-500 text-black transition-all hover:bg-cyan-400 hover:scale-110 active:scale-95 ${isOpen && !isMinimized ? 'h-0 w-0 opacity-0 overflow-hidden' : 'h-14 w-14'
                    }`}
            >
                <MessageSquare className="h-6 w-6" suppressHydrationWarning />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-black" />
            </button>
        </div>
    );
}
