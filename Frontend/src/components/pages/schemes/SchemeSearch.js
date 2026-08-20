import { useState, useEffect, useRef } from "react";
import { Search, BookOpen, Users, Coins, Calendar, Building2, MapPin, Filter, ChevronDown, X, Bot, Sparkles, Mic, MicOff, Loader2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const CATEGORIES = [
    "Women and Child",
    "Utility & Sanitation",
    "Travel & Tourism",
    "Transport & Infrastructure Sports & Culture",
    "Social welfare & Empowerment",
    "Skills & Employment",
    "Science, IT & Communications",
    "Public Safety,Law & Justice",
    "Housing & Shelter",
    "Health & Wellness",
    "Education & Learning",
    "Business & Entrepreneurship",
    "Banking, Financial Services and Insurance",
    "Agriculture,Rural & Environment"
];

const MINISTRIES = [
    "Ministry Of Culture",
    "Ministry Of Petroleum and Natural Gas",
    "Ministry Of Rural Development",
    "Ministry Of Housing & Urban Affairs",
    "Ministry Of Heavy Industries",
    "Ministry Of Health & Family Welfare",
    "Ministry Of Science And Technology",
    "Ministry Of Law and Justice",
    "Ministry Of Agriculture and Farmers Welfare",
    "Ministry Of Labour and Employment",
    "Ministry Of External Affairs",
    "Ministry Of Youth Affairs & Sports",
    "Ministry Of Micro, Small and Medium Enterprises",
    "Ministry Of Commerce And Industry",
    "Ministry Of Minority Affairs",
    "Ministry Of New and Renewable Energy",
    "Ministry Of Social Justice and Empowerment",
    "Ministry Of Finance",
    "Ministry Of Women and Child Development",
    "Ministry Of Jal Shakti",
    "Ministry Of Education",
    "Ministry Of Skill Development And Entrepreneurship"
];

const STATES = [
    "Andaman and Nicobar Islands", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

const LEVELS = ["State/ UT", "Central", "State"];

const SchemeSearch = ({ onSearch, initialFilters = {} }) => {
    const { t, translateText } = useLanguage();
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        schemeName: "",
        openDate: "",
        closeDate: "",
        state: "",
        nodalMinistryName: "",
        level: "",
        category: initialFilters.category || "",
        gender: "",
        incomeGroup: "",
    });

    const [conversationalQuery, setConversationalQuery] = useState("");
    const [isParsingAi, setIsParsingAi] = useState(false);
    const [aiSummary, setAiSummary] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setConversationalQuery(transcript);
                setIsListening(false);
                toast.success(`Voice Recognized: "${transcript}"`);
            };

            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    useEffect(() => {
        if (initialFilters.category !== undefined || initialFilters.search !== undefined) {
            setFilters(prev => ({
                ...prev,
                category: initialFilters.category || "",
                search: initialFilters.search || ""
            }));
        }
    }, [initialFilters]);

    const [activeTab, setActiveTab] = useState('basic');

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updated = {
            ...filters,
            [name]: value,
        };
        setFilters(updated);
        onSearch(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    // Run GLM-4 Conversational AI Search Parser
    const handleAiParseSearch = async (e) => {
        e?.preventDefault();
        const textToParse = conversationalQuery.trim() || filters.search.trim();
        if (!textToParse) return;

        setIsParsingAi(true);
        toast.loading("GLM-4 AI parsing conversational profile...", { id: "ai-parse" });

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/schemes/ai-parse-search`, {
                query: textToParse
            });

            if (data.success && data.parsed) {
                const parsed = data.parsed;
                const updatedFilters = {
                    ...filters,
                    search: parsed.searchKeyword || filters.search,
                    state: parsed.state || filters.state,
                    category: parsed.category || filters.category,
                    gender: parsed.gender || filters.gender,
                    incomeGroup: parsed.incomeGroup || filters.incomeGroup
                };

                setFilters(updatedFilters);
                setAiSummary(parsed.summaryText || `Extracted profile: ${parsed.category || 'General'} in ${parsed.state || 'All India'}`);
                onSearch(updatedFilters);
                toast.success("GLM-4 AI parsed your profile & applied matching filters!", { id: "ai-parse" });
            }
        } catch (err) {
            console.error("GLM-4 AI Parse error:", err);
            toast.error("AI parse fallback applied.", { id: "ai-parse" });
            onSearch(filters);
        } finally {
            setIsParsingAi(false);
        }
    };

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                toast.loading("Listening... Speak your profile (e.g. Farmer in Karnataka)...");
            } catch (err) {
                setIsListening(false);
            }
        }
    };

    const clearFilter = (filterName) => {
        const updated = { ...filters, [filterName]: "" };
        setFilters(updated);
        onSearch(updated);
    };

    const SelectField = ({ label, name, value, onChange, options, icon: Icon }) => (
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-3 pl-10 pr-12 bg-swiss-white border-2 border-swiss-black focus:border-swiss-accent transition-colors duration-150 appearance-none text-swiss-black font-bold text-sm uppercase focus:outline-none"
                style={{ maxWidth: '100%' }}
            >
                <option value="">Select {label}</option>
                {options.map(option => (
                    <option key={option} value={option} className="max-w-full text-ellipsis">
                        {translateText(option)}
                    </option>
                ))}
            </select>
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-swiss-accent" size={16} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-swiss-black" size={14} />
        </div>
    );

    const tabs = [
        { id: 'basic', label: 'Basic Filters', icon: Filter },
        { id: 'location', label: 'Location', icon: MapPin },
        { id: 'eligibility', label: 'Eligibility', icon: Users },
        { id: 'dates', label: 'Dates', icon: Calendar },
    ];

    return (
        <div className="font-inter max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Single Unified AI-Powered Search Bar */}
                <div className="border-4 border-swiss-black bg-swiss-black p-2 md:p-3 shadow-brutal">
                    <div className="flex items-center justify-between px-2 pb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-swiss-accent animate-pulse" size={16} />
                            <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-swiss-white">
                                SMART AI & KEYWORD SEARCH ENGINE
                            </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-swiss-white/60 hidden sm:block">
                            SPEAK OR TYPE PLAIN SENTENCE / KEYWORD
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 bg-swiss-white p-1 border-2 border-swiss-black">
                        <div className="relative flex-1 flex items-center">
                            <Search className="absolute left-3 text-swiss-black/40" size={18} />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="e.g. Farmer loan OR 'I am a 45-year-old farmer in Karnataka looking for crop insurance...'"
                                className="w-full pl-10 pr-12 py-3 text-xs md:text-sm font-bold text-swiss-black bg-swiss-white focus:outline-none uppercase"
                            />
                            <button
                                type="button"
                                onClick={toggleVoiceInput}
                                className={`absolute right-2 p-2 rounded transition-colors ${isListening ? 'bg-swiss-accent text-swiss-white animate-pulse' : 'text-swiss-black hover:bg-swiss-muted'}`}
                                title="Click to speak your query"
                            >
                                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAiParseSearch}
                                disabled={isParsingAi}
                                className="bg-swiss-accent text-swiss-white hover:bg-swiss-black border-2 border-swiss-black px-4 py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                                title="Parse plain English/Hindi sentence with GLM-4 AI"
                            >
                                {isParsingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                <span>{isParsingAi ? 'PARSING...' : 'AI SEARCH ⚡'}</span>
                            </button>

                            <button
                                type="submit"
                                className="bg-swiss-black text-swiss-white hover:bg-swiss-accent border-2 border-swiss-black px-5 py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <span>{t('btn_search')}</span>
                            </button>
                        </div>
                    </div>

                    {/* AI Parse Result Banner */}
                    {aiSummary && (
                        <div className="mt-2 p-2.5 bg-swiss-white text-swiss-black border-2 border-swiss-black font-bold text-xs uppercase tracking-tight flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bot size={14} className="text-swiss-accent shrink-0" />
                                <span>{aiSummary}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAiSummary('')}
                                className="text-swiss-accent hover:text-swiss-black text-[10px] font-black uppercase"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. Active Filter Badges */}
                {Object.entries(filters).some(([_, value]) => value) && (
                    <div className="border-2 border-swiss-black p-3 bg-swiss-white flex items-center justify-between flex-wrap gap-2">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="font-black text-[10px] uppercase tracking-widest text-swiss-accent mr-2">ACTIVE FILTERS:</span>
                            {Object.entries(filters).map(([key, value]) => 
                                value && (
                                    <div key={key} 
                                        className="flex items-center gap-1.5 bg-swiss-black text-swiss-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                                        {key}: {translateText(value)}
                                        <button
                                            type="button"
                                            onClick={() => clearFilter(key)}
                                            className="hover:text-swiss-accent transition-colors duration-150"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const resetFilters = {
                                    search: "", schemeName: "", openDate: "", closeDate: "",
                                    state: "", nodalMinistryName: "", level: "", category: "",
                                    gender: "", incomeGroup: ""
                                };
                                setFilters(resetFilters);
                                onSearch(resetFilters);
                            }}
                            className="text-swiss-accent font-black text-xs uppercase tracking-widest hover:underline"
                        >
                            CLEAR ALL
                        </button>
                    </div>
                )}

                {/* 3. Streamlined Category & State Filters */}
                <div className="border-4 border-swiss-black bg-swiss-white p-4 space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-swiss-black pb-2">
                        <span className="font-black text-xs uppercase tracking-widest text-swiss-black flex items-center gap-2">
                            <Filter size={14} className="text-swiss-accent" />
                            FILTER BY CATEGORY, MINISTRY & STATE
                        </span>
                        <div className="flex overflow-x-auto gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider transition-colors border-2 border-swiss-black
                                        ${activeTab === tab.id 
                                            ? 'text-swiss-white bg-swiss-black' 
                                            : 'text-swiss-black bg-swiss-muted hover:bg-swiss-white'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        {activeTab === 'basic' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SelectField
                                    label={t('filter_category')}
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    options={CATEGORIES}
                                    icon={BookOpen}
                                />
                                <SelectField
                                    label={t('filter_ministry')}
                                    name="nodalMinistryName"
                                    value={filters.nodalMinistryName}
                                    onChange={handleFilterChange}
                                    options={MINISTRIES}
                                    icon={Building2}
                                />
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SelectField
                                    label={t('filter_state')}
                                    name="state"
                                    value={filters.state}
                                    onChange={handleFilterChange}
                                    options={STATES}
                                    icon={MapPin}
                                />
                                <SelectField
                                    label={t('filter_level')}
                                    name="level"
                                    value={filters.level}
                                    onChange={handleFilterChange}
                                    options={LEVELS}
                                    icon={Filter}
                                />
                            </div>
                        )}

                        {activeTab === 'eligibility' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SelectField
                                    label={t('filter_gender')}
                                    name="gender"
                                    value={filters.gender}
                                    onChange={handleFilterChange}
                                    options={["Male", "Female", "Other"]}
                                    icon={Users}
                                />
                                <SelectField
                                    label={t('filter_income')}
                                    name="incomeGroup"
                                    value={filters.incomeGroup}
                                    onChange={handleFilterChange}
                                    options={["EWS", "General", "OBC", "SC", "ST"]}
                                    icon={Coins}
                                />
                            </div>
                        )}

                        {activeTab === 'dates' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="openDate"
                                        value={filters.openDate}
                                        onChange={handleFilterChange}
                                        className="w-full p-3 pl-10 pr-4 bg-swiss-white border-2 border-swiss-black focus:border-swiss-accent transition-colors duration-150 text-swiss-black font-bold text-sm focus:outline-none"
                                        placeholder="Open Date"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-swiss-accent" size={16} />
                                </div>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="closeDate"
                                        value={filters.closeDate}
                                        onChange={handleFilterChange}
                                        className="w-full p-3 pl-10 pr-4 bg-swiss-white border-2 border-swiss-black focus:border-swiss-accent transition-colors duration-150 text-swiss-black font-bold text-sm focus:outline-none"
                                        placeholder="Close Date"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-swiss-accent" size={16} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SchemeSearch;