import { FileText, Award, AlertTriangle, Search, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";

const StatCard = ({ icon: Icon, title, value, subtitle, hoveredBg = "bg-swiss-accent" }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className={`border-b-2 md:border-b-0 md:border-r-2 border-swiss-black last:border-r-0 p-8 flex items-start justify-between transition-colors duration-150 cursor-default group ${hovered ? hoveredBg : 'bg-swiss-white'}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div>
                <span className={`font-black text-4xl md:text-5xl tracking-tighter block mb-2 transition-all duration-150 ${hovered ? 'text-swiss-white scale-105' : 'text-swiss-black'}`}>
                    {value}
                </span>
                <span className={`font-bold text-xs uppercase tracking-widest block transition-colors duration-150 ${hovered ? 'text-swiss-white' : 'text-swiss-black'}`}>
                    {title}
                </span>
                {subtitle && (
                    <span className={`font-medium text-[11px] uppercase tracking-wider mt-2 block transition-colors duration-150 ${hovered ? 'text-swiss-white/80' : 'text-swiss-black/60'}`}>
                        {subtitle}
                    </span>
                )}
            </div>
            <div className={`transition-all duration-200 ${hovered ? 'rotate-90' : 'rotate-0'}`}>
                <Plus size={24} className={`transition-colors duration-150 ${hovered ? 'text-swiss-white' : 'text-swiss-accent'}`} />
            </div>
        </div>
    );
};

const TotalSchemes = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <section className="border-b-2 border-swiss-black font-inter">
            {/* Section header */}
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-muted swiss-dots">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">{t('stats_tag')}</span>
                </div>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">{t('stats_header')}</span>
            </div>

            {/* Impact Problem & Solution Banner */}
            <div className="bg-swiss-white p-8 md:p-12 border-b-2 border-swiss-black grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">PROBLEM STATEMENT</span>
                    <h2 className="text-2xl md:text-4xl font-black text-swiss-black uppercase tracking-tight leading-tight mb-4">
                        {t('stats_problem_title')}
                    </h2>
                    <p className="text-swiss-black/80 font-medium text-sm leading-relaxed max-w-3xl">
                        {t('stats_problem_desc')}
                    </p>
                </div>
                <div className="md:col-span-4 bg-swiss-black text-swiss-white p-6 md:p-8 border-2 border-swiss-black shadow-brutal flex flex-col justify-between">
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest mb-2 block">{t('stats_solution_title')}</span>
                    <p className="font-bold text-sm uppercase tracking-wide leading-snug mb-4">
                        {t('stats_solution_desc')}
                    </p>
                    <button
                        onClick={() => navigate('/schemes')}
                        className="bg-swiss-accent text-swiss-white px-5 py-3 font-black uppercase text-xs tracking-widest hover:bg-swiss-white hover:text-swiss-black border-2 border-swiss-accent transition-colors duration-150 w-full text-center"
                    >
                        {t('hero_search_btn')} →
                    </button>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3">
                <StatCard 
                    icon={FileText} 
                    title={t('stats_card_1_title')} 
                    value={t('stats_card_1_val')} 
                    subtitle="Run across Central & 28 State Governments"
                    hoveredBg="bg-swiss-black"
                />
                <StatCard 
                    icon={AlertTriangle} 
                    title={t('stats_card_2_title')} 
                    value={t('stats_card_2_val')} 
                    subtitle="Over 95% of eligible benefits go unclaimed"
                    hoveredBg="bg-swiss-accent"
                />
                <StatCard 
                    icon={Award} 
                    title={t('stats_card_3_title')} 
                    value={t('stats_card_3_val')} 
                    subtitle="Automated profile eligibility calculation"
                    hoveredBg="bg-swiss-black"
                />
            </div>

            {/* CTA strip */}
            <div className="bg-swiss-black px-6 md:px-12 py-6 flex items-center justify-between">
                <span className="text-swiss-white font-black text-sm md:text-base uppercase tracking-wider">
                    {t('dir_title')}
                </span>
                <button
                    onClick={() => navigate('/schemes')}
                    className="bg-swiss-accent text-swiss-white px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-swiss-white hover:text-swiss-black border-2 border-swiss-accent hover:border-swiss-white transition-colors duration-150 flex items-center gap-2"
                >
                    <Search size={16} />
                    {t('btn_search')} →
                </button>
            </div>
        </section>
    );
};

export default TotalSchemes;
