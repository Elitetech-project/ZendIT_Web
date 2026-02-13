import GlobalIcon from "../icons/GlobalIcon";
import SecurityObsessed from "../icons/SecurityObsessed";
import SimplicityIcon from "../icons/SimplicityIcon";



export default function AboutUs() {
    return (
        <section id="about" className="w-full h-fit flex items-center justify-center flex-col py-16 px-[8%] md:px-[5%] gap-18 font-satoshi relative">

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

            <div className="bg-[#000000]/75 absolute inset-0 h-full w-full z-10 " />

            <div className=" flex flex-col gap-4 items-center justify-center text-center z-10 max-w-309.5  " >
                <h2 className="font-roboto text-[#FE703B] font-bold text-lg md:text-2xl " >About Us</h2>
                <h3 className=" text-white font-bold text-2xl md:text-[40px] " >Building the future of crypto payments</h3>
                <p className="text-[#FFFFFF] font-normal text-base md:text-xl text-start " >ZenditPay was born from a simple frustration: crypto payments are unnecessarily complicated. We watched talented individuals and businesses struggle with exchange rates, manual conversions, and the constant math required to move money.</p>
                <p className="text-[#FFFFFF] font-normal text-base md:text-xl text-start" >Our mission is to make crypto as simple as traditional banking without sacrificing the benefits of decentralization. We believe everyone should be able to receive, hold, and send crypto without needing a calculator or a finance degree.</p>
            </div>



            <div className="w-full max-w-295.75 grid grid-cols-1 md:grid-cols-3 place-items-center justify-items-center gap-9 md:gap-20.75 z-10 " >


                {/* card 1  */}
                <div className="w-full  flex items-center justify-start gap-4 p-1 " >
                    <span className="size-8.75 shrink-0 bg-[#FE703B] text-white rounded-[8px] py-0.5 px-1 flex items-center justify-center" >
                        <SimplicityIcon size={20} />
                    </span>

                    <div>
                        <h5 className="font-satoshi text-xl md:text-[32px] font-bold text-white " >Simplicity First</h5>
                        <p className="text-[#FFFFFF] font-normal text-base md:text-xl font-satoshi " >We obsess over making complex things simple, not simple things complex.</p>
                    </div>

                </div>

                {/* card 2  */}
                <div className="w-full  flex items-center justify-start gap-4 p-1" >
                    <span className="size-8.75 shrink-0 bg-[#FE703B] text-white rounded-[8px] py-0.5 px-1 flex items-center justify-center " >
                        <SecurityObsessed size={17} />
                    </span>

                    <div>
                        <h5 className="font-satoshi text-xl md:text-[32px] font-bold text-white " >Security Obsessed</h5>
                        <p className="text-[#FFFFFF] font-normal text-base md:text-xl font-satoshi " >Your funds are protected with enterprise-grade security and compliance.</p>
                    </div>

                </div>

                {/* card 3 */}
                <div className="w-full flex items-center justify-start gap-4 p-1" >
                    <span className="size-8.75 shrink-0 bg-[#FE703B] text-white rounded-[8px] py-0.5 px-1 flex items-center justify-center " >
                        <GlobalIcon size={20} />
                    </span>

                    <div>
                        <h5 className="font-satoshi text-xl md:text-[32px] font-bold text-white " >Global by Default</h5>
                        <p className="text-[#FFFFFF] font-normal text-base md:text-xl font-satoshi " >Built for the world, supporting users across 150+ countries.</p>
                    </div>

                </div>

            </div>


            <div className="w-full max-w-145  grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center justify-items-center justify-center z-10 font-satoshi mt-10  " >

                <div className="border border-[#FFFFFF5C] w-full h-28.5 bg-[#FFFFFF05] backdrop-blur-[27px] rounded-[8px] flex items-center justify-center flex-col gap-2 py-4 px-4 " >
                    <h5 className="text-[#FE703B] font-black text-xl md:text-2xl text-center" >2026</h5>
                    <p className="text-[#CCCCCCCC] font-normal text-base md:text-xl text-center  " >Founded</p>
                </div>

                <div className="border border-[#FFFFFF5C] w-full h-28.5 bg-[#FFFFFF05] backdrop-blur-[27px] rounded-[8px] flex items-center justify-center flex-col gap-2 py-4 px-4 " >
                    <h5 className="text-[#FE703B] font-black text-xl md:text-2xl text-center">50+</h5>
                    <p className="text-[#CCCCCCCC] font-normal text-base md:text-xl text-center">Team Members</p>
                </div>


                <div className="border border-[#FFFFFF5C] w-full h-28.5 bg-[#FFFFFF05] backdrop-blur-[27px] rounded-[8px] flex items-center justify-center flex-col gap-2 py-4 px-4 " >
                    <h5 className="text-[#FE703B] font-black text-xl md:text-2xl text-center">99.9%</h5>
                    <p className="text-[#CCCCCCCC] font-normal text-base md:text-xl text-center">Uptime</p>
                </div>


                <div className="border border-[#FFFFFF5C] w-full h-28.5 bg-[#FFFFFF05] backdrop-blur-[27px] rounded-[8px] flex items-center justify-center flex-col gap-2 py-4 px-4 " >
                    <h5 className="text-[#FE703B] font-black text-xl md:text-2xl text-center">$10M+</h5>
                    <p className="text-[#CCCCCCCC] font-normal text-base md:text-xl text-center ">Funding Raised</p>
                </div>

            </div>





        </section>
    )
}