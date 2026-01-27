"use client"

import OnboardingScreen from "@/components/Onboarding"
import { useEffect, useState } from "react"





export default function WebAppLayout({ children }: { children: React.ReactNode }) {
    // const [showOnBoarding, setShowOnboarding] = useState(false)




    // Check if the onboarding screen has been displayed to the user before
    // useEffect(() => {
    //     const completed = localStorage.getItem("onboardingCompleted")
    //     if (!completed) {
    //         setShowOnboarding(true)
    //     }
    // }, [])



    // marks the end of the display of the onboarding screen
    // const handleFinish = () => {
    //     localStorage.setItem("onboardingCompleted", "true");
    //     setShowOnboarding(false);
    // };





    // if (showOnBoarding) {
    //     return (
    //         <OnboardingScreen onFinish={handleFinish} />
    //     )
    // }


    return (
        <div className=" bg-[#FAFBFC] w-full h-full relative flex items-start text-black " >
            {children}
        </div>
    )
}