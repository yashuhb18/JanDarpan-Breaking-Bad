import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownSection = ({ title, content, icon: Icon }) => {
    return (
        <section className="space-y-3 font-inter">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center text-swiss-black">
                <Icon className="mr-2 text-swiss-accent" size={18} />
                {title}
            </h2>
            <div className="prose max-w-none text-swiss-black border-4 border-swiss-black p-6 bg-swiss-muted">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </section>
    );
};

export default MarkdownSection;
