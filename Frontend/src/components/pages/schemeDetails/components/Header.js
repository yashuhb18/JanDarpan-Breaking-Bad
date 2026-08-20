import React from 'react';

const Header = ({ schemeName, schemeShortTitle }) => {
    return (
        <header className="border-b-4 border-swiss-black pb-6 font-inter">
            <h1 className="text-3xl md:text-5xl font-black mb-2 text-swiss-black uppercase tracking-tighter">{schemeName}</h1>
            {schemeShortTitle && (
                <p className="text-swiss-accent font-bold text-xs uppercase tracking-widest">({schemeShortTitle})</p>
            )}
        </header>
    );
};

export default Header;
