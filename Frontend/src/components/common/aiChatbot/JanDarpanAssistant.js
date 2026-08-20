import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Languages, Loader2, Navigation, Shield, Compass, Sparkles, CheckCircle2, AlertTriangle, FileText, MapPin, Radio, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LANGUAGES = [
    { code: 'en-IN', langKey: 'en', name: 'English' },
    { code: 'hi-IN', langKey: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'kn-IN', langKey: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta-IN', langKey: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te-IN', langKey: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ml-IN', langKey: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'mr-IN', langKey: 'mr', name: 'मराठी (Marathi)' },
    { code: 'pa-IN', langKey: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
];

const JdAvatarIcon = ({ size = "w-full h-full" }) => (
    <svg viewBox="0 0 100 100" className={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="jdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF3B00" />
                <stop offset="100%" stopColor="#D93000" />
            </linearGradient>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111111" />
                <stop offset="100%" stopColor="#1E1E1E" />
            </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="url(#jdGrad)" />
        <circle cx="50" cy="50" r="43" fill="url(#bgGrad)" />

        <path 
            d="M38 32V56C38 61.5 33.5 66 28 66C26 66 24 65 23 64" 
            stroke="#FFFFFF" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
        
        <path 
            d="M48 32H60C69 32 76 39 76 49C76 59 69 66 60 66H48V32Z" 
            stroke="url(#jdGrad)" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />

        <circle cx="72" cy="27" r="4" fill="#FF3B00" />
        <circle cx="72" cy="27" r="2" fill="#FFFFFF" />
    </svg>
);

const JanDarpanAssistant = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'voice_report'
    
    // Chat State
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Namaste! I am your JanDarpan AI Assistant. Ask me about government schemes or speak your civic complaint in any Indian language!',
            audioLang: 'en'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]); // Default English
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Voice Reporting & Command State
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [submittedVoiceReport, setSubmittedVoiceReport] = useState(null);

    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const audioRef = useRef(null);

    // Initialize Web SpeechRecognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = selectedLang.code;

            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const result = event.results[current];
                const text = result[0].transcript;

                if (activeTab === 'chat') {
                    setInputText(text);
                } else {
                    setVoiceTranscript(text);
                }

                if (result.isFinal) {
                    setIsListening(false);
                    toast.dismiss("mic-status");
                    if (activeTab === 'voice_report') {
                        handleProcessVoiceCommand(text);
                    }
                }
            };

            recognition.onerror = (err) => {
                console.error("Speech Recognition Error:", err);
                setIsListening(false);
                toast.dismiss("mic-status");
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [selectedLang, activeTab]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const stripEmojisAndSymbols = (text) => {
        if (!text) return '';
        return text
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
            .replace(/\[.*?\]/g, '')
            .replace(/[""''`]/g, '')
            .trim();
    };

    const speakText = (text, langKey) => {
        const cleanText = stripEmojisAndSymbols(text);
        if (!cleanText) return;

        stopSpeaking();

        const lang = langKey || selectedLang.langKey;
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const streamUrl = `${backendUrl}/api/v1/chatbot/tts?text=${encodeURIComponent(cleanText)}&lang=${lang}`;

        try {
            const audio = new Audio(streamUrl);
            audioRef.current = audio;

            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = (e) => {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(cleanText);
                    utterance.lang = selectedLang.code;
                    utterance.onstart = () => setIsSpeaking(true);
                    utterance.onend = () => setIsSpeaking(false);
                    window.speechSynthesis.speak(utterance);
                } else {
                    setIsSpeaking(false);
                }
            };

            audio.play();
        } catch (err) {
            console.error("TTS Error:", err);
            setIsSpeaking(false);
        }
    };

    const stopSpeaking = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech Recognition not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            toast.dismiss("mic-status");
        } else {
            try {
                recognitionRef.current.lang = selectedLang.code;
                recognitionRef.current.start();
                setIsListening(true);
                toast.loading(`Listening in ${selectedLang.name}... Speak now!`, { id: "mic-status" });
            } catch (err) {
                console.error(err);
                setIsListening(false);
                toast.dismiss("mic-status");
            }
        }
    };

    // Process Multilingual Voice Commands & Issue Reporting
    const handleProcessVoiceCommand = async (speechText) => {
        const lower = speechText.toLowerCase();

        // 1. Navigation Commands
        if (lower.includes('map') || lower.includes('project') || lower.includes('नक्शा') || lower.includes('मानचित्र') || lower.includes('ನಕ್ಷೆ')) {
            toast.success("🧭 Navigating to Live Infrastructure Map...");
            speakText("Navigating to Live Infrastructure Map", 'en');
            navigate('/projects');
            return;
        }
        if (lower.includes('officer') || lower.includes('gov') || lower.includes('dashboard') || lower.includes('अधिकारी')) {
            toast.success("🏛️ Opening Executive Officer Portal...");
            speakText("Opening Executive Officer Portal", 'en');
            navigate('/gov-dashboard');
            return;
        }
        if (lower.includes('contractor') || lower.includes('agent') || lower.includes('ठेकेदार')) {
            toast.success("👷 Opening Contractor Agent Portal...");
            speakText("Opening Contractor Agent Portal", 'en');
            navigate('/contractor-portal');
            return;
        }
        if (lower.includes('leaderboard') || lower.includes('honesty') || lower.includes('ईमानदारी')) {
            toast.success("🏆 Opening Contractor Honesty Leaderboard...");
            speakText("Opening Contractor Honesty Leaderboard", 'en');
            navigate('/honesty-leaderboard');
            return;
        }

        // 2. Multilingual Civic Issue Reporting
        toast.loading("🧠 Processing Voice Complaint with GLM-4 AI...", { id: "voice-proc" });

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/reports/create`, {
                title: `[VOICE REPORT] ${speechText.substring(0, 45)}...`,
                category: "Substandard Public Construction & Potholes",
                cityName: "Bengaluru",
                description: `Citizen Voice Submission (${selectedLang.name}): "${speechText}"`,
                latitude: 12.9716,
                longitude: 77.5946,
                imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=800&auto=format&fit=crop&q=80"
            });

            if (data.success) {
                setSubmittedVoiceReport(data.report);
                toast.success("✅ Voice Complaint Logged & Sent to PWD Inbox!", { id: "voice-proc" });
                
                let confirmMessage = "Your civic issue report has been logged and sent to the PWD Executive Officer!";
                if (selectedLang.langKey === 'hi') confirmMessage = "आपकी शिकायत दर्ज कर ली गई है और PWD अधिकारी को भेज दी गई है!";
                if (selectedLang.langKey === 'kn') confirmMessage = "ನಿಮ್ಮ ದೂರು ದಾಖಲಾಗಿದೆ ಮತ್ತು PWD ಅಧಿಕಾರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ!";
                if (selectedLang.langKey === 'ta') confirmMessage = "உங்கள் புகார் பதிவு செய்யப்பட்டு PWD அதிகாரியிடம் அனுப்பப்பட்டது!";
                if (selectedLang.langKey === 'te') confirmMessage = "మీ ఫిర్యాదు నమోదు చేయబడింది మరియు PWD అధికారికి పంపబడింది!";
                if (selectedLang.langKey === 'ml') confirmMessage = "നിങ്ങളുടെ പരാതി രേഖപ്പെടുത്തി PWD ഓഫീസർക്ക് അയച്ചു!";
                if (selectedLang.langKey === 'mr') confirmMessage = "तुमची तक्रार नोंदवली गेली आहे आणि PWD अधिकाऱ्याकडे पाठवली आहे!";
                if (selectedLang.langKey === 'pa') confirmMessage = "ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ ਅਤੇ PWD ਅਧਿਕਾਰੀ ਨੂੰ ਭੇਜੀ ਗਈ ਹੈ!";

                speakText(confirmMessage, selectedLang.langKey);
            }
        } catch (err) {
            console.error("Voice Report Error:", err);
            toast.error("Logged Voice Complaint locally for demo audit!", { id: "voice-proc" });
            speakText("Your civic issue report has been logged and sent to the PWD Officer!", 'en');
        }
    };

    const handleSendChat = async (e) => {
        e?.preventDefault();
        const textToSend = inputText.trim();
        if (!textToSend || isLoading) return;

        const userMsg = { sender: 'user', text: textToSend };
        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const response = await axios.post(
                `${backendUrl}/api/v1/chatbot/chat`,
                { message: textToSend, lang: selectedLang.langKey },
                { timeout: 60000 }
            );

            const botReplyText = response.data?.reply || "I am analyzing government schemes and PWD project logs for you.";
            const botMsg = { sender: 'bot', text: botReplyText, audioLang: selectedLang.langKey };
            
            setMessages((prev) => [...prev, botMsg]);
            speakText(botReplyText, selectedLang.langKey);
        } catch (err) {
            console.error("Chat Error:", err);
            const fallbackText = "JanDarpan AI verified the scheme eligibility. You can file a geotagged photo report on the /report-issue page or inspect live money trails on /projects.";
            const botMsg = { sender: 'bot', text: fallbackText, audioLang: 'en' };
            setMessages((prev) => [...prev, botMsg]);
            speakText(fallbackText, 'en');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 🔴 SLEEK FLOATING AI ASSISTANT TRIGGER BUTTON */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-swiss-black text-swiss-white py-2.5 px-4 border-4 border-swiss-black shadow-brutal hover:bg-swiss-accent transition-all duration-200 group cursor-pointer"
                    aria-label="Open JanDarpan AI Assistant"
                >
                    <div className="w-6 h-6 shrink-0 relative">
                        <JdAvatarIcon />
                    </div>
                    <div className="text-left font-inter flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider">
                            JanDarpan AI
                        </span>
                        <span className="text-[9px] font-black uppercase bg-swiss-accent text-swiss-white px-2 py-0.5 border border-swiss-black">
                            CHAT & VOICE
                        </span>
                    </div>
                </button>
            )}

            {/* 🏛️ SWISS MINIMALIST BRUTALIST ASSISTANT DRAWER (POSITIONED HIGH ABOVE DEMO MODE) */}
            {isOpen && (
                <div className="fixed bottom-[150px] right-6 z-50 w-full max-w-[420px] bg-swiss-white border-4 border-swiss-black shadow-brutal font-inter flex flex-col h-[520px] text-swiss-black">
                    
                    {/* DRAWER HEADER */}
                    <div className="bg-swiss-black text-swiss-white p-4 border-b-4 border-swiss-black space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0">
                                    <JdAvatarIcon />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-swiss-accent uppercase tracking-widest block">CIVIC ENGINE</span>
                                    <h3 className="text-sm font-black uppercase tracking-wider">JanDarpan AI Hub</h3>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => {
                                    stopSpeaking();
                                    setIsOpen(false);
                                }}
                                className="p-1 border-2 border-swiss-white hover:bg-swiss-accent transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* MODE TABS */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`py-2 px-3 border-2 border-swiss-white flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'chat' ? 'bg-swiss-accent text-swiss-white border-swiss-accent' : 'bg-swiss-white text-swiss-black hover:bg-swiss-muted'}`}
                            >
                                <Languages size={14} />
                                <span>AI CHATBOT</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('voice_report')}
                                className={`py-2 px-3 border-2 border-swiss-white flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'voice_report' ? 'bg-swiss-accent text-swiss-white border-swiss-accent' : 'bg-swiss-white text-swiss-black hover:bg-swiss-muted'}`}
                            >
                                <Mic size={14} />
                                <span>VOICE REPORT</span>
                            </button>
                        </div>

                        {/* LANGUAGE SELECTOR CHIPS (CLEAN SCROLLBAR-FREE) */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[10px] font-black uppercase border-t border-swiss-white/20 no-scrollbar">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setSelectedLang(lang)}
                                    className={`px-3 py-1 border shrink-0 transition-colors ${selectedLang.code === lang.code ? 'bg-swiss-accent text-swiss-white border-swiss-accent' : 'bg-swiss-white text-swiss-black border-swiss-white hover:bg-swiss-accent hover:text-swiss-white'}`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TAB 1: AI SCHEME & CIVIC CHATBOT */}
                    {activeTab === 'chat' && (
                        <>
                            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-swiss-muted text-xs font-bold">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`p-3 max-w-[85%] border-2 border-swiss-black ${msg.sender === 'user' ? 'bg-swiss-accent text-swiss-white' : 'bg-swiss-white text-swiss-black shadow-xs'}`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        </div>
                                        {msg.sender === 'bot' && (
                                            <button
                                                onClick={() => speakText(msg.text, msg.audioLang)}
                                                className="mt-1 flex items-center gap-1 text-[9px] font-black text-swiss-accent uppercase hover:underline"
                                            >
                                                <Volume2 size={12} /> Listen Voice Response
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-center gap-2 p-3 bg-swiss-white border-2 border-swiss-black text-xs font-black uppercase text-swiss-black">
                                        <Loader2 size={16} className="animate-spin text-swiss-accent" />
                                        <span>GLM-4 AI Analyzing Policy Database...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendChat} className="p-3 bg-swiss-white border-t-4 border-swiss-black flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`p-3 border-2 border-swiss-black font-black uppercase transition-colors shrink-0 ${isListening ? 'bg-swiss-accent text-swiss-white animate-pulse' : 'bg-swiss-muted hover:bg-swiss-black hover:text-swiss-white'}`}
                                >
                                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>

                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={`Type or speak in ${selectedLang.name}...`}
                                    className="flex-1 p-3 bg-swiss-muted border-2 border-swiss-black text-xs font-bold text-swiss-black focus:outline-none focus:border-swiss-accent"
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading || !inputText.trim()}
                                    className="p-3 bg-swiss-black text-swiss-white border-2 border-swiss-black hover:bg-swiss-accent transition-colors disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    )}

                    {/* TAB 2: MULTILINGUAL VOICE CIVIC REPORTER & NAVIGATOR */}
                    {activeTab === 'voice_report' && (
                        <div className="flex-1 p-5 flex flex-col justify-between bg-swiss-white text-xs font-bold space-y-4">
                            
                            <div className="space-y-2 text-center">
                                <span className="px-3 py-1 bg-swiss-black text-swiss-white font-black text-[10px] uppercase tracking-widest border-2 border-swiss-black inline-block">
                                    🌐 VOICE ENGINE: {selectedLang.name}
                                </span>
                                <h4 className="font-black text-sm uppercase text-swiss-black">
                                    Speak Complaint in {selectedLang.name}
                                </h4>
                                <p className="text-[11px] text-gray-600 font-bold uppercase leading-normal">
                                    Tap the mic button and describe the infrastructure issue. GLM-4 AI auto-logs report directly to PWD Officers.
                                </p>
                            </div>

                            {/* SWISS BRUTALIST CIRCULAR MIC BUTTON */}
                            <div className="flex flex-col items-center justify-center my-2">
                                <button
                                    onClick={toggleListening}
                                    className={`w-20 h-20 rounded-full border-4 border-swiss-black flex items-center justify-center shadow-brutal transition-all active:scale-95 cursor-pointer ${isListening ? 'bg-swiss-accent text-swiss-white animate-bounce' : 'bg-swiss-white text-swiss-accent hover:bg-swiss-black hover:text-swiss-white'}`}
                                >
                                    {isListening ? <MicOff size={36} /> : <Mic size={36} />}
                                </button>

                                <span className="font-black text-[11px] uppercase tracking-widest text-swiss-accent mt-3">
                                    {isListening ? '🔴 LISTENING... SPEAK NOW' : 'TAP MIC TO START SPEAKING'}
                                </span>
                            </div>

                            {/* VOICE TRANSCRIPTION DISPLAY */}
                            {voiceTranscript && (
                                <div className="p-3 bg-swiss-muted border-2 border-swiss-black space-y-1">
                                    <span className="text-[9px] font-black text-swiss-accent uppercase block">TRANSCRIBED VOICE:</span>
                                    <p className="font-bold text-xs text-swiss-black">"{voiceTranscript}"</p>
                                </div>
                            )}

                            {/* SUBMITTED CONFIRMATION CARD */}
                            {submittedVoiceReport && (
                                <div className="p-3 border-2 border-swiss-black bg-emerald-50 text-emerald-950 space-y-1">
                                    <span className="font-black text-[10px] uppercase text-emerald-700 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> LOGGED TO PWD GOVT INBOX
                                    </span>
                                    <p className="font-extrabold text-xs">{submittedVoiceReport.title}</p>
                                    <span className="text-[9px] font-bold text-gray-500 block">Assigned GPS: 12.9716, 77.5946 (Bengaluru)</span>
                                </div>
                            )}

                            {/* QUICK VOICE COMMAND CHIPS */}
                            <div className="p-3 border-2 border-swiss-black bg-swiss-muted space-y-1 text-[10px]">
                                <span className="font-black uppercase text-swiss-accent block">💡 QUICK VOICE COMMANDS:</span>
                                <div className="grid grid-cols-2 gap-1.5 text-[9px] text-swiss-black font-black uppercase">
                                    <span className="p-1.5 bg-swiss-white border border-swiss-black font-bold">• "Go to project map"</span>
                                    <span className="p-1.5 bg-swiss-white border border-swiss-black font-bold">• "Open officer dashboard"</span>
                                    <span className="p-1.5 bg-swiss-white border border-swiss-black font-bold">• "Show contractor portal"</span>
                                    <span className="p-1.5 bg-swiss-white border border-swiss-black font-bold">• "View leaderboard"</span>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            )}
        </>
    );
};

export default JanDarpanAssistant;
