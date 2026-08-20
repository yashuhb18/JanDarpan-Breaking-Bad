import React from 'react';
import { FileText } from 'lucide-react';
import DisplayFormatted from './DisplayFormatted';

const ApplicationSection = ({ applicationProcess }) => {
    return (
        <section className="space-y-4 font-inter">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center text-swiss-black">
                <FileText className="mr-2 text-swiss-accent" size={18} />
                HOW TO APPLY
            </h2>
            {applicationProcess?.map((process, index) => (
                <div key={index} className="border-4 border-swiss-black p-6 bg-swiss-muted">
                    <h3 className="font-black text-xs uppercase tracking-widest text-swiss-accent mb-3">{process?.mode}:</h3>
                    <DisplayFormatted benefitsData={process?.process} />
                </div>
            ))}
        </section>
    );
};

export default ApplicationSection;
