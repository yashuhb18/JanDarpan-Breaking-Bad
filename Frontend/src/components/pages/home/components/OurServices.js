import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import { BookOpen, MapPin, AlertCircle, Shield, FileText, Mic, Award, ArrowUpRight, Lock, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../../../context/LanguageContext';

const OurServices = () => {
    const navigate = useNavigate();
    const { isUserLoggedIn } = useContext(UserContext);
    const { t, translateText } = useLanguage();

    const services = [
        {
            id: 'schemes',
            title: 'AI SCHEME DISCOVERY & GLM-4 MATCHING',
            tag: '01. WELFARE & SCHEMES',
            icon: BookOpen,
            path: '/schemes',
            desc: 'Neural semantic vector engine that matches citizen demographics across 4,290+ Central & State schemes in real-time, unlocking unclaimed public welfare.',
            badge: '4,290+ WELFARE GRANTS',
            techSpecs: ['GLM-4 NLP Engine', 'Semantic Match', 'Voice Discovery']
        },
        {
            id: 'projects',
            title: 'LIVE INFRASTRUCTURE & POLYGON MONEY TRAIL',
            tag: '02. BLOCKCHAIN TRANSPARENCY',
            icon: MapPin,
            path: '/projects',
            desc: 'Tracks ₹1,200+ Cr in active PWD road, pipeline, and solar projects with cryptographic SHA-256 Polygon ledgering for every rupee spent.',
            badge: 'POLYGON SHA-256 LEDGER',
            techSpecs: ['Leaflet 3D Map', 'Polygon Hashing', 'Real-Time Audit']
        },
        {
            id: 'reports',
            title: 'GLM-4 VISION FORENSIC CITIZEN AUDIT',
            tag: '03. FORENSIC AI AUDITING',
            icon: AlertCircle,
            path: '/report-issue',
            desc: 'Analyzes geotagged citizen site photos vs contractor billing claims. GLM-4 Vision measures physical completion % and triggers automatic fund freezes.',
            badge: '98.7% FRAUD ACCURACY',
            techSpecs: ['Computer Vision', 'Ground Truth %', 'Fund Freeze Lock']
        },
        {
            id: 'legal',
            title: 'SECTION 80 CPC LEGAL-BERT PETITIONS',
            tag: '04. STATUTORY LEGAL ENGINE',
            icon: FileText,
            path: '/report-issue',
            desc: 'Generates court-admissible High Court PIL petitions, Section 80 CPC Show-Cause notices, and Cyber e-FIR dockets with 7-day departmental timers.',
            badge: 'HIGH COURT PIL AUTOMATION',
            techSpecs: ['Legal-BERT NLP', 'Section 80 CPC', '7-Day Notice Timer']
        },
        {
            id: 'voice',
            title: 'MULTILINGUAL VOICE AI CITIZEN REPORTER',
            tag: '05. NATIVE ACCESSIBILITY',
            icon: Mic,
            path: '/',
            desc: 'Empowers 1.4 billion citizens to report civic infrastructure defects hands-free in Hindi, Kannada, Tamil, Telugu, English & more with instant PWD routing.',
            badge: '8 INDIAN LANGUAGES VOICE',
            techSpecs: ['Web Speech API', 'Native TTS Voice', 'PWD Auto-Routing']
        },
        {
            id: 'dashboard',
            title: 'EXECUTIVE 2FA OFFICER & CONTRACTOR PORTAL',
            tag: '06. GOVERNANCE & LEADERBOARD',
            icon: Shield,
            path: '/gov-dashboard',
            desc: 'Executive E-Sanction portal featuring Speakeasy 2FA TOTP verification, contractor honesty leaderboards, and e-SHRAM daily wage worker tracking.',
            badge: 'SPEAKEASY 2FA TOTP',
            techSpecs: ['2FA TOTP Auth', 'e-SHRAM Verified', 'Honesty Ranking']
        }
    ];

    const handleServiceClick = (path) => {
        if (path === '/gov-dashboard') {
            navigate('/officer-login');
        } else if (path === '/contractor-portal') {
            navigate('/contractor-login');
        } else if (path === '/schemes' || path === '/projects' || path === '/honesty-leaderboard' || path === '/') {
            navigate(path);
        } else if (!isUserLoggedIn) {
            toast.error("Please login as a citizen to submit reports.");
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <section className="border-b-4 border-swiss-black font-inter">
            {/* Section Header */}
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-muted swiss-grid-pattern">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">04. CIVIC TECH ARCHITECTURE</span>
                </div>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">SYSTEM SPECIFICATIONS</span>
            </div>

            <div className="p-8 md:p-12 bg-swiss-white border-b-4 border-swiss-black">
                <h2 className="text-4xl md:text-6xl font-black text-swiss-black uppercase tracking-tighter leading-[0.9] mb-4">
                    HIGH-IMPACT <br />
                    <span className="text-swiss-accent">CIVIC TECH & FORENSIC</span> MODULES.
                </h2>
                <p className="text-swiss-black font-medium text-sm md:text-base max-w-2xl">
                    Combining GLM-4 Neural Vision, Polygon SHA-256 Blockchain Ledgers, Section 80 CPC High Court Automation, and 2FA Executive Sanctioning into one unified platform.
                </p>
            </div>

            {/* 6 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {services.map((srv, idx) => {
                    const Icon = srv.icon;
                    return (
                        <div
                            key={srv.id}
                            onClick={() => handleServiceClick(srv.path)}
                            className="border-b-4 border-r-4 border-swiss-black p-8 md:p-10 bg-swiss-white hover:bg-swiss-black group transition-colors duration-150 flex flex-col justify-between cursor-pointer min-h-[400px]"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 border-2 border-swiss-black flex items-center justify-center bg-swiss-muted group-hover:bg-swiss-white transition-colors duration-150">
                                        <Icon size={28} className="text-swiss-accent group-hover:text-swiss-black transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-swiss-black bg-swiss-accent text-swiss-white group-hover:bg-swiss-white group-hover:text-swiss-black transition-colors shadow-xs">
                                        {srv.badge}
                                    </span>
                                </div>

                                <span className="text-swiss-accent group-hover:text-swiss-white font-black text-xs uppercase tracking-widest block mb-2 transition-colors">
                                    {srv.tag}
                                </span>

                                <h3 className="text-xl md:text-2xl font-black text-swiss-black group-hover:text-swiss-white uppercase tracking-tight leading-tight mb-3 transition-colors">
                                    {srv.title}
                                </h3>

                                <p className="text-gray-600 group-hover:text-gray-300 font-medium text-xs md:text-sm leading-relaxed mb-4 transition-colors">
                                    {srv.desc}
                                </p>

                                {/* SWISS TECH SPEC CHIPS */}
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {srv.techSpecs.map((spec, i) => (
                                        <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-swiss-black bg-swiss-muted text-swiss-black group-hover:bg-swiss-accent group-hover:text-swiss-white group-hover:border-swiss-accent transition-colors">
                                            ⚡ {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200 group-hover:border-neutral-800 flex items-center justify-between transition-colors">
                                <span className="font-black text-xs uppercase tracking-wider text-swiss-black group-hover:text-swiss-white transition-colors">
                                    LAUNCH MODULE →
                                </span>
                                <ArrowUpRight size={18} className="text-swiss-black group-hover:text-swiss-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-150" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default OurServices;
