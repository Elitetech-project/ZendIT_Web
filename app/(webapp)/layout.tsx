"use client"

import { useMobile } from "@/hooks/use-mobile"





export default function WebAppLayout({ children }: { children: React.ReactNode }) {
    const { isLoading: mobileLoading, isMobile } = useMobile()




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




    return (
        <div className=" bg-[#FAFBFC] w-full h-full relative flex items-start text-black " >
            {children}
        </div>
    )
}