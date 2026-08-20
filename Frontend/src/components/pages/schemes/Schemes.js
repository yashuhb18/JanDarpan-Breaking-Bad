import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { Search } from 'lucide-react';
import SchemeSearch from "./SchemeSearch";
import SchemeCard from "../../common/schemeCard/SchemeCard";
import { getFilteredSchemes, getAllSchemes } from '../../../services/schemes/schemeService';
import Pagination from '../../common/pagination/Pagination';
import { useLanguage } from '../../../context/LanguageContext';
import Recommendations from '../home/components/Recommendations';

import SchemeEligibilityModal from './SchemeEligibilityModal';
import { Sparkles } from 'lucide-react';

const Schemes = () => {
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get("category");
    const searchQuery = searchParams.get("search");

    const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const [filters, setFilters] = useState(() => {
        const initFilters = {};
        if (categoryQuery) initFilters.category = categoryQuery;
        if (searchQuery) initFilters.search = searchQuery;
        return initFilters;
    });
    const [error, setError] = useState(null);
    const { t, translateText } = useLanguage();

    useEffect(() => {
        const newFilters = {};
        if (categoryQuery) newFilters.category = categoryQuery;
        if (searchQuery) newFilters.search = searchQuery;
        if (Object.keys(newFilters).length > 0) {
            setFilters(newFilters);
            setCurrentPage(1);
        }
    }, [categoryQuery, searchQuery]);

    const fetchSchemes = useCallback(async (page) => {
        try {
            setLoading(true);
            setError(null);
            let data;
            
            if (Object.keys(filters).length > 0) {
                data = await getFilteredSchemes(filters, page);
            } else {
                data = await getAllSchemes(page);
            }

            setSchemes(data.schemes || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalSchemes(data.totalSchemes || 0);
        } catch (err) {
            setError(typeof err === 'string' ? err : "Failed to fetch schemes. Please try again.");
            console.error('Error fetching schemes:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchSchemes(currentPage);
    }, [currentPage, fetchSchemes]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearch = async (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const schemesCountText = totalSchemes > 0 
        ? `${t('dir_showing')} ${(currentPage-1)*9 + 1}–${Math.min(currentPage*9, totalSchemes)} ${t('dir_of')} ${totalSchemes} ${t('dir_schemes')}`
        : '';

    return (
        <div className="bg-swiss-white min-h-screen font-inter">
            {/* Page header */}
            <div className="border-b-4 border-swiss-black px-6 md:px-12 py-6 bg-swiss-muted swiss-grid-pattern flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">DIRECTORY</span>
                    <h1 className="text-4xl md:text-6xl font-black text-swiss-black uppercase tracking-tighter leading-[0.9]">
                        {t('dir_title')} {filters.category ? `(${translateText(filters.category)})` : ''}
                    </h1>
                </div>

                <button
                    onClick={() => setIsCalcModalOpen(true)}
                    className="bg-swiss-accent text-swiss-white px-6 py-4 font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-swiss-black transition-colors flex items-center gap-2 shadow-brutal cursor-pointer shrink-0"
                >
                    <Sparkles size={18} />
                    <span>⚡ CHECK MY ELIGIBILITY IN 10 SECONDS →</span>
                </button>
            </div>

            {/* Personalized Recommendations Section */}
            <Recommendations />

            {/* Search area */}
            <div className="border-b-4 border-swiss-black p-6 md:p-8 bg-swiss-muted swiss-dots">
                <SchemeSearch onSearch={handleSearch} initialFilters={filters} />
            </div>

            {/* Results metadata */}
            {!loading && schemesCountText && (
                <div className="border-b-2 border-swiss-black px-6 md:px-12 py-3 flex items-center justify-between bg-swiss-white">
                    <span className="text-swiss-black font-bold text-xs uppercase tracking-widest">{schemesCountText}</span>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">PAGE {currentPage}/{totalPages}</span>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="p-12 flex items-center gap-4">
                    <div className="w-6 h-6 border-4 border-swiss-black border-t-swiss-accent animate-spin"></div>
                    <span className="font-black text-sm uppercase tracking-widest text-swiss-black">Loading relevant schemes...</span>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="m-6 md:m-12 bg-swiss-accent text-swiss-white p-6 border-4 border-swiss-black flex items-center justify-between" role="alert">
                    <span className="font-black text-xs uppercase tracking-widest">{error}</span>
                    <button
                        onClick={() => fetchSchemes(currentPage)}
                        className="bg-swiss-black text-swiss-white px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-swiss-white hover:text-swiss-black transition-colors"
                    >
                        {t('btn_retry')}
                    </button>
                </div>
            )}

            {/* Schemes grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {schemes.map((scheme) => (
                    <Link
                        to={`/scheme/${scheme._id}`}
                        key={scheme._id}
                    >
                        <SchemeCard
                            key={scheme._id}
                            scheme={scheme}
                        />
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {!loading && schemes.length > 0 && (
                <div className="border-t-4 border-swiss-black p-6 md:p-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Empty state */}
            {schemes.length === 0 && !loading && !error && (
                <div className="p-12 md:p-24 flex flex-col items-center border-t-4 border-swiss-black">
                    <Search size={48} className="text-swiss-black mb-6" />
                    <p className="text-swiss-black font-black text-sm uppercase tracking-widest text-center">
                        No schemes found matching the selected category. Try resetting or adjusting your search filters.
                    </p>
                </div>
            )}
            {/* Eligibility Calculator Modal */}
            <SchemeEligibilityModal
                isOpen={isCalcModalOpen}
                onClose={() => setIsCalcModalOpen(false)}
            />
        </div>
    );
};

export default Schemes;
