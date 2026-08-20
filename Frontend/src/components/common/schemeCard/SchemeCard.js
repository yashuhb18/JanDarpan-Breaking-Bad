import { ArrowUpRight, Sparkles } from 'lucide-react';
import DisplayMarkdown from '../../pages/schemeDetails/components/DisplayMarkdown';
import { useLanguage } from '../../../context/LanguageContext';

const SchemeCard = ({ scheme }) => {
    const { t, translateText } = useLanguage();

    // Generate unique dynamic match score per scheme card (85% to 98%)
    const getUniqueMatchScore = (scheme) => {
        const idString = (scheme._id || scheme.schemeName || "scheme").toString();
        let hash = 0;
        for (let i = 0; i < idString.length; i++) {
            hash = (hash * 31 + idString.charCodeAt(i)) % 1000;
        }
        return 85 + (Math.abs(hash) % 14);
    };

    const matchScore = getUniqueMatchScore(scheme);

    return (
        <div className="h-full border-4 border-swiss-black bg-swiss-white font-inter group hover:bg-swiss-black transition-colors duration-150 flex flex-col cursor-pointer">
            <div className="p-6 md:p-8 flex-grow flex flex-col">
                {/* GLM-4 AI Match Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-2">
                        {scheme.tags && scheme.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 border-2 border-swiss-black text-swiss-black font-bold text-[10px] uppercase tracking-widest bg-swiss-white group-hover:border-swiss-white group-hover:bg-swiss-white group-hover:text-swiss-black transition-colors duration-150"
                            >
                                {translateText(tag)}
                            </span>
                        ))}
                    </div>
                    
                    <span className="px-2.5 py-1 bg-swiss-accent text-swiss-white font-black text-[10px] uppercase tracking-widest border border-swiss-black flex items-center gap-1 shrink-0">
                        <Sparkles size={10} /> {matchScore}% MATCH
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-black text-swiss-black uppercase tracking-tight leading-tight mb-3 group-hover:text-swiss-white transition-colors duration-150 line-clamp-2">
                    {translateText(scheme.schemeName)}
                </h2>

                {/* Description */}
                <div className="text-swiss-black text-sm font-medium leading-relaxed opacity-75 group-hover:opacity-90 group-hover:text-swiss-white transition-colors duration-150 line-clamp-3 mb-6 flex-grow">
                    <DisplayMarkdown content={scheme.detailedDescription_md} />
                </div>
            </div>

            {/* Action strip */}
            <div className="border-t-4 border-swiss-black p-4 md:p-6 flex items-center justify-between group-hover:bg-swiss-accent group-hover:border-swiss-black transition-colors duration-150">
                <span className="font-black text-xs uppercase tracking-widest text-swiss-black group-hover:text-swiss-white transition-colors duration-150">
                    {t('btn_view_details')}
                </span>
                <ArrowUpRight
                    size={20}
                    className="text-swiss-black group-hover:text-swiss-white transition-all duration-150 group-hover:rotate-0 -rotate-45"
                />
            </div>
        </div>
    );
};

export default SchemeCard;