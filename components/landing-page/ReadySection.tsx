"use client"



import { CirclePlay } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";





export default function ReadySection() {
    const [active, setActive] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev === 0 ? 1 : 0))
        }, 5000);

        return () => clearInterval(interval)
    }, [])

    return (
        <section className=" w-full px-[4%]  py-16 pb-24 flex items-center justify-center  " >



            <div className="w-full max-w-231.5 rounded-[20px] py-10 px-5 flex flex-col items-center gap-15.5 text-center bg-white/25 relative overflow-hidden " >


                <div className="absolute w-full h-full inset-0 opacity-47 "  >

                    <motion.div
                        animate={{ opacity: active === 0 ? 1 : 0 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full bg-[linear-gradient(146.31deg,#FD703C_16.05%,#CF1F1F_94.91%)] relative " >
                        <div className=" size-50 md:size-[218.57px] rounded-full absolute -top-12.5 -right-12.5 bg-[linear-gradient(180deg,#EC008C_31.25%,#FC6767_73.75%)]  " />
                    </motion.div>


                    <motion.video
                        animate={{ opacity: active === 1 ? 1 : 0 }}
                        transition={{ duration: 1 }}
                        src="/GIFs/PinDown.io_@royaltyfreegraphic_1770796208 (1).mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className=" object-center object-cover absolute top-0 left-0 h-full w-full "
                    ></motion.video>
                </div>


                <div className="flex items-center justify-center flex-col gap-4 w-full max-w-2xl z-10 " >
                    <h1 className="text-[#FFFFFF] font-bold text-2xl md:text-[40px] font-satoshi " >Ready to simplify your <br className="hidden md:block" />crypto payments?</h1>
                    <p className="font-satoshi text-base font-normal text-[#FFFFFF] " >Join thousands of users who've ditched the calculators and complexity.</p>
                </div>



                <div className="w-fit flex flex-row items-center gap-5.5 font-roboto z-10 " >
                    <Button variant={"outline"} className=" px-2.5! py-6! text-lg md:text-2xl font-normal text-white bg-transparent! border border-white! cursor-pointer  "><CirclePlay /> Watch Demo</Button>
                    <Button variant={"default"} className=" px-2.5! py-6! text-lg md:text-2xl font-normal text-[#1a1a1a] cursor-pointer " >Start For Free</Button>
                </div>


            </div>
        </section>
    )
}