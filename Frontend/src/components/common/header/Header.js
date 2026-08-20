import React, { useState, useContext, useRef, useEffect } from "react";
import { Menu, X, Home, FileText, LogIn, ShieldCheck, User, Globe, ChevronDown, Trophy, Bell, MapPin } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { useLanguage } from "../../../context/LanguageContext";
import userAuthenticatedAxiosInstance from "../../../services/users/userAuthenticatedAxiosInstance";
import jandarpanLogo from "../../../assets/jandarpan_logo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    const { isUserLoggedIn, setIsUserLoggedIn } = useContext(UserContext);
    const { currentLanguage, changeLanguage, t, LANGUAGES } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null);
    const langRef = useRef(null);
    const notifRef = useRef(null);
    
    const userAxiosInstance = userAuthenticatedAxiosInstance('/api/v1/users');

    const loadNotifications = () => {
        const stored = JSON.parse(localStorage.getItem("citizenNotifications") || "[]");
        setNotifications(stored);
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 3000);

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const clearNotifications = () => {
        localStorage.removeItem("citizenNotifications");
        setNotifications([]);
        setIsNotifOpen(false);
    };

    const handleLogout = async () => {
        try {
            await userAxiosInstance.post("/logout");
        } catch (error) {
            console.error("Logout error", error.message);
        } finally {
            localStorage.removeItem("accessToken");
            setIsUserLoggedIn(false);
            setIsProfileOpen(false);
            navigate("/");
        }
    };

    const activeLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

    const isNavActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="bg-swiss-white/95 backdrop-blur-md h-20 flex items-center justify-between px-6 md:px-10 w-full relative z-50 font-inter shadow-sm">
            
            {/* 🇮🇳 UNIQUE RADIANT TRICOLOR ACCENT BOTTOM BAR (Replaces harsh black bottom line) */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF9933] via-[#FF3B00] via-60% to-[#138808]"></div>

            {/* Left Brand Logo */}
            <Link className="flex items-center group py-2" to="/">
                <img src={jandarpanLogo} alt="JanDarpan Logo" className="h-12 md:h-14 lg:h-15 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
            </Link>

            {/* Faded Vertical Divider */}
            <div className="hidden lg:block h-6 w-[1.5px] bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-4"></div>

            {/* Unique Floating Capsule Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-grow justify-center">
                
                <Link
                    to="/"
                    className={`px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest transition-all duration-200 flex items-center gap-1.5 ${isNavActive('/') ? 'bg-swiss-black text-swiss-white shadow-md' : 'text-swiss-black hover:bg-swiss-accent/10 hover:text-swiss-accent'}`}
                >
                    {t('nav_home')}
                </Link>

                <Link
                    to="/schemes"
                    className={`px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest transition-all duration-200 flex items-center gap-1.5 ${isNavActive('/schemes') ? 'bg-swiss-black text-swiss-white shadow-md' : 'text-swiss-black hover:bg-swiss-accent/10 hover:text-swiss-accent'}`}
                >
                    {t('nav_schemes')}
                </Link>

                <Link
                    to="/projects"
                    className={`px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest transition-all duration-200 flex items-center gap-1.5 ${isNavActive('/projects') ? 'bg-swiss-black text-swiss-white shadow-md' : 'text-swiss-black hover:bg-swiss-accent/10 hover:text-swiss-accent'}`}
                >
                    PROJECT MAP
                </Link>

                <Link
                    to="/honesty-leaderboard"
                    className={`px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest transition-all duration-200 flex items-center gap-1.5 ${isNavActive('/honesty-leaderboard') ? 'bg-swiss-accent text-swiss-white shadow-md' : 'text-swiss-accent hover:bg-swiss-accent/10'}`}
                >
                    <Trophy size={15} /> LEADERBOARD
                </Link>

            </nav>

            {/* Faded Vertical Divider */}
            <div className="hidden lg:block h-6 w-[1.5px] bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-4"></div>

            {/* Right Action / Notifications & Auth Controls */}
            <div className="flex items-center space-x-3">
                
                {/* 🔔 CITIZEN LIVE NOTIFICATIONS BELL */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2.5 rounded-full bg-swiss-white border-2 border-swiss-black hover:border-swiss-accent hover:bg-swiss-accent/10 transition-all flex items-center justify-center text-swiss-black"
                        title="Live Contractor Alerts"
                    >
                        <Bell size={18} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-swiss-accent text-swiss-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-swiss-white shadow-sm animate-pulse">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-swiss-white border-4 border-swiss-black shadow-brutal z-50 p-4 space-y-3 font-inter">
                            <div className="flex items-center justify-between border-b-2 border-swiss-black pb-2">
                                <span className="font-black text-xs uppercase tracking-wider text-swiss-black flex items-center gap-1.5">
                                    <Bell size={14} className="text-swiss-accent" /> LIVE AGENT CLAIM NOTIFICATIONS
                                </span>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearNotifications}
                                        className="text-[9px] font-black uppercase text-swiss-accent hover:underline"
                                    >
                                        CLEAR ALL
                                    </button>
                                )}
                            </div>

                            {notifications.length === 0 ? (
                                <p className="text-xs font-bold uppercase text-gray-500 py-4 text-center">
                                    No new agent claims posted.
                                </p>
                            ) : (
                                <div className="max-h-80 overflow-y-auto space-y-2">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                setIsNotifOpen(false);
                                                navigate("/projects");
                                            }}
                                            className="p-3 border-2 border-swiss-black bg-swiss-muted hover:bg-swiss-black hover:text-swiss-white transition-colors cursor-pointer space-y-1"
                                        >
                                            <span className="font-black text-[10px] uppercase text-swiss-accent block">
                                                {notif.title}
                                            </span>
                                            <p className="font-bold text-xs uppercase leading-snug">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase opacity-70 pt-1">
                                                <span>{new Date(notif.date).toLocaleTimeString()}</span>
                                                <span className="underline text-swiss-accent">VIEW ON MAP →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Language Switcher Dropdown */}
                <div className="relative" ref={langRef}>
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="bg-swiss-white text-swiss-black border-2 border-swiss-black rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider hover:border-swiss-accent hover:bg-swiss-accent/10 transition-all flex items-center gap-1.5"
                    >
                        <Globe size={16} className="text-swiss-accent" />
                        <span>{activeLangObj.nativeName}</span>
                        <ChevronDown size={14} />
                    </button>

                    {isLangOpen && (
                        <div className="absolute right-0 mt-3 w-44 bg-swiss-white border-4 border-swiss-black shadow-brutal z-50">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        changeLanguage(lang.code);
                                        setIsLangOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b border-swiss-black transition-colors ${currentLanguage === lang.code ? 'bg-swiss-accent text-swiss-white' : 'text-swiss-black hover:bg-swiss-muted'}`}
                                >
                                    {lang.nativeName} <span className="text-[10px] opacity-70">({lang.name})</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {isUserLoggedIn ? (
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="bg-swiss-black text-swiss-white px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest border-2 border-swiss-black hover:bg-swiss-accent hover:border-swiss-accent transition-all duration-150 flex items-center space-x-2 shadow-sm"
                        >
                            <User size={16} />
                            <span className="hidden sm:inline">ACCOUNT</span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-swiss-white border-4 border-swiss-black shadow-brutal z-50">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="block px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 border-swiss-black hover:bg-swiss-muted transition-colors"
                                >
                                    MY CITIZEN PROFILE
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-swiss-accent hover:bg-swiss-accent hover:text-swiss-white transition-colors"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-swiss-black text-swiss-white px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest border-2 border-swiss-black hover:bg-swiss-accent hover:border-swiss-accent transition-all duration-150 flex items-center space-x-2 shadow-sm"
                    >
                        <LogIn size={16} />
                        <span>LOGIN</span>
                    </Link>
                )}

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2.5 text-swiss-black rounded-full border-2 border-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-all"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;