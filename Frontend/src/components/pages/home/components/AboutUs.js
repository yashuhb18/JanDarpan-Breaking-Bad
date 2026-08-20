import { Target, Users, Shield, Cpu, Scale, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";

const PillarCard = ({ icon: Icon, titleKey, descKey, defaultTitle, defaultDesc }) => {
    const { t } = useLanguage();
    const title = t(titleKey) !== titleKey ? t(titleKey) : defaultTitle;
    const desc = t(descKey) !== descKey ? t(descKey) : defaultDesc;

    return (
        <div className="border-b-2 border-swiss-black last:border-b-0 p-8 bg-swiss-white group hover:bg-swiss-black transition-colors duration-150 flex-1">
            <div className="w-12 h-12 border-2 border-swiss-black flex items-center justify-center mb-5 bg-swiss-muted group-hover:bg-swiss-white transition-colors duration-150 flex-shrink-0">
                <Icon size={24} className="text-swiss-accent group-hover:text-swiss-black transition-colors duration-150" />
            </div>
            <h3 className="font-black text-base md:text-lg uppercase tracking-tight text-swiss-black mb-2 group-hover:text-swiss-white transition-colors duration-150">
                {title}
            </h3>
            <p className="text-swiss-black text-xs md:text-sm font-medium leading-relaxed group-hover:text-swiss-white/80 transition-colors duration-150">
                {desc}
            </p>
        </div>
    );
};

const AboutUs = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <section className="border-b-2 border-swiss-black font-inter">
            {/* Section header */}
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-white">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">05. PLATFORM MISSION & GOVERNANCE</span>
                </div>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">WHO WE ARE</span>
            </div>

            {/* Content area — asymmetric 7:5 grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b-2 border-swiss-black">
                {/* Left side — main statement */}
                <div className="md:col-span-7 border-b-2 md:border-b-0 md:border-r-2 border-swiss-black p-8 md:p-12 bg-swiss-muted swiss-grid-pattern flex flex-col justify-center">
                    <h2 className="text-4xl md:text-6xl font-black text-swiss-black uppercase tracking-tighter leading-[0.9] mb-8">
                        BRIDGING CITIZENS, <br />
                        <span className="text-swiss-accent">AI FORENSICS & GOVT.</span>
                    </h2>
                    <p className="text-swiss-black font-medium text-base md:text-lg leading-relaxed max-w-xl border-l-4 border-swiss-accent pl-6">
                        Empowering 1.4 Billion Indian Citizens with GLM-4 Forensic AI Auditing, Polygon Immutable Ledgering, Section 80 CPC Legal-BERT High Court Automation, and 2FA Executive Fund Sanctioning.
                    </p>
                    <button 
                        onClick={() => navigate('/about')}
                        className="mt-8 bg-swiss-black text-swiss-white px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-swiss-accent transition-colors duration-150 w-fit border-2 border-swiss-black shadow-brutal"
                    >
                        EXPLORE FULL ARCHITECTURE →
                    </button>
                </div>

                {/* Right side — pillar cards stacked */}
                <div className="md:col-span-5 flex flex-col">
                    <PillarCard
                        icon={Cpu}
                        titleKey="about_mission_title"
                        descKey="about_mission_desc"
                        defaultTitle="OUR AI FORENSIC MISSION"
                        defaultDesc="To eliminate public infrastructure corruption by matching physical geotagged site photo proof against contractor billing claims with GLM-4 AI."
                    />
                    <PillarCard
                        icon={Users}
                        titleKey="about_serve_title"
                        descKey="about_serve_desc"
                        defaultTitle="WHO WE SERVE"
                        defaultDesc="Indian Citizens, Executive PWD Engineers, Municipal Commissioners, and Verified Contractors committed to transparent public infrastructure."
                    />
                    <PillarCard
                        icon={Scale}
                        titleKey="about_commit_title"
                        descKey="about_commit_desc"
                        defaultTitle="LEGAL & BLOCKCHAIN COMMITMENT"
                        defaultDesc="Immutable SHA-256 Polygon ledgering of every rupee spent, Section 80 CPC PIL High Court court-room petition generation, and e-SHRAM labor protection."
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
