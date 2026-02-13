import { pricingPlans } from "@/data/pricingData";
import { Button } from "../ui/button";
import { CircleCheck } from "lucide-react";



export default function Pricing() {
    return (
        <section id="pricing" className="w-full h-fit flex items-center justify-center flex-col py-20 md:py-28 px-[8%] md:px-[5%] gap-18 font-satoshi  "  >


            <div className=" flex flex-col gap-4 items-center justify-center text-center z-10 " >
                <h2 className="font-roboto text-[#FE703B] font-bold text-lg md:text-2xl " >Pricing</h2>
                <h3 className=" text-white font-bold text-2xl md:text-[40px] " >Simple, transparent pricing</h3>
                <p className="text-[#FFFFFF] font-normal text-base md:text-xl " >Choose the plan that fits your needs. No hidden fees, no surprises.</p>
            </div>






            <div className="w-full max-w-306.25 grid grid-cols-1 md:grid-cols-3 gap-5 place-items-center justify-items-center justify-center "  >

                {
                    pricingPlans.map((plan, i) => (
                        <div key={i} className=" w-full max-w-98.75 h-full p-0.5 rounded-[8px] overflow-hidden relative " >
                            <div className="absolute inset-0  overflow-hidden  z-0 " >
                                <video
                                    src="/GIFs/PinDown.io_@Dafi20000_1770796636.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover "
                                >
                                </video>
                            </div>

                            <div className="w-full  h-full rounded-[8px] flex flex-col items-start justify-between gap-14.5 bg-[#0C0B0B] backdrop-blur-[27px] px-6 py-9 z-10" >
                                <div className="w-full flex flex-col items-start gap-6" >

                                    <div className="flex flex-col items-start gap-2 font-satoshi" >
                                        <h2 className="font-bold text-white text-2xl md:text-[28px] " > {plan.title} </h2>
                                        <p className="text-base font-normal text-[#FFFFFFB2] " > {plan.description} </p>
                                        <h1 className="text-[#CCCCCC] font-bold text-[27px] md:text-[32px] mt-3 " > {plan.price}{plan.period} </h1>
                                    </div>

                                    <ul className="w-full flex items-start flex-col gap-3 md:gap-6 " >
                                        {plan.features.map((highlight, i) => (
                                            <li key={i} className="text-white font-normal text-[15px] flex items-center gap-3  " ><CircleCheck size={20} color="#FF6B35" /> {highlight}</li>
                                        ))}
                                    </ul>
                                </div>


                                {
                                    plan.id === "enterprise" ? (
                                        <Button variant={"outline"} className="w-full max-w-71.25  mx-auto rounded-[8px] py-5! px-3! md:px-5! cursor-pointer font-medium text-[#FE703B] border! border-[#FE703B]! text-base md:text-lg " >
                                            {plan.buttonText}
                                        </Button>
                                    ) :
                                        (
                                            <Button variant={"default"} className="w-full max-w-71.25 bg-[linear-gradient(172.25deg,#FE703B_-30.55%,#CF1F1F_245.11%)] mx-auto rounded-[8px] py-5! px-3! md:px-5! cursor-pointer font-medium text-white text-base md:text-lg " >
                                                {plan.buttonText}
                                            </Button>
                                        )
                                }
                            </div>

                        </div>
                    ))
                }


            </div>



        </section>
    )
}