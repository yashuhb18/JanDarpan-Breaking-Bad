import React from 'react';
import { Download, Share2, Bookmark } from 'lucide-react';
import { generatePDF } from "../../../../helper/generatePdf";
import { shareScheme } from "../../../../helper/shareScheme";

const ActionButtons = ({
    handleSaveScheme,
    isSaving,
    isSaved,
    contentRef,
    schemeName
}) => {
    return (
        <div className="flex flex-wrap gap-3 pt-6 border-t-4 border-swiss-black font-inter">
            <button
                onClick={handleSaveScheme}
                disabled={isSaving}
                className={`px-6 py-4 font-black uppercase text-xs tracking-widest flex items-center gap-2 border-4 border-swiss-black transition-colors duration-150 ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                    isSaved
                        ? 'bg-swiss-accent text-swiss-white border-swiss-accent hover:bg-swiss-black'
                        : 'bg-swiss-black text-swiss-white hover:bg-swiss-accent'
                }`}
            >
                <Bookmark
                    className={`${isSaved ? 'fill-swiss-white' : ''}`}
                    size={16}
                />
                {isSaving ? 'PROCESSING...' : isSaved ? 'SAVED' : 'SAVE SCHEME'}
            </button>

            <button
                onClick={() => generatePDF(contentRef, schemeName)}
                className="px-6 py-4 bg-swiss-white text-swiss-black font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-colors duration-150 flex items-center gap-2"
            >
                <Download size={16} />
                DOWNLOAD PDF
            </button>

            <button
                onClick={() => shareScheme(schemeName)}
                className="px-6 py-4 bg-swiss-white text-swiss-black font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-swiss-accent hover:text-swiss-white hover:border-swiss-accent transition-colors duration-150 flex items-center gap-2"
            >
                <Share2 size={16} />
                SHARE SPECIFICATION
            </button>
        </div>
    );
};

export default ActionButtons;
