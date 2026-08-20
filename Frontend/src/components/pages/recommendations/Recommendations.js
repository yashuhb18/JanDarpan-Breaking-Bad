import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SchemeCard from '../../common/schemeCard/SchemeCard';
import Pagination from '../../common/pagination/Pagination';
import { getPersonalizedRecommendations } from '../../../services/recommendations/recommendationService';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const [error, setError] = useState(null);

    const fetchRecommendations = useCallback(async (page) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPersonalizedRecommendations(page);
            
            setRecommendations(data.schemes);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setTotalSchemes(data.totalSchemes);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            setError('Failed to fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations(currentPage);
    }, [currentPage, fetchRecommendations]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const recommendationsCountText = totalSchemes > 0 
        ? `Showing ${(currentPage-1)*9 + 1}–${Math.min(currentPage*9, totalSchemes)} of ${totalSchemes} recommended schemes`
        : '';

    if (loading) {
        return (
            <div className="min-h-screen bg-swiss-white font-inter flex items-center justify-center">
                <div className="flex items-center gap-4">
                    <div className="w-6 h-6 border-4 border-swiss-black border-t-swiss-accent animate-spin"></div>
                    <span className="font-black text-sm uppercase tracking-widest text-swiss-black">Loading recommendations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-swiss-white min-h-screen font-inter">
            {/* Page header */}
            <div className="border-b-4 border-swiss-black px-6 md:px-12 py-6 bg-swiss-muted swiss-grid-pattern">
                <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">CURATED</span>
                <h1 className="text-4xl md:text-6xl font-black text-swiss-black uppercase tracking-tighter leading-[0.9]">
                    RECOMMENDED<br /><span className="text-swiss-accent">FOR YOU.</span>
                </h1>
            </div>

            {/* Error */}
            {error && (
                <div className="m-6 md:m-12 bg-swiss-accent text-swiss-white p-6 border-4 border-swiss-black" role="alert">
                    <span className="font-black text-xs uppercase tracking-widest">{error}</span>
                </div>
            )}

            {/* Results metadata */}
            {recommendationsCountText && (
                <div className="border-b-2 border-swiss-black px-6 md:px-12 py-3 flex items-center justify-between">
                    <span className="text-swiss-black font-bold text-xs uppercase tracking-widest">{recommendationsCountText}</span>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">PAGE {currentPage}/{totalPages}</span>
                </div>
            )}

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((scheme) => (
                    <Link to={`/scheme/${scheme._id}`} key={scheme._id}>
                        <SchemeCard scheme={scheme} />
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {!loading && recommendations.length > 0 && (
                <div className="border-t-4 border-swiss-black p-6 md:p-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Empty state */}
            {recommendations.length === 0 && !loading && (
                <div className="p-12 md:p-24 flex flex-col items-center border-t-4 border-swiss-black">
                    <Search size={48} className="text-swiss-black mb-6" />
                    <p className="text-swiss-black font-black text-sm uppercase tracking-widest text-center">
                        No recommendations found. Please update your profile preferences.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Recommendations;
