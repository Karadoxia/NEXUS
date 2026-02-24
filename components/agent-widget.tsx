'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
    role: 'agent' | 'user';
    text: string;
}

export function AgentWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'agent', text: 'Hello! I am your AI Strategic Advisor. Ask me about market trends, suppliers, or compatibility checks.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:4000/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'agent', text: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'agent', text: 'Error connecting to strategy center.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 border border-cyan-400"
                >
                    <MessageSquare size={24} suppressHydrationWarning />
                </button>
            )}

            {isOpen && (
                <div className="bg-slate-900 border border-cyan-800 rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-950 p-4 border-b border-cyan-900 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="text-cyan-400" size={20} suppressHydrationWarning />
                            <h3 className="font-bold text-cyan-500">Strategic Advisor</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={20} suppressHydrationWarning />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-cyan-900/50 text-cyan-50 border border-cyan-800'
                                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 text-cyan-400 p-3 rounded-lg text-sm border border-slate-700 animate-pulse">
                                    Analyzing market data...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-cyan-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about strategy..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-cyan-700 hover:bg-cyan-600 text-white p-2 rounded-md disabled:opacity-50"
                            >
                                <Send size={18} suppressHydrationWarning />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
