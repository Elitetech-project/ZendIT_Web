import { Providers } from "@/components/providers";
import { Metadata } from "next";
import React from "react";



export const metadata: Metadata = {
    title: "Dashbard | ZendIt",
    description: "User dashboard"
}



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Providers>
            {children}
            </Providers>
        </div>
    )
}