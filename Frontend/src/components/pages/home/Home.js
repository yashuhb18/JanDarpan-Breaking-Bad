import AboutUs from "./components/AboutUs";
import Categories from "./components/Categories";
import FAQ from "./components/FAQ";
import HeroSection from "./components/HeroSection";
import HowToApply from "./components/HowToApply";
import TotalSchemes from "./components/TotalSchemes";
import OurServices from "./components/OurServices";

const Home = () => {
    return (
        <div className="overflow-x-hidden bg-swiss-white font-inter">
            <div className="w-full">
                <HeroSection />
                <TotalSchemes />
                <Categories />
                <OurServices />
                <HowToApply />
                <AboutUs />
                <FAQ />
            </div>
        </div>
    );
};

export default Home;
