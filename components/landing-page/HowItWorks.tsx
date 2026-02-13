import { steps } from "@/data/HowItWorksData";



export default function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full h-fit flex items-center justify-center flex-col py-20 px-[5%] gap-18 font-satoshi  " >


            <div className=" flex flex-col gap-4 items-center justify-center text-center z-10 " >
                <h2 className="font-roboto text-[#FE703B] font-bold text-lg md:text-2xl " >How it Works</h2>
                <h3 className=" text-white font-bold text-2xl md:text-[40px] " >Get started in minutes</h3>
                <p className="text-[#FFFFFF] font-normal text-base md:text-xl " >Three simple steps to start managing your crypto payments like a pro.</p>
            </div>



            <div className=" w-full max-w-273.75 flex flex-col items-start gap-10 md:gap-4 " >


                {
                    steps.map((step, index) => (
                        <div key={index} className=" w-full flex flex-col md:flex-row items-center gap-4 " >

                            <span className="shrink-0 size-12.5 rounded-full text-white flex items-center justify-center bg-[#FE703B] " >
                                {index + 1}
                            </span>

                            <div className="w-full flex flex-col items-center md:items-start gap-2 px-2 md:px-0 text-center md:text-start " >
                                <h5 className=" font-roboto text-lg md:text-2xl font-bold text-[#FFFFFF] " >{step.title}</h5>
                                <p className=" font-satoshi text-[#CCCCCC] font-normal text-sm md:text-base " > {step.content} </p>

                            </div>

                        </div>
                    ))
                }

            </div>

        </section>
    )
}