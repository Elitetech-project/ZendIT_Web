"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import ThemeBtn from "../ui/ThemeBtn";




const navLinks = [
    {
        label: "Features",
        path: "/features"
    },

    {
        label: "How it works",
        path: "/how-it-works"
    },

    {
        label: "Pricing",
        path: "/pricing"
    },

    {
        label: "About",
        path: "/about"
    },
]


export default function LandingNav() {


    return (
        <nav className="bg-[#FFFFFF1A] flex items-center justify-between gap-10 py-4 px-[5%] w-full font-roboto " >
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
                <div className="hidden md:block " >
                    <ThemeBtn className="text-white! hover:bg-transparent!" />
                </div>





                <Button variant={"default"} className="bg-[linear-gradient(172.25deg,#FE703B_-30.55%,#CF1F1F_245.11%)] rounded-[8px] py-5! px-3! md:px-5! cursor-pointer font-medium text-white text-base md:text-lg " >
                    Get started
                </Button>

            </div>
        </nav>
    )
}

