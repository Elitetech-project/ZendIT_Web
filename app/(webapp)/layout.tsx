"use client"

import AuthForm from "@/components/AuthForm"
import OnboardingScreen from "@/components/Onboarding"
import { useMobile } from "@/hooks/use-mobile"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"





export default function WebAppLayout({ children }: { children: React.ReactNode }) {
    const { isLoading: mobileLoading, isMobile } = useMobile()
    const [showOnBoarding, setShowOnboarding] = useState(false)
    const [user, setUser] = useState<User | null>(null)




    // Check if the onboarding screen has been displayed to the user before
    useEffect(() => {
        const completed = localStorage.getItem("onboardingCompleted")
        if (!completed) {
            setShowOnboarding(true)
        }
    }, [])



    // marks the end of the display of the onboarding screen
    const handleFinish = () => {
        localStorage.setItem("onboardingCompleted", "true");
        setShowOnboarding(false);
    };


    useEffect(() => {

        const checkUser = async () => {
            const { data: currentUser, error } = await supabase.auth.getUser()

            if (user) {
                setUser(currentUser.user ?? null)
            }

            else {
                console.error(error)
            }
        }


        checkUser()


        // listen for state changes in the layout
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }

    }, [])




    if (mobileLoading) {
        return (
            <div>Loading ...</div>
        )
    }


    if (!isMobile) {
        return (
            <div className="flex h-screen items-center justify-center w-full flex-col gap-4 p-4 ">
                <h1 className="text-2xl text-[#EF8F57] font-bold font-merriweather">Desktop view is not supported.</h1>
                <p className="text-sm text-[#1e1e1e]  font-lato ">Please switch to a mobile for better experience</p>
                <div className="w-fit flex items-center gap-5" >
                </div>
            </div>
        );
    }





    if (isMobile && showOnBoarding) {
        return (
            <OnboardingScreen onFinish={handleFinish} />
        )
    }

    if (!user) {
        return (
            <div className="w-full h-screen flex justify-center px-[5%] py-6 " > <AuthForm/> </div>
        )
    }


    return (
        <div className=" bg-[#FAFBFC] w-full h-full relative flex items-start text-black " >
            {children}
        </div>
    )
}