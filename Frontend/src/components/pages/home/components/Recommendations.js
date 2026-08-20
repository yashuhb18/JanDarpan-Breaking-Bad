import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { UserContext } from '../../../../context/UserContext';
import SchemeCard from '../../../common/schemeCard/SchemeCard';
import { getPersonalizedRecommendations } from '../../../../services/recommendations/recommendationService';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isUserLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!isUserLoggedIn) return;

            try {
                setLoading(true);
                const data = await getPersonalizedRecommendations();
                console.log(data.schemes);
                setRecommendations(data.schemes);
            } catch (err) {
                setError("Failed to fetch recommendations");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [isUserLoggedIn]);

    if (!isUserLoggedIn) {
        return (
            <section className="border-b-2 border-swiss-black font-inter">
                <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-white">
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">07. PERSONALIZED</span>
                    <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">RECOMMENDATIONS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 border-b-2 border-swiss-black">
                    <div className="md:col-span-8 p-8 md:p-12 bg-swiss-black flex flex-col justify-center">
                        <h2 className="text-4xl md:text-6xl font-black text-swiss-white uppercase tracking-tighter leading-[0.9] mb-4">
                            GET PERSONALIZED<br />
                            <span className="text-swiss-accent">RECOMMENDATIONS.</span>
                        </h2>
                        <p className="text-swiss-white/70 font-medium text-sm leading-relaxed max-w-lg mb-8">
                            Create an account to receive scheme recommendations tailored to your profile, income group, location, and interests.
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-swiss-accent text-swiss-white px-8 py-4 font-black uppercase text-sm tracking-widest hover:bg-swiss-white hover:text-swiss-black transition-colors duration-150 w-fit border-2 border-swiss-accent"
                        >
                            SIGN UP NOW →
                        </button>
                    </div>
                    <div className="md:col-span-4 bg-swiss-muted swiss-diagonal border-l-2 border-swiss-black flex items-center justify-center p-12">
                        {/* Geometric composition */}
                        <div className="relative w-full max-w-[200px] aspect-square">
                            <div className="absolute top-0 left-0 w-3/4 h-3/4 border-2 border-swiss-black"></div>
                            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-swiss-accent"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-swiss-black"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="border-b-4 border-swiss-black font-inter p-12">
                <div className="flex items-center gap-4">
                    <div className="w-6 h-6 border-4 border-swiss-black border-t-swiss-accent animate-spin"></div>
                    <span className="font-black text-sm uppercase tracking-widest text-swiss-black">Loading recommendations...</span>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="border-b-4 border-swiss-black font-inter p-12">
                <div className="bg-swiss-accent text-swiss-white p-6 border-4 border-swiss-black">
                    <span className="font-black text-sm uppercase tracking-widest">{error}</span>
                </div>
            </section>
        );
    }

    return (
        <section className="border-b-4 border-swiss-black font-inter">
            <div className="border-b-2 border-swiss-black px-6 md:px-12 py-4 flex items-center justify-between bg-swiss-muted swiss-dots">
                <span className="text-swiss-accent font-black text-xs uppercase tracking-widest">07. PERSONALIZED</span>
                <span className="text-swiss-black font-black text-xs uppercase tracking-wider hidden md:block">RECOMMENDED FOR YOU</span>
            </div>
            {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((scheme) => (
                        <Link to={`/scheme/${scheme._id}`} key={scheme._id}>
                            <SchemeCard scheme={scheme} />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-12 flex flex-col items-center">
                    <Search size={48} className="text-swiss-black mb-4" />
                    <p className="text-swiss-black font-black text-sm uppercase tracking-widest text-center">
                        No recommendations found. Complete your profile for personalized suggestions.
                    </p>
                </div>
            )}
        </section>
    );
};

export default Recommendations;
