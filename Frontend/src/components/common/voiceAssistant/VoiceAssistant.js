import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Volume2, VolumeX, MessageCircle, ChevronRight, Compass, Shield, Zap, Sparkles, Navigation, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { toast } from 'react-hot-toast';
import './VoiceAssistant.css';

// Language code mapping for SpeechRecognition
const VOICE_LANG_MAP = {
    en: { code: 'en-IN', label: 'English', native: 'English' },
    hi: { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
    kn: { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
    ta: { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
    te: { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
    ml: { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' }
};

// Indian States for Dynamic Voice Filtering
const STATES_LIST = [
    "Karnataka", "Tamil Nadu", "Kerala", "Telangana", "Andhra Pradesh",
    "Maharashtra", "Gujarat", "Delhi", "Uttar Pradesh", "West Bengal",
    "Rajasthan", "Punjab", "Haryana", "Bihar", "Odisha", "Assam"
];

// Expanded Multilingual Intent & Action Dictionary
const INTENT_DICTIONARY = [
    // 🌐 DEMO MODE & SYSTEM ACTIONS
    {
        action: 'TRIGGER_DEMO',
        description: 'Start Demo Mode Walkthrough',
        patterns: ['demo mode', 'start demo', 'run demo', 'demo walkthrough', 'डेमो मोड', 'डेमो चालू करो', 'ಡೆಮೊ']
    },
    {
        action: 'OPEN_CHATBOT',
        description: 'Open AI Assistant Chatbot',
        patterns: ['open chatbot', 'ai assistant', 'open chat', 'chat bot', 'हेल्प', 'चैटबॉट', 'ಬಾಟ್']
    },
    {
        action: 'SCROLL_DOWN',
        description: 'Scroll Down Page',
        patterns: ['scroll down', 'go down', 'move down', 'नीचे करो', 'नीचे चलो', 'ಕೆಳಗೆ']
    },
    {
        action: 'SCROLL_TOP',
        description: 'Scroll to Top of Page',
        patterns: ['scroll top', 'go top', 'move up', 'top', 'ऊपर करो', 'ऊपर जाओ', 'ಮೇಲೆ']
    },

    // 🚀 FULL PAGE NAVIGATION
    {
        action: 'NAV_HOME',
        description: 'Navigate to Home Page',
        patterns: ['home', 'go home', 'main page', 'homepage', 'start', 'होम', 'मुख्य पृष्ठ', 'ಮನೆ', 'முகப்பு']
    },
    {
        action: 'NAV_SCHEMES',
        description: 'Explore All Schemes',
        patterns: ['schemes', 'yojana', 'all schemes', 'explore schemes', 'योजनाएं', 'सरकारी योजनाएं', 'ಯೋಜನೆಗಳು', 'திட்டங்கள்', 'పథకాలు']
    },
    {
        action: 'NAV_PROJECTS',
        description: 'View GPS Project Map & Money Trail',
        patterns: ['project map', 'map', 'projects', 'infrastructure', 'gps map', 'money trail', 'मानचित्र', 'नक्शा', 'प्रोजेक्ट', 'ನಕ್ಷೆ', 'வரைபடம்', 'మ్యాప్']
    },
    {
        action: 'NAV_REPORT',
        description: 'Open Civic Issue Reporting & Auto-PIL',
        patterns: ['report issue', 'civic report', 'file complaint', 'complain', 'pothole', 'substandard', 'शिकायत', 'रिपोर्ट', 'ದೂರು', 'புகார்']
    },
    {
        action: 'NAV_LEADERBOARD',
        description: 'View Contractor Honesty Leaderboard',
        patterns: ['leaderboard', 'honesty', 'contractor score', 'honesty leaderboard', 'लीडरबोर्ड', 'ईमानदारी', 'ಅಂಕಪಟ್ಟಿ']
    },
    {
        action: 'NAV_PROFILE',
        description: 'Open Citizen Account Profile',
        patterns: ['my profile', 'account', 'user profile', 'profile', 'प्रोफाइल', 'खाता', 'ಪ್ರೊಫೈಲ್']
    },
    {
        action: 'NAV_RECOMMENDATIONS',
        description: 'View Recommended Schemes',
        patterns: ['recommendations', 'recommended schemes', 'suggest schemes', 'फायदेमंद योजनाएं', 'ಸಲಹೆಗಳು']
    },
    {
        action: 'NAV_GOV_DASHBOARD',
        description: 'Open Government Officer Portal',
        patterns: ['gov dashboard', 'officer portal', 'government portal', 'pwd dashboard', 'ऑफिसर पोर्टल', 'सरकारी पोर्टल', 'ಅಧಿಕಾರಿ']
    },
    {
        action: 'NAV_GOV_LOGIN',
        description: 'Open Government Officer Login',
        patterns: ['officer login', 'gov login', 'government login', 'ऑफिसर लॉगिन']
    },
    {
        action: 'NAV_CONTRACTOR_PORTAL',
        description: 'Open Contractor Agent Portal',
        patterns: ['contractor portal', 'agent portal', ' ठेकेदार पोर्टल', 'ಏಜೆಂಟ್']
    },
    {
        action: 'NAV_CONTRACTOR_LOGIN',
        description: 'Open Contractor Agent Login',
        patterns: ['contractor login', 'agent login', 'ठेकेदार लॉगिन']
    },
    {
        action: 'NAV_LOGIN',
        description: 'Open Citizen Login',
        patterns: ['login', 'sign in', 'लॉगिन', 'ಲಾಗಿನ್']
    },
    {
        action: 'NAV_ABOUT',
        description: 'Open About Us Section',
        patterns: ['about us', 'about jandarpan', 'about', 'हमारे बारे में']
    },

    // 🎯 CATEGORY & DOMAIN SEARCHES
    {
        action: 'SEARCH_FARMING',
        description: 'Search Agriculture & Farming Schemes',
        patterns: ['farmer', 'farming', 'kisan', 'krishi', 'agriculture', 'crop', 'किसान', 'कृषि', 'फसल', 'ರೈತ', 'விவசாயி']
    },
    {
        action: 'SEARCH_EDUCATION',
        description: 'Search Education & Student Scholarships',
        patterns: ['education', 'scholarship', 'student', 'school', 'college', 'छात्रवृत्ति', 'शिक्षा', 'पढ़ाई', 'ಶಿಕ್ಷಣ', 'கல்வி']
    },
    {
        action: 'SEARCH_HEALTH',
        description: 'Search Health & Medical Schemes',
        patterns: ['health', 'medical', 'hospital', 'ayushman', 'doctor', 'स्वास्थ्य', 'अस्पताल', 'इलाज', 'ಆರೋಗ್ಯ', 'சுகாதார']
    },
    {
        action: 'SEARCH_WOMEN',
        description: 'Search Women & Child Schemes',
        patterns: ['women', 'mahila', 'girl child', 'maternity', 'ladli', 'महिला', 'बेटी', 'गर्भवती', 'ಮಹಿಳೆ', 'பெண்கள்']
    },
    {
        action: 'SEARCH_HOUSING',
        description: 'Search Housing & Shelter Schemes',
        patterns: ['housing', 'home', 'awas', 'shelter', 'house loan', 'आवास', 'मकान', 'घर', 'ಮನೆ']
    },
    {
        action: 'SEARCH_EMPLOYMENT',
        description: 'Search Employment & Skill Schemes',
        patterns: ['job', 'employment', 'skill', 'rozgar', 'business loan', 'रोजगार', 'नौकरी', 'उद्योग', 'ಉದ್ಯೋಗ']
    }
];

const VoiceAssistant = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentLanguage, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [voiceLang, setVoiceLang] = useState(currentLanguage || 'en');
    const [lastAction, setLastAction] = useState('');
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Initialize SpeechRecognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const result = event.results[current];
                const text = result[0].transcript;

                setTranscript(text);

                if (result.isFinal) {
                    processVoiceCommand(text);
                }
            };

            recognition.onerror = (event) => {
                console.warn("Voice recognition error:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Sync recognition language
    useEffect(() => {
        if (recognitionRef.current) {
            const langConfig = VOICE_LANG_MAP[voiceLang] || VOICE_LANG_MAP.en;
            recognitionRef.current.lang = langConfig.code;
        }
    }, [voiceLang]);

    useEffect(() => {
        if (currentLanguage && VOICE_LANG_MAP[currentLanguage]) {
            setVoiceLang(currentLanguage);
        }
    }, [currentLanguage]);

    // Text-to-Speech Output
    const speak = useCallback((text) => {
        if (!synthRef.current) return;
        
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const langConfig = VOICE_LANG_MAP[voiceLang] || VOICE_LANG_MAP.en;
        utterance.lang = langConfig.code;
        utterance.rate = 0.95;
        utterance.pitch = 1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        synthRef.current.speak(utterance);
    }, [voiceLang]);

    // Full Intelligent Intent & Command Processor
    const processVoiceCommand = useCallback((text) => {
        const lower = text.toLowerCase().trim();
        
        // 1. Check for Language Switch Intent
        if (lower.includes('hindi') || lower.includes('हिंदी')) {
            changeLanguage('hi');
            setVoiceLang('hi');
            speak("भाषा बदलकर हिंदी कर दी गई है");
            toast.success("🌐 Voice Switched to Hindi");
            return;
        }
        if (lower.includes('kannada') || lower.includes('ಕನ್ನಡ')) {
            changeLanguage('kn');
            setVoiceLang('kn');
            speak("ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ");
            toast.success("🌐 Voice Switched to Kannada");
            return;
        }
        if (lower.includes('english')) {
            changeLanguage('en');
            setVoiceLang('en');
            speak("Switched language to English");
            toast.success("🌐 Voice Switched to English");
            return;
        }

        // 2. Check for Dynamic State Intent (e.g. "Karnataka", "Delhi", "Tamil Nadu")
        const matchedState = STATES_LIST.find(s => lower.includes(s.toLowerCase()));
        if (matchedState && (lower.includes('scheme') || lower.includes('yojana') || lower.includes('find') || lower.includes('show'))) {
            setLastAction(`State Filter: ${matchedState}`);
            speak(`Showing government schemes in ${matchedState}`);
            toast.success(`🎤 Showing Schemes in ${matchedState}`);
            navigate(`/schemes?state=${encodeURIComponent(matchedState)}`);
            return;
        }

        // 3. Match Static Intent Dictionary
        let matchedIntent = null;
        for (const item of INTENT_DICTIONARY) {
            if (item.patterns.some(pattern => lower.includes(pattern))) {
                matchedIntent = item;
                break;
            }
        }

        if (matchedIntent) {
            setLastAction(matchedIntent.description);

            switch (matchedIntent.action) {
                // System Actions
                case 'TRIGGER_DEMO':
                    speak("Starting 5-Act Interactive Demo Mode");
                    toast.success("🎭 Demo Mode Triggered via Voice");
                    const demoBtn = document.querySelector('.demo-toggle-btn');
                    if (demoBtn) demoBtn.click();
                    break;

                case 'OPEN_CHATBOT':
                    speak("Opening JanDarpan AI Chatbot Assistant");
                    toast.success("🤖 Opening AI Chatbot");
                    const chatBtn = document.querySelector('.fixed.bottom-6.right-6 button');
                    if (chatBtn) chatBtn.click();
                    break;

                case 'SCROLL_DOWN':
                    speak("Scrolling down page");
                    window.scrollBy({ top: 500, behavior: 'smooth' });
                    break;

                case 'SCROLL_TOP':
                    speak("Scrolling to top of page");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;

                // Page Navigations
                case 'NAV_HOME':
                    speak("Navigating to home page");
                    toast.success("🎤 Going to Home");
                    navigate('/');
                    break;

                case 'NAV_SCHEMES':
                    speak("Opening scheme explorer with 4,290 government schemes");
                    toast.success("🎤 Opening Scheme Explorer");
                    navigate('/schemes');
                    break;

                case 'NAV_PROJECTS':
                    speak("Opening interactive infrastructure project map and money trail");
                    toast.success("🎤 Opening Project Map & Money Trail");
                    navigate('/projects');
                    break;

                case 'NAV_REPORT':
                    speak("Opening civic issue reporting and legal notice portal");
                    toast.success("🎤 Opening Civic Reporting");
                    navigate('/report-issue');
                    break;

                case 'NAV_LEADERBOARD':
                    speak("Opening contractor honesty leaderboard");
                    toast.success("🎤 Opening Honesty Leaderboard");
                    navigate('/honesty-leaderboard');
                    break;

                case 'NAV_PROFILE':
                    speak("Opening your citizen account profile");
                    toast.success("🎤 Opening Account Profile");
                    navigate('/profile');
                    break;

                case 'NAV_RECOMMENDATIONS':
                    speak("Opening scheme recommendations tailored for you");
                    toast.success("🎤 Opening Recommendations");
                    navigate('/recommendations');
                    break;

                case 'NAV_GOV_DASHBOARD':
                    speak("Opening Government Officer Sanction Portal");
                    toast.success("🎤 Opening Government Dashboard");
                    navigate('/gov-dashboard');
                    break;

                case 'NAV_GOV_LOGIN':
                    speak("Opening Government Officer Login");
                    toast.success("🎤 Opening Officer Login");
                    navigate('/officer-login');
                    break;

                case 'NAV_CONTRACTOR_PORTAL':
                    speak("Opening Contractor Agent Spending Portal");
                    toast.success("🎤 Opening Contractor Portal");
                    navigate('/contractor-portal');
                    break;

                case 'NAV_CONTRACTOR_LOGIN':
                    speak("Opening Contractor Agent Login");
                    toast.success("🎤 Opening Contractor Login");
                    navigate('/contractor-login');
                    break;

                case 'NAV_LOGIN':
                    speak("Opening citizen login page");
                    toast.success("🎤 Opening Citizen Login");
                    navigate('/login');
                    break;

                case 'NAV_ABOUT':
                    speak("Opening About JanDarpan AI section");
                    toast.success("🎤 Opening About Us");
                    navigate('/about');
                    break;

                // Domain Searches
                case 'SEARCH_FARMING':
                    speak("Showing agriculture and farmer welfare schemes");
                    toast.success("🌾 Agriculture Schemes");
                    navigate('/schemes?category=Agriculture,Rural%20%26%20Environment');
                    break;

                case 'SEARCH_EDUCATION':
                    speak("Showing education and student scholarship schemes");
                    toast.success("🎓 Education Schemes");
                    navigate('/schemes?category=Education%20%26%20Learning');
                    break;

                case 'SEARCH_HEALTH':
                    speak("Showing healthcare and hospitalization schemes");
                    toast.success("🏥 Health Schemes");
                    navigate('/schemes?category=Health%20%26%20Wellness');
                    break;

                case 'SEARCH_WOMEN':
                    speak("Showing women and child development schemes");
                    toast.success("👩 Women & Child Schemes");
                    navigate('/schemes?category=Women%20and%20Child');
                    break;

                case 'SEARCH_HOUSING':
                    speak("Showing housing and urban shelter schemes");
                    toast.success("🏠 Housing Schemes");
                    navigate('/schemes?category=Housing%20%26%20Shelter');
                    break;

                case 'SEARCH_EMPLOYMENT':
                    speak("Showing employment, skills, and business loan schemes");
                    toast.success("💼 Employment Schemes");
                    navigate('/schemes?category=Skills%20%26%20Employment');
                    break;

                default:
                    speak(`Searching for ${text}`);
                    navigate(`/schemes?search=${encodeURIComponent(text)}`);
            }
            return;
        }

        // 4. Dynamic Fallback Search
        setLastAction(`Voice Query: "${text}"`);
        speak(`Searching schemes for ${text}`);
        toast.success(`🎤 Searching: "${text}"`);
        navigate(`/schemes?search=${encodeURIComponent(text)}`);

    }, [navigate, speak, changeLanguage]);

    // Toggle Listening
    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                setTranscript('');
                setLastAction('');
                recognitionRef.current.start();
                setIsListening(true);
                toast.loading("🎤 Voice Control Active — Speak any command...", { id: "voice", duration: 5000 });
            } catch (err) {
                setIsListening(false);
                console.error("Voice start error:", err);
            }
        }
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const activeVoiceLang = VOICE_LANG_MAP[voiceLang] || VOICE_LANG_MAP.en;

    return (
        <div className="voice-assistant-container">
            {/* Floating Panel */}
            {isOpen && (
                <div className="voice-panel">
                    {/* Header */}
                    <div className="voice-panel-header">
                        <h4>
                            <Zap size={14} className="accent" />
                            <span>FULL VOICE <span className="accent">CONTROL HUB</span></span>
                        </h4>
                        <button onClick={() => setIsOpen(false)} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={16} />
                        </button>
                    </div>

                    <div className="voice-panel-body">
                        {/* Language Selector */}
                        <div className="voice-lang-selector">
                            {Object.entries(VOICE_LANG_MAP).map(([key, lang]) => (
                                <button
                                    key={key}
                                    className={`voice-lang-btn ${voiceLang === key ? 'active' : ''}`}
                                    onClick={() => {
                                        setVoiceLang(key);
                                        changeLanguage(key);
                                    }}
                                >
                                    {lang.native}
                                </button>
                            ))}
                        </div>

                        {/* Waveform Animation */}
                        {isListening && (
                            <div className="voice-waveform">
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                        )}

                        {/* TTS Indicator */}
                        {isSpeaking && (
                            <div style={{ marginTop: 8, display: 'flex', itemsCenter: 'center', justifyContent: 'space-between' }}>
                                <div className="voice-tts-badge">
                                    <Volume2 size={10} /> SPEAKING VOICE CONFIRMATION...
                                </div>
                                <button 
                                    onClick={stopSpeaking}
                                    style={{ background: 'none', border: '2px solid #000', padding: '2px 8px', fontSize: '9px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}
                                >
                                    <VolumeX size={10} /> STOP
                                </button>
                            </div>
                        )}

                        {/* Transcript */}
                        {transcript && (
                            <div className="voice-transcript">
                                <MessageCircle size={14} className="icon" />
                                <span>"{transcript}"</span>
                            </div>
                        )}

                        {/* Last Action */}
                        {lastAction && (
                            <div style={{ marginTop: 6, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#FF3B00', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Sparkles size={12} /> {lastAction}
                            </div>
                        )}

                        {/* Main Action Button */}
                        <button
                            onClick={toggleListening}
                            style={{
                                width: '100%',
                                marginTop: 12,
                                padding: '14px',
                                background: isListening ? '#FF3B00' : '#000',
                                color: '#fff',
                                border: '3px solid #000',
                                fontWeight: 900,
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                transition: 'all 0.15s'
                            }}
                        >
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            {isListening ? 'STOP LISTENING' : `LISTEN ANY VOICE COMMAND (${activeVoiceLang.native})`}
                        </button>

                        {/* Full Voice Command Control Guide */}
                        <div className="voice-commands">
                            <h5>FULL APPLICATION VOICE COMMANDS</h5>
                            <div className="voice-command-item">
                                <ChevronRight size={10} style={{ color: '#FF3B00' }} />
                                <span>"<span className="cmd">Go to project map</span>" / "<span className="cmd">मानचित्र</span>"</span>
                            </div>
                            <div className="voice-command-item">
                                <ChevronRight size={10} style={{ color: '#FF3B00' }} />
                                <span>"<span className="cmd">Open government portal</span>"</span>
                            </div>
                            <div className="voice-command-item">
                                <ChevronRight size={10} style={{ color: '#FF3B00' }} />
                                <span>"<span className="cmd">Start demo mode</span>"</span>
                            </div>
                            <div className="voice-command-item">
                                <ChevronRight size={10} style={{ color: '#FF3B00' }} />
                                <span>"<span className="cmd">Report civic issue</span>"</span>
                            </div>
                            <div className="voice-command-item">
                                <ChevronRight size={10} style={{ color: '#FF3B00' }} />
                                <span>"<span className="cmd">Show schemes in Karnataka</span>"</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Mic Button */}
            <button
                className={`voice-fab ${isListening ? 'listening' : ''}`}
                onClick={() => {
                    if (!isOpen) {
                        setIsOpen(true);
                    } else {
                        toggleListening();
                    }
                }}
                title="Full Voice Control — Speak any page or action command"
            >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
        </div>
    );
};

export default VoiceAssistant;
