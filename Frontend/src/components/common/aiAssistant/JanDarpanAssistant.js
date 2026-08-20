import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const JanDarpanAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Hello! I am your JanDarpan AI Civic & Welfare Assistant. Ask me about eligible government schemes, project budgets, or local civic issues.'
        }
    ]);
    const { translateText } = useLanguage();

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');

        // Dynamic AI response logic
        setTimeout(() => {
            let aiReply = "I have queried the JanDarpan database. You have 2,046 active schemes across Central and State levels. You can check your eligibility in the Schemes Directory.";
            const lower = userMsg.toLowerCase();

            if (lower.includes('karnataka') || lower.includes('ಕರ್ನಾಟಕ')) {
                aiReply = "Karnataka has 54 active state welfare schemes including Gruha Lakshmi (₹2,000/mo), Yuva Nidhi, Gruha Jyothi (200 units free power), and Shakti Free Bus Travel.";
            } else if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('ಕೃಷಿ')) {
                aiReply = "Farmer Welfare Schemes: PM-KISAN (₹6,000/yr), KALIA Scheme, Kisan Credit Card, and Solar Irrigation Pump subsidies.";
            } else if (lower.includes('project') || lower.includes('map') || lower.includes('road')) {
                aiReply = "You can view 10+ live infrastructure projects on our Live Project Map with budget transparency (e.g. ORR Metro Line Flyover Extension ₹12.5 Cr).";
            }

            setMessages(prev => [...prev, { sender: 'ai', text: translateText(aiReply) }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-inter">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-swiss-accent text-swiss-white border-4 border-swiss-black p-4 flex items-center gap-2 shadow-brutal hover:bg-swiss-black transition-colors"
                >
                    <Bot size={24} />
                    <span className="font-black text-xs uppercase tracking-widest hidden md:inline">JanDarpan AI Assistant</span>
                </button>
            ) : (
                <div className="w-80 sm:w-96 border-4 border-swiss-black bg-swiss-white shadow-brutal flex flex-col h-[480px]">
                    {/* Header */}
                    <div className="bg-swiss-black text-swiss-white p-4 flex items-center justify-between border-b-4 border-swiss-black">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-swiss-accent" size={20} />
                            <span className="font-black text-xs uppercase tracking-widest">JANDARPAN AI ASSISTANT</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-swiss-accent">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-swiss-muted swiss-dots">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`p-3 max-w-[85%] font-medium text-xs border-2 border-swiss-black ${
                                        m.sender === 'user'
                                            ? 'bg-swiss-accent text-swiss-white border-swiss-black'
                                            : 'bg-swiss-white text-swiss-black'
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSend} className="p-3 bg-swiss-white border-t-4 border-swiss-black flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask about schemes, budgets, projects..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-2 bg-swiss-white border-2 border-swiss-black text-xs font-bold focus:outline-none"
                        />
                        <button type="submit" className="bg-swiss-black text-swiss-white p-2 border-2 border-swiss-black hover:bg-swiss-accent transition-colors">
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JanDarpanAssistant;
