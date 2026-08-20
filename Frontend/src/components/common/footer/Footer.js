import { Link } from "react-router-dom";
import { Phone, Mail, ArrowUpRight, ArrowUp, ShieldCheck, Landmark, Sparkles } from "lucide-react";
import jandarpanLogo from "../../../assets/jandarpan_logo.png";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const quickLinks = [
        { label: "Home", to: "/" },
        { label: "Schemes Directory", to: "/schemes" },
        { label: "Public Project Map", to: "/projects" },
        { label: "Honesty Leaderboard", to: "/honesty-leaderboard" },
        { label: "Citizen Profile", to: "/profile" },
    ];

    const categories = [
        { label: "Education & Scholarships", to: "/schemes?cat=Education" },
        { label: "Healthcare & Insurance", to: "/schemes?cat=Healthcare" },
        { label: "Agriculture & Farmers", to: "/schemes?cat=Agriculture" },
        { label: "Women & Child Support", to: "/schemes?cat=Women" },
        { label: "Housing & Infrastructure", to: "/schemes?cat=Housing" },
    ];

    return (
        <footer className="font-inter bg-swiss-white text-swiss-black relative z-40 swiss-grid-pattern">
            
            {/* 🇮🇳 TRICOLOR ACCENT TOP FLOW BAR */}
            <div className="h-[4px] w-full bg-gradient-to-r from-[#FF9933] via-[#FF3B00] via-60% to-[#138808]"></div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
                    
                    {/* Brand & Mission (4 cols) */}
                    <div className="md:col-span-4 space-y-6">
                        <Link to="/" className="inline-block group">
                            <img src={jandarpanLogo} alt="JanDarpan Logo" className="h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
                        </Link>

                        <p className="text-swiss-black/80 font-medium text-xs md:text-sm leading-relaxed max-w-sm">
                            Universal citizen access to public welfare and government schemes through objective data structures and real-time ground-truth audit tracking.
                        </p>

                        <div className="space-y-2.5 text-xs font-bold pt-1">
                            <div className="flex items-center gap-3 text-swiss-black">
                                <div className="p-2 rounded-lg bg-swiss-accent/10 text-swiss-accent">
                                    <Phone size={15} />
                                </div>
                                <span>+91 1234567890</span>
                            </div>
                            <div className="flex items-center gap-3 text-swiss-black">
                                <div className="p-2 rounded-lg bg-swiss-accent/10 text-swiss-accent">
                                    <Mail size={15} />
                                </div>
                                <span>support@jandarpan.gov.in</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation (3 cols) */}
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-swiss-accent flex items-center gap-2">
                            <span>QUICK NAVIGATION</span>
                        </h3>
                        <ul className="space-y-2 text-xs font-bold">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.to}
                                        className="text-swiss-black/80 hover:text-swiss-accent hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 group py-1"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-swiss-black/20 group-hover:bg-swiss-accent transition-colors"></span>
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sectoral Categories (3 cols) */}
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-swiss-accent">
                            SECTORAL SCHEMES
                        </h3>
                        <ul className="space-y-2 text-xs font-bold">
                            {categories.map((cat, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={cat.to}
                                        className="text-swiss-black/80 hover:text-swiss-accent hover:translate-x-1 transition-all duration-150 flex items-center justify-between group py-1 border-b border-black/5 hover:border-swiss-accent/30"
                                    >
                                        <span>{cat.label}</span>
                                        <ArrowUpRight size={13} className="opacity-40 group-hover:opacity-100 group-hover:text-swiss-accent transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Swiss Index Card (2 cols) */}
                    <div className="md:col-span-2 bg-swiss-black text-swiss-white p-6 rounded-2xl shadow-brutal flex flex-col justify-between space-y-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent block">INDEX // GAZETTE</span>
                            <span className="text-xs font-black uppercase tracking-wider block">VERSION 2026.1</span>
                            <span className="text-[10px] font-semibold opacity-70 block">DIRECT BENEFIT TRANSFER & AUDIT PORTAL</span>
                        </div>

                        <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                            <ShieldCheck size={20} className="text-emerald-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">GOVT VERIFIED</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-swiss-black text-swiss-white px-6 md:px-12 py-4 border-t border-swiss-black">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
                    
                    <p className="text-swiss-white/90 text-center sm:text-left text-[11px] font-black uppercase tracking-wider">
                        &copy; 2026 JANDARPAN / SCHEMESEVA — ALL RIGHTS RESERVED
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="bg-swiss-white text-swiss-black hover:bg-swiss-accent hover:text-swiss-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                        <span>BACK TO TOP</span>
                        <ArrowUp size={14} />
                    </button>

                </div>
            </div>

        </footer>
    );
};

export default Footer;
