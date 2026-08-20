import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import banner2 from "../../../../assets/banner2.webp";
import banner3 from "../../../../assets/banner3.jpg";
import banner4 from "../../../../assets/banner4.jpg";
import indianRupeeBanner from "../../../../assets/indian_rupee_currency.png";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

const HeroSection = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const images = [
        {
            src: banner2,
            title: "AGRICULTURE & FARMER WELFARE",
            subtitle: "Direct financial assistance & crop insurance programs nationwide",
            priority: true
        },
        {
            src: banner3,
            title: "CITIZEN HEALTHCARE & INSURANCE",
            subtitle: "Cashless medical treatment & hospitalization support",
            priority: false
        },
        {
            src: banner4,
            title: "SKILLS, HOUSING & EMPLOYMENT",
            subtitle: "Urban housing subsidies & youth apprenticeship training",
            priority: false
        },
        {
            src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop",
            fallbackSrc: banner3,
            title: "WOMEN & CHILD EMPOWERMENT",
            subtitle: "Maternity benefit cash transfers & girl child education incentives",
            priority: false
        },
        {
            src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop",
            fallbackSrc: banner2,
            title: "CIVIC INFRASTRUCTURE & AUDIT",
            subtitle: "Pothole tracking, roadwork safety & 7-day High Court legal notices",
            priority: false
        },
        {
            src: indianRupeeBanner,
            title: "FINANCIAL INCLUSION & DIGITAL INDIA",
            subtitle: "Direct benefit transfer (DBT) & zero-balance Jan Dhan banking (₹ INR)",
            priority: false
        }
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleExplore = () => {
        navigate("/schemes");
    };

    return (
        <section className="relative bg-swiss-white font-inter swiss-grid-pattern border-b border-black/10 p-6 md:p-12">
            {/* Main Asymmetric Hero Headline */}
            <div className="mb-10 md:mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end max-w-7xl mx-auto">
                <div className="md:col-span-8">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-swiss-black uppercase tracking-tighter leading-[0.92] text-left">
                        {t('hero_title_1')} <br />
                        <span className="text-swiss-accent">{t('hero_title_2')}</span>
                    </h1>
                </div>
                
                <div className="md:col-span-4 flex flex-col justify-between space-y-6 border-l-2 border-swiss-black/20 pl-6 md:pl-8">
                    <p className="text-swiss-black font-semibold text-base leading-relaxed tracking-tight">
                        {t('hero_subtitle')}
                    </p>

                    <div className="space-y-3 pt-2">
                        <button
                            onClick={handleExplore}
                            className="w-full bg-swiss-black text-swiss-white hover:bg-swiss-accent hover:text-swiss-white border-2 border-swiss-black rounded-full px-6 py-4 font-black uppercase text-sm tracking-widest transition-all duration-200 flex items-center justify-between group shadow-sm cursor-pointer"
                            aria-label="Explore Government Schemes"
                        >
                            <span>{t('hero_search_btn')}</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Redesigned Premium Hero Visual Showcase Frame */}
            <div className="max-w-7xl mx-auto border-2 border-swiss-black rounded-2xl bg-swiss-white grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-md">
                {/* Control Panel */}
                <div className="md:col-span-4 p-8 bg-swiss-black text-swiss-white flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-white/10">
                    <div>
                        <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">
                            FEATURED INITIATIVE 0{currentIndex + 1} / 0{images.length}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-3">
                            {images[currentIndex].title}
                        </h3>
                        <p className="text-swiss-white/70 font-medium text-xs uppercase tracking-wider leading-relaxed">
                            {images[currentIndex].subtitle}
                        </p>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-8 border-t border-swiss-white/20 mt-6">
                        <span className="font-black text-xs uppercase tracking-widest text-swiss-accent">
                            SLIDE 0{currentIndex + 1}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={prevSlide}
                                className="bg-swiss-white text-swiss-black hover:bg-swiss-accent hover:text-swiss-white rounded-full p-3 transition-colors duration-150 shadow-sm"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="bg-swiss-white text-swiss-black hover:bg-swiss-accent hover:text-swiss-white rounded-full p-3 transition-colors duration-150 shadow-sm"
                                aria-label="Next slide"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Un-cut High Resolution Image Banner */}
                <div className="md:col-span-8 relative h-64 md:h-80 overflow-hidden bg-swiss-black">
                    <img
                        key={currentIndex}
                        src={images[currentIndex].src}
                        onError={(e) => {
                            if (images[currentIndex].fallbackSrc) {
                                e.target.src = images[currentIndex].fallbackSrc;
                            }
                        }}
                        alt={images[currentIndex].title}
                        className="w-full h-full object-cover object-center transition-all duration-500 transform scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-swiss-accent text-swiss-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-white/20 shadow-md z-10">
                        ACTIVE SPOTLIGHT
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;