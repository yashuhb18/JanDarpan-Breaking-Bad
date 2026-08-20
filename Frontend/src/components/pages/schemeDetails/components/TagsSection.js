import React from 'react';
import { Tag } from 'lucide-react';

const TagsSection = ({ tags }) => {
    return (
        <section className="space-y-3 font-inter">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center text-swiss-black">
                <Tag className="mr-2 text-swiss-accent" size={18} />
                TAGS
            </h2>
            <div className="flex flex-wrap gap-2">
                {tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-swiss-black text-swiss-white font-black text-[10px] uppercase tracking-widest border-2 border-swiss-black"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default TagsSection;
