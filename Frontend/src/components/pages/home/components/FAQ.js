import { useState } from "react";
import { Plus } from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";

const FAQItem = ({ questionKey, answerKey, index, isLast }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <div
            className={`border-b-2 border-swiss-black p-6 md:p-8 cursor-pointer transition-colors duration-150 group ${isLast ? 'border-b-0' : ''} ${isOpen ? 'bg-swiss-accent text-swiss-white' : 'bg-swiss-white hover:bg-slate-50'}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                    <span className={`font-black text-xs uppercase tracking-widest whitespace-nowrap transition-colors duration-150 ${isOpen ? 'text-swiss-white' : 'text-swiss-accent'}`}>
                        0{index + 1}.
                    </span>
                    <span className={`font-black text-sm md:text-base uppercase tracking-tight transition-colors duration-150 ${isOpen ? 'text-swiss-white' : 'text-swiss-black'}`}>
                        {t(questionKey)}
                    </span>
                </div>
                <div className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <Plus size={20} className={`transition-colors duration-150 ${isOpen ? 'text-swiss-white' : 'text-swiss-black'}`} />
                </div>
            </div>
            {isOpen && (
                <div className="mt-4 pl-10">
                    <p className="text-swiss-white font-medium text-sm leading-relaxed">
                        {t(answerKey)}
                    </p>
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const { t } = useLanguage();
    const faqs = [
        { questionKey: "faq_1_q", answerKey: "faq_1_a" },
        { questionKey: "faq_2_q", answerKey: "faq_2_a" },
        { questionKey: "faq_3_q", answerKey: "faq_3_a" },
        { questionKey: "faq_4_q", answerKey: "faq_4_a" },
        { questionKey: "faq_5_q", answerKey: "faq_5_a" },
        { questionKey: "faq_6_q", answerKey: "faq_6_a" }
    ];

    return (
        <section className="border-b-2 border-swiss-black font-inter bg-swiss-white">
            {/* Section header bar */}
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-muted swiss-grid-pattern">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">{t('faq_tag')}</span>
                </div>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">{t('faq_header')}</span>
            </div>

            {/* Connected FAQ Grid with crisp 2px black borders */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b-2 border-swiss-black">
                {/* Left side — Title Block */}
                <div className="md:col-span-5 border-b-2 md:border-b-0 md:border-r-2 border-swiss-black p-8 md:p-12 bg-swiss-white swiss-dots flex flex-col justify-center">
                    <h2 className="text-4xl md:text-6xl font-black text-swiss-black uppercase tracking-tighter leading-[0.9] mb-4">
                        {t('faq_title_1')}<br />
                        <span className="text-swiss-accent">{t('faq_title_2')}</span>
                    </h2>
                    <p className="text-swiss-black font-medium text-sm leading-relaxed">
                        {t('faq_desc')}
                    </p>
                </div>

                {/* Right side — FAQ items stacked seamlessly */}
                <div className="md:col-span-7 flex flex-col">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            questionKey={faq.questionKey}
                            answerKey={faq.answerKey}
                            index={index}
                            isLast={index === faqs.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
