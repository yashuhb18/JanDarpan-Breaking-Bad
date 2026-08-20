import React, { useState } from 'react';
import { List, Plus } from 'lucide-react';

const FAQSection = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="space-y-6 font-inter">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center text-swiss-black">
                <List className="mr-2 text-swiss-accent" size={18} />
                FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="space-y-3">
                {faqs?.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className={`border-4 border-swiss-black p-6 cursor-pointer transition-colors duration-150 ${
                                isOpen ? 'bg-swiss-accent text-swiss-white' : 'bg-swiss-white text-swiss-black hover:bg-swiss-muted'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-black text-sm uppercase tracking-tight">0{index + 1}. {faq.question}</span>
                                <Plus size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
                            </div>
                            {isOpen && (
                                <p className="mt-4 font-medium text-sm leading-relaxed text-swiss-white">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FAQSection;
