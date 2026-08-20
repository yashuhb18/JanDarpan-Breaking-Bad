import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Square, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SchemeAudioExplainer = ({ scheme }) => {
    const [selectedLang, setSelectedLang] = useState('kn-IN');
    const [isPlaying, setIsPlaying] = useState(false);
    const [speechText, setSpeechText] = useState('');
    const audioRef = useRef(null);

    const LANGUAGES = [
        { code: 'kn-IN', langCode: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
        { code: 'ta-IN', langCode: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
        { code: 'hi-IN', langCode: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
        { code: 'te-IN', langCode: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
        { code: 'en-IN', langCode: 'en', name: 'English', flag: '🇬🇧' }
    ];

    // DYNAMIC SCHEME VOICE GENERATOR - Pulls exact scheme title, ministry, and state for each scheme!
    const getDynamicSchemeExplanation = (langCode, schemeObj) => {
        const title = schemeObj?.schemeName || "ಸರ್ಕಾರಿ ಯೋಜನೆ (Welfare Scheme)";
        const ministry = schemeObj?.nodalMinistryName || schemeObj?.state || "ಸರ್ಕಾರ";
        const state = schemeObj?.state || "ಭಾರತ";

        if (langCode === 'kn-IN') {
            return `ನಮಸ್ಕಾರ! ಈ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಪ್ರಮುಖ ವಿವರ ಇಲ್ಲಿದೆ.

ಈ ಯೋಜನೆಯ ಹೆಸರು ${title}. ಇದನ್ನು ${ministry} ಇಲಾಖೆಯು ${state} ರಾಜ್ಯದಲ್ಲಿ ಜಾರಿಗೆ ತಂದಿದೆ.

ಪ್ರಮುಖ ಸೌಲಭ್ಯ: ಈ ಯೋಜನೆಯಡಿ ಅರ್ಹ ನಾಗರಿಕರಿಗೆ ನೇರ ಹಣಕಾಸಿನ ನೆರವು ಮತ್ತು ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು ಲಭ್ಯವಿವೆ.

ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅಗತ್ಯ ದಾಖಲೆಗಳು: ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್, ರೇಷನ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಖಾತೆ ಪುಸ್ತಕ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ.

ನೀವು ನಿಮ್ಮ ಹತ್ತಿರದ ಸೇವಾ ಕೇಂದ್ರದಲ್ಲಿ ಅಥವಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.`;

        } else if (langCode === 'ta-IN') {
            return `வணக்கம்! இத்திட்டத்தின் முக்கியமான விவரங்கள் இதோ.

இத்திட்டத்தின் பெயர் ${title}. இது ${ministry} துறையால் ${state} மாநிலத்தில் செயல்படுத்தப்படுகிறது.

முக்கிய பயன்: இத்திட்டத்தின் கீழ் தகுதியுள்ள குடிமக்களுக்கு நேரடி நிதி உதவி மற்றும் அரசு மானியம் வழங்கப்படுகிறது.

விண்ணப்பிக்க தேவையான ஆவணங்கள்: ஆதார் அட்டை, ரேஷன் கார்டு, வங்கி கணக்கு புத்தகம் மற்றும் வருமான சான்றிதழ்.

அருகில் உள்ள இ-சேவை மையம் அல்லது அதிகாரப்பூர்வ இணையதளம் மூலம் உடனடியாக விண்ணப்பிக்கலாம்.`;

        } else if (langCode === 'hi-IN') {
            return `नमस्ते! इस सरकारी योजना का विस्तृत विवरण निम्नलिखित है।

इस योजना का नाम ${title} है। इसे ${ministry} द्वारा ${state} में संचालित किया जा रहा है।

मुख्य लाभ: इस योजना के अंतर्गत पात्र नागरिकों को प्रत्यक्ष वित्तीय सहायता और सरकारी सब्सिडी दी जाती है।

आवश्यक दस्तावेज: आधार कार्ड, राशन कार्ड, बैंक पासबुक एवं आय प्रमाण पत्र।

आप अपने नजदीकी जन सेवा केंद्र या आधिकारिक पोर्टल से आवेदन कर सकते हैं।`;

        } else if (langCode === 'te-IN') {
            return `నమస్కారం! ఈ ప్రభుత్వ పథకం ముఖ్య వివరాలు ఇవే.

ఈ పథకం పేరు ${title}. దీనిని ${ministry} విభాగం ${state}లో అమలు చేస్తోంది.

ముఖ్య ప్రయోజనం: అర్హులైన పౌరులకు నేరుగా ఆర్థిక సహాయం మరియు ప్రభుత్వ సబ్సిడీ లభిస్తుంది.

అవసరమైన పత్రాలు: ఆధార్ కార్డ్, రేషన్ కార్డ్, బ్యాంక్ పాస్‌బుక్ మరియు ఆదాయ ధృవీకరణ పత్రం.

సమీప మీసేవ కేంద్రంలో లేదా అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోవచ్చు.`;

        } else {
            return `Hello! Here are the official specification details for ${title}.

Administered by ${ministry} in ${state}.

Key Benefits: Provides direct financial assistance and subsidized government support to all eligible applicants.

Required Verification Documents: Aadhaar card, ration card, income certificate, and bank account passbook.

You can apply online via the official portal or your local government service center.`;
        }
    };

    useEffect(() => {
        if (scheme) {
            setSpeechText(getDynamicSchemeExplanation(selectedLang, scheme));
        }
    }, [selectedLang, scheme]);

    const handleStopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
    };

    const handlePlayAudio = () => {
        if (isPlaying) {
            handleStopAudio();
            return;
        }

        const currentLangObj = LANGUAGES.find(l => l.code === selectedLang);
        const textToSpeak = getDynamicSchemeExplanation(selectedLang, scheme);

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const ttsUrl = `${backendUrl}/api/v1/voice/tts?text=${encodeURIComponent(textToSpeak)}&lang=${currentLangObj.langCode}`;
            const audio = new Audio(ttsUrl);
            audioRef.current = audio;

            audio.onplay = () => {
                setIsPlaying(true);
                toast.success(`🔊 Playing Voice for ${scheme?.schemeName || 'Scheme'} (${currentLangObj.name})`, { id: 'audio-play' });
            };

            audio.onended = () => setIsPlaying(false);
            audio.onerror = (err) => {
                console.warn("Proxy TTS stream error:", err);
                fallbackWebSpeech(textToSpeak, currentLangObj);
            };

            audio.play().catch((err) => {
                console.warn("Audio play catch error:", err);
                fallbackWebSpeech(textToSpeak, currentLangObj);
            });

        } catch (err) {
            fallbackWebSpeech(textToSpeak, currentLangObj);
        }
    };

    const fallbackWebSpeech = (textToSpeak, currentLangObj) => {
        if (!window.speechSynthesis) {
            toast.error("Speech synthesis unavailable.");
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLangObj.code;
        utterance.rate = 0.85;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="border-4 border-swiss-black bg-swiss-black text-swiss-white p-6 my-6 font-inter shadow-brutal swiss-grid-pattern">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-white/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-swiss-accent text-swiss-white flex items-center justify-center font-black border-2 border-white">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">NATIVE MULTILINGUAL VOICE EXPLAINER</span>
                        <h4 className="text-lg font-black uppercase tracking-tight text-swiss-white">LISTEN TO SCHEME IN YOUR LANGUAGE</h4>
                    </div>
                </div>

                {/* Language Selection Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                handleStopAudio();
                                setSelectedLang(lang.code);
                            }}
                            className={`px-3 py-1.5 font-black text-xs uppercase tracking-wider border-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                                selectedLang === lang.code
                                    ? 'bg-swiss-accent text-swiss-white border-white shadow-xs'
                                    : 'bg-swiss-white text-swiss-black border-swiss-black hover:bg-swiss-accent hover:text-swiss-white'
                            }`}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Audio Waveform & Player Control */}
            <div className="bg-neutral-900 border-2 border-white/20 p-5 rounded-none flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={handlePlayAudio}
                        className={`w-16 h-16 shrink-0 flex items-center justify-center border-4 border-swiss-black font-black text-sm uppercase transition-all duration-150 shadow-brutal cursor-pointer mt-1 ${
                            isPlaying
                                ? 'bg-amber-500 text-swiss-black hover:bg-amber-600 animate-pulse'
                                : 'bg-swiss-accent text-swiss-white hover:bg-swiss-white hover:text-swiss-black'
                        }`}
                    >
                        {isPlaying ? <Square size={24} /> : <Play size={24} className="ml-1" />}
                    </button>

                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-xs uppercase text-swiss-accent flex items-center gap-2">
                                {isPlaying ? `▶️ SPEAKING VOICE FOR ${scheme?.schemeName?.toUpperCase() || 'SCHEME'}...` : "CLICK PLAY TO LISTEN TO DYNAMIC SCHEME VOICE"}
                            </span>
                            {isPlaying && (
                                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] animate-pulse bg-emerald-950 px-2 py-0.5 border border-emerald-500">
                                    <Volume2 size={12} /> NATIVE VOICE ACTIVE
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-neutral-200 font-medium leading-relaxed italic bg-black/40 p-3 border border-white/10 whitespace-pre-line max-h-48 overflow-y-auto font-mono">
                            "{speechText}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemeAudioExplainer;
