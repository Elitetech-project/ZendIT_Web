import { companyData, productData, support } from "@/data/footerData";
import Link from "next/link";
import TwitterIcon from "../icons/TwitterIcon";
import DiscordIcon from "../icons/DiscordIcon";
import GithubIcon from "../icons/GithubIcon";
import TelegramIcon from "../icons/Telegram";


export default function Footer() {
    return (
        <footer className="bg-[linear-gradient(0deg,#000508,#000508),radial-gradient(141.42%_141.42%_at_100%_100%,#3A233F_0%,rgba(0,0,0,0)_24.59%),radial-gradient(50%_50%_at_0%_100%,#271D3B_0%,rgba(0,0,0,0)_62.59%)]
        w-full h-fit rounded-t-xl py-20 md:py-36 px-[4%] lg:px-[8%] flex flex-col lg:flex-row  items-start justify-between gap-16 md:gap-20 relative overflow-hidden
        " >
            <div className="w-full h-fit  p-1 max-w-90.25 flex flex-col items-start gap-6 " >
                <h1 className=" font-extrabold text-[#FFFFFF] text-[32px] font-roboto " >Zendit</h1>

                <div className="flex items-center gap-3 md:gap-2.5 " >
                    <Link href={"#"} target="_blank" className=" flex items-center justify-center bg-[#FFFFFF] text-[#111111] size-6.5 rounded-full hover:scale-110 transition-all duration-200 ease-in-out " >
                        <TwitterIcon size={16} />
                    </Link>

                    <Link href={"#"} target="_blank" className=" flex items-center justify-center bg-[#FFFFFF] text-[#111111] size-6.5 rounded-full hover:scale-110 transition-all duration-200 ease-in-out " >
                        <DiscordIcon size={16} />
                    </Link>


                    <Link href={"#"} target="_blank" className=" flex items-center justify-center bg-[#FFFFFF] text-[#111111] size-6.5 rounded-full hover:scale-110 transition-all duration-200 ease-in-out " >
                        <GithubIcon size={16} />
                    </Link>


                    <Link href={"#"} target="_blank" className=" flex items-center justify-center bg-[#FFFFFF] text-[#111111] size-6.5 rounded-full hover:scale-110 transition-all duration-200 ease-in-out " >
                        <TelegramIcon size={16} />
                    </Link>
                </div>

                <p className=" font-roboto text-white font-normal text-[15.75px] " >Making crypto payments accessible to everyone. No math, no hassle, just seamless transactions.</p>

            </div>



            <div className=" w-full max-w-[541.4px] font-roboto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-18 place-items-start justify-center justify-items-start md:justify-items-center  " >

                <div className=" flex flex-col items-start gap-2.75 " >
                    <h6 className="text-[#FFFFFF] text-base font-normal"> PRODUCT</h6>
                    <ul className="flex w-fit flex-col items-start gap-2.75  " >
                        {
                            productData.map((data, i) => (
                                <li className="text-[#848895] font-normal font-satoshi hover:text-white duration-150 ease-in-out text-[15.25px] " > <Link href={data.path} key={i} > {data.label} </Link></li>
                            ))
                        }
                    </ul>
                </div>

                <div className=" flex flex-col items-start gap-2.75 " >
                    <h6 className="text-[#FFFFFF] text-base font-normal">    COMPANY</h6>
                    <ul className="flex w-fit flex-col items-start gap-2.75  ">
                        {
                            companyData.map((data, i) => (
                                <li className="text-[#848895] font-normal font-satoshi hover:text-white duration-150 ease-in-out text-[15.25px] " > <Link href={data.path} key={i} > {data.label} </Link></li>
                            ))
                        }
                    </ul>
                </div>

                <div className=" flex flex-col items-start gap-2.75 " >
                    <h6 className="text-[#FFFFFF] text-base font-normal"  > SUPPORT</h6>
                    <ul className="flex w-fit flex-col items-start gap-2.75  ">
                        {
                            support.map((data, i) => (
                                <li className="text-[#848895] font-normal font-satoshi hover:text-white duration-150 ease-in-out text-[15.25px] " > <Link href={data.path} key={i} > {data.label} </Link></li>
                            ))
                        }
                    </ul>
                </div>


                <div className=" flex flex-col items-start gap-2.75 " >
                    {/* EN */}
                </div>


            </div>




            {/* The radial gradients  */}

            <div
                style={{
                    background: "radial-gradient(#3A233F, #3A233F, #3A233F)",
                    boxShadow: `
      0 0 100px 60px #3A233F,
      0 0 100px 60px #3A233F,
      0 0 1000px 90px #3A233F
    `,
                    backdropFilter: "blur(300px)",
                }}
                className=" w-10 md:w-40 aspect-square rounded-full absolute bottom-[-10%]  md:bottom-[-30%] right-[-7%]  md:right-[-10%] opacity-70 "
            />


               <div
                style={{
                    background: "radial-gradient(#3A233F, #3A233F, #3A233F)",
                    boxShadow: `
      0 0 100px 60px #3A233F,
      0 0 100px 60px #3A233F,
      0 0 1000px 90px #3A233F
    `,
                    backdropFilter: "blur(300px)",
                }}
                className=" w-10 md:w-40 aspect-square rounded-full absolute bottom-[-10%]  md:bottom-[-30%] left-[-7%]  md:left-[-10%] opacity-70 "
            />


        </footer>
    )
}