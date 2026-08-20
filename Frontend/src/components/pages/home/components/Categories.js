import { GraduationCap, Heart, Users, Briefcase, Home, Sprout, BookOpen, Truck, Sun, Wifi, Shield, Landmark, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";

const CategoryCard = ({ icon: Icon, titleKey, categoryParam, count }) => {
    const { t } = useLanguage();
    return (
        <div
            className="border-2 border-swiss-black p-6 md:p-8 bg-swiss-white cursor-pointer group hover:bg-swiss-accent transition-colors duration-150 flex flex-col justify-between min-h-[190px] h-full"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 border-2 border-swiss-black flex items-center justify-center bg-swiss-muted group-hover:bg-swiss-white transition-colors duration-150">
                    <Icon size={24} className="text-swiss-black" />
                </div>
                <ArrowUpRight
                    size={20}
                    className="text-swiss-black group-hover:text-swiss-white transition-all duration-150 group-hover:rotate-0 -rotate-45"
                />
            </div>
            <div>
                <h3 className="text-lg font-black text-swiss-black uppercase tracking-tight group-hover:text-swiss-white transition-colors duration-150 mb-1">
                    {t(titleKey)}
                </h3>
                <p className="text-swiss-black text-xs font-extrabold uppercase tracking-wider opacity-70 group-hover:text-swiss-white group-hover:opacity-90 transition-colors duration-150">
                    {count} {t('dir_schemes')}
                </p>
            </div>
        </div>
    );
};

const Categories = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const categories = [
        { icon: GraduationCap, titleKey: "cat_edu", categoryParam: "Education & Learning", count: "180+" },
        { icon: Heart, titleKey: "cat_health", categoryParam: "Health & Wellness", count: "160+" },
        { icon: Users, titleKey: "cat_women", categoryParam: "Women and Child", count: "150+" },
        { icon: Briefcase, titleKey: "cat_employ", categoryParam: "Skills & Employment", count: "190+" },
        { icon: Home, titleKey: "cat_housing", categoryParam: "Housing & Shelter", count: "140+" },
        { icon: Sprout, titleKey: "cat_agri", categoryParam: "Agriculture,Rural & Environment", count: "210+" },
        { icon: BookOpen, titleKey: "cat_skill", categoryParam: "Skills & Employment", count: "135+" },
        { icon: Landmark, titleKey: "cat_bank", categoryParam: "Banking, Financial Services and Insurance", count: "175+" },
        { icon: Sun, titleKey: "cat_energy", categoryParam: "Utility & Sanitation", count: "120+" },
        { icon: Wifi, titleKey: "cat_digital", categoryParam: "Science, IT & Communications", count: "145+" },
        { icon: Shield, titleKey: "cat_welfare", categoryParam: "Social welfare & Empowerment", count: "220+" },
        { icon: Truck, titleKey: "cat_transport", categoryParam: "Transport & Infrastructure Sports & Culture", count: "130+" },
    ];

    const handleCategoryClick = (categoryParam) => {
        navigate(`/schemes?category=${encodeURIComponent(categoryParam)}`);
    };

    return (
        <section className="border-b-2 border-swiss-black font-inter">
            {/* Section header */}
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-white">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">{t('cat_tag')}</span>
                </div>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">{t('cat_header')}</span>
            </div>

            {/* Categories grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category, index) => (
                    <div key={index} onClick={() => handleCategoryClick(category.categoryParam)}>
                        <CategoryCard {...category} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categories;
