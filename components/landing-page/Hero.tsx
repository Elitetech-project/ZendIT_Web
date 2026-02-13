import { CirclePlay } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";



export default function Hero() {
    return (
        <section className="w-full min-h-[120vh] md:min-h-screen relative font-satoshi  " >

            {/* ---------------------------- Background GIF ---------------------  */}
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

            {/* ------------------------------- overlay ---------------------- */}
            <div className="bg-[#000000]/75 absolute inset-0 h-full w-full z-10 " />




            <div className="w-full h-fit flex flex-col md:flex-row items-start justify-center z-20 absolute top-0 left-0 px-[3%] lg:px-[6%]  " >

                <div className=" w-full max-w-2xl h-full  md:basis-1/2 flex flex-col items-start justify-between gap-18 md:gap-20  py-8 px-1 " >

                    <div className=" bg-[#F57D2E1A] p-2.5 rounded-[8px] border border-[#F57D2E36] text-sm md:text-base font-normal text-[#FE703B] " >
                        No Crypto Maths Required
                    </div>

                    <div className="w-full flex flex-col items-start gap-12 max-w-162  " >
                        <h1 className=" text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[140%]  " >Crypto Payment Made <span className="text-[#FE703B] " >Very Simple</span></h1>

                        <p className=" font-normal text-lg md:text-2xl text-white " >Receive crypto, hold balances Flare, and send to bank accounts without touching a calculator or P2P. ZenditPay handles all the complexity so you can focus on what matters.</p>

                        <div className="w-fit flex flex-row items-center gap-5.5 font-roboto " >
                            <Button variant={"outline"} className=" px-2.5! py-6! text-lg md:text-2xl font-normal text-[#FE703B] bg-transparent! border border-[#FE703B]! cursor-pointer  "><CirclePlay /> Watch Demo</Button>
                            <Button variant={"default"} className=" px-2.5! py-6! text-lg md:text-2xl font-normal text-white cursor-pointer bg-[#FE703B] " >Start For Free</Button>
                        </div>
                    </div>


                    <div className=" w-full flex items-center gap-9 md:gap-12 "  >
                        <div className=" flex flex-col items-center gap-2 text-center  " >
                            <span className="text-lg md:text-2xl font-black text-[#FE703B] " >$2.5M+</span>
                            <span className="text-[#CCCCCCCC] font-normal text-sm md:text-base lg:text-2xl " >Transactions Processed</span>
                        </div>


                        <div className=" flex flex-col items-center gap-2 text-center  ">
                            <span className=" text-lg md:text-2xl font-black text-[#FE703B] ">10K+</span>
                            <span className="text-[#CCCCCCCC] font-normal text-sm md:text-base lg:text-2xl ">Active Users</span>
                        </div>


                        <div className=" flex flex-col items-center gap-2 text-center  ">
                            <span className=" text-lg md:text-2xl font-black text-[#FE703B] ">15</span>
                            <span className="text-[#CCCCCCCC] font-normal text-sm md:text-base lg:text-2xl ">Countries</span>
                        </div>
                    </div>
                </div>



                {/* The image  */}
                <div className=" w-full h-full my-auto md:basis-1/2  flex items-center justify-center  " >
                    <div className="w-full  h-fit relative" >
                        <Image src={"/homepage-images/phone.png"} alt="image" height={1000} width={1000} className=" w-full h-auto  " />

                        <div className="absolute top-6 md:top-12 left-[55%] md:left-[52%] z-10 w-28.25 h-auto bg-[#FFFFFF1A] rounded-[8px] text-[#FFFFFF] font-bold text-[10px] py-4 px-2 flex  flex-col  gap-2 border border-white/40 " >
                            <span className=" bg-white size-7 rounded-[8px] flex items-center justify-center  " >
                                <Image src={"/GIFs/lightning.gif"} alt="gif" height={20} width={20} />
                            </span>
                            <div>
                                <p>0% Crypto math</p>
                                <p className="text-[#FE703B] " >100% Easy</p>
                            </div>
                        </div>

                        <div className="absolute top-27 md:top-32 left-[70%] md:left-[60%] z-30 w-28.25 h-auto bg-[#FFFFFF1A] rounded-[8px] text-[#FFFFFF] font-bold text-[10px] py-4 px-2 flex  flex-col  gap-2 border border-white/40 " >
                            <span className=" bg-white size-7 rounded-[8px] flex items-center justify-center  " >
                                <Image src={"/GIFs/hundred.gif"} alt="gif" height={20} width={20} />
                            </span>
                            <div>
                                <p>Instant Conversion</p>
                                <p className="text-[#FE703B] " >Direct from wallet</p>
                            </div>
                        </div>




                        <div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}