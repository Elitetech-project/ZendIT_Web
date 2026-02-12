import Features from "@/components/landing-page/Features";
import HowItWorks from "@/components/landing-page/HowItWorks";
import LandingNav from "@/components/layout/LandingNav";





export default function Page() {
    return (
        <div className="bg-[#0C0B0B] w-full h-full relative " >
            <LandingNav />
            <Features/>
            <HowItWorks/>
            Landing page
        </div>
    )
}