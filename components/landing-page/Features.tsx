"use client"

import { featuresData } from "@/data/featuresData";
import { motion } from "framer-motion"



export default function Features() {


    return (
        <section className="w-full h-fit flex items-center justify-center flex-col py-20 md:py-28 px-[8%] md:px-[5%] gap-18 font-satoshi relative  " >

            <div className="absolute inset-0  overflow-hidden  z-10 " >
                <video
                    src="/GIFs/PinDown.io_@GoharArt_7_1770796794.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover "
                >
                </video>
            </div>

            <div className="bg-[#000000]/85 absolute inset-0 h-full w-full z-10 " />

            <div className=" flex flex-col gap-4 items-center justify-center text-center z-10 " >
                <h2 className="font-roboto text-[#FE703B] font-bold text-lg md:text-2xl " >Features</h2>
                <h3 className=" text-white font-bold text-2xl md:text-[40px] " >Everything you need to manage crypto payments</h3>
                <p className="text-[#FFFFFF] font-normal text-base md:text-xl " >Built for individuals, teams, and organizations who want crypto payments without the headache.</p>
            </div>



            <div className="w-full max-w-306.25 z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center justify-center justify-items-center gap-8  " >

                {
                    featuresData.map((feature, i) => {

                        const Icon = feature.icon

                        return (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 1}}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                key={i} className=" w-full h-full flex flex-col items-start gap-4 rounded-[8px] bg-[#FFFFFF12] border border-[#FFFFFF5C] hover:border-[#FE703B] backdrop-blur-[27px] py-5 px-4 pb-16 duration-200 ease-in-out transition-all " >
                                <span className="size-10 flex items-center justify-center py-0.5 px-0.5 bg-white text-[#FE703B] rounded-[8px] " >
                                    <Icon className=" w-5 h-auto  " />
                                </span>

                                <div className="flex flex-col items-start gap-2 w-full max-w-75.25  " >
                                    <h4 className="font-roboto text-white font-bold text-base md:text-2xl   " >{feature.title} </h4>
                                    <p className=" font-satoshi text-[#CCCCCC] font-normal text-sm md:text-base  " >{feature.content} </p>
                                </div>

                            </motion.div>
                        )
                    })
                }

            </div>





        </section>
    )
}