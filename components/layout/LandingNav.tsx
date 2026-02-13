"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";




const navLinks = [
    {
        label: "Features",
        path: "/#features"
    },

    {
        label: "How it works",
        path: "/#how-it-works"
    },

    {
        label: "Pricing",
        path: "/#pricing"
    },

    {
        label: "About",
        path: "/#about"
    },
]


export default function LandingNav() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)



    useEffect(() => {
        document.body.style.overflowY = showMobileMenu ? "hidden" : "auto"

        return () => { document.body.style.overflowY = "auto" }
    }, [showMobileMenu])



    return (
        <nav className="bg-[#FFFFFF1A] flex items-center justify-between gap-10 py-4 px-[5%] w-full font-roboto relative " >
            <Link href={"/"}>
                <Image src={"/logos/Zendit_logo.png"} alt="logo" height={75} width={75} className="w-10 md:w-14 h-auto  " />
            </Link>


            {/* Navigation links */}
            <ul className="hidden md:flex w-fit items-baseline gap-6 " >
                {
                    navLinks.map((link, i) => (
                        <li key={i} className="text-lg font-normal text-white transition-all duration-200 ease-in-out hover:text-[#e33e38] " >
                            <Link href={link.path} >
                                {link.label}
                            </Link>
                        </li>
                    ))
                }

            </ul>




            <div className=" md:w-full max-w-70 flex items-center justify-between gap-5 " >
                {/* <div className="hidden md:block " >
                    <ThemeBtn className="text-white! hover:bg-transparent!" />
                </div> */}





                <Link href={"/login"} className="hidden md:block " >
                    <Button variant={"default"} className="bg-[linear-gradient(172.25deg,#FE703B_-30.55%,#CF1F1F_245.11%)] rounded-[8px] py-5! px-3! md:px-5! cursor-pointer font-medium text-white text-base md:text-lg " >
                        Get started
                    </Button>
                </Link>


                <button onClick={() => setShowMobileMenu(true)} className=" block md:hidden " >
                    <Menu className="text-white" />
                </button>
            </div>


            <div className={`h-screen fixed top-0 left-0 w-full bg-[#0C0B0B] z-50  duration-300 ease-in-out transition-all py-6 px-7 flex flex-col items-start gap-7 ${showMobileMenu ? "translate-x-0" : "translate-x-[100%]"} `} >
                <button className="text-[#e33e38] lg:hidden ml-auto " onClick={() => setShowMobileMenu(false)} ><X size={28} /> </button>

                <ul className="flex flex-col items-start gap-10  " >
                    {
                        navLinks.map((link, i) => (
                            <li key={i} className="text-lg font-normal text-white transition-all duration-200 ease-in-out hover:text-[#e33e38] " >
                                <Link href={link.path} >
                                    {link.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>

                <Link href={"/login"} className="w-full " >
                    <Button variant={"default"} className="bg-[linear-gradient(172.25deg,#FE703B_-30.55%,#CF1F1F_245.11%)] rounded-[8px] py-5! px-5! cursor-pointer font-medium text-white text-lg " >
                        Get started
                    </Button>
                </Link>

            </div>


        </nav>
    )
}

