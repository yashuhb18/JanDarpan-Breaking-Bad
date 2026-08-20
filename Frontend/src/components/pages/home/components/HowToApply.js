import { UserPlus, Search, CheckSquare } from "lucide-react";

const StepCard = ({ icon: Icon, title, description, stepNum }) => (
    <div className="border-b-2 md:border-b-0 md:border-r-2 border-swiss-black last:border-r-0 p-8 md:p-12 bg-swiss-white group hover:bg-swiss-black transition-colors duration-150">
        <div className="flex items-start justify-between mb-8">
            <span className="text-swiss-accent font-black text-4xl md:text-5xl tracking-tighter">
                {stepNum}
            </span>
            <div className="w-14 h-14 border-2 border-swiss-black flex items-center justify-center group-hover:border-swiss-white transition-colors duration-150">
                <Icon size={28} className="text-swiss-black group-hover:text-swiss-white transition-colors duration-150" />
            </div>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-swiss-black uppercase tracking-tight group-hover:text-swiss-white transition-colors duration-150 mb-3">
            {title}
        </h3>
        <p className="text-swiss-black font-medium text-sm leading-relaxed group-hover:text-swiss-white/80 transition-colors duration-150">
            {description}
        </p>
    </div>
);

const HowToApply = () => {
    return (
        <section className="border-b-2 border-swiss-black font-inter">
            {/* Section header */}
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-muted swiss-diagonal">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">04. METHOD</span>
                </div>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">HOW TO APPLY</span>
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 md:grid-cols-3">
                <StepCard
                    icon={UserPlus}
                    title="Enter Details"
                    description="Start by entering your personal details to find relevant government schemes."
                    stepNum="01."
                />
                <StepCard
                    icon={Search}
                    title="Search & Filter"
                    description="Our search engine helps you filter and find the most relevant schemes for your profile."
                    stepNum="02."
                />
                <StepCard
                    icon={CheckSquare}
                    title="Select & Apply"
                    description="Choose the schemes you're eligible for and apply directly through the portal."
                    stepNum="03."
                />
            </div>
        </section>
    );
};

export default HowToApply;
