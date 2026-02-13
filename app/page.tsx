import AboutUs from "@/components/landing-page/AboutUs";
import Features from "@/components/landing-page/Features";
import Footer from "@/components/landing-page/Footer";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Pricing from "@/components/landing-page/Pricing";
import ReadySection from "@/components/landing-page/ReadySection";
import LandingNav from "@/components/layout/LandingNav";





export default function Page() {
    return (
        <div className="bg-[#0C0B0B] w-full h-full relative " >
            <LandingNav />
            <Hero/>
            <Features />
            <HowItWorks />
            <Pricing />
            <AboutUs />
            <ReadySection />
            <Footer/>
        </div>
    )
}