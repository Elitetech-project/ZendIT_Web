"use client"

import { handleChange } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"



export default function LoginView() {
    const [showPassword, setShowPassword] = useState(false)
    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    })


    return (
        <div className=" w-full h-screen relative font-satoshi " >
            <div className="w-full h-full absolute inset-0 bg-black/25 backdrop-blur-md z-10 " ></div>
            <Image src={"/auth-images/zendIt-bg.webp"} alt="bg" fill className="object-cover object-center h-full w-full" />






            <div className="w-full h-full absolute inset-0 flex items-center justify-center px-3 p-4  z-20" >

                <form className="w-full text-[#333333] max-w-xl h-fit flex flex-col items-center gap-7 bg-white px-5 py-8 rounded-xl "  >


                    <div className="w-fit flex flex-col gap-2 items-center justify-center text-center" >
                        <Image src={"/logos/zendit-logo.jpeg"} alt="bg" height={100} width={100} className="object-cover object-center size-12 rounded-full " />

                        <h1 className="font-roboto font-semibold text-lg md:text-2xl mt-2 " >Log in</h1>
                        <p className="text-sm font-normal " >{"Don't"} have an account? <Link href={"/sign-up"} className="underline" >Sign up</Link></p>

                    </div>


                    <div className="w-full max-w-sm flex flex-col items-center justify-center  gap-4  " >



                        {/* Email input  */}
                        <label htmlFor="email" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium  " >Your email</span>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formValues.email}
                                onChange={(e) => handleChange(e, setFormValues)}
                                required
                                className="w-full py-2 px-3 border border-gray-400 outline-none focus:outline-none text-sm rounded-lg " />
                        </label>




                        {/* password input  */}
                        <label htmlFor="password" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium w-full flex items-center justify-between gap-10 " >Your Password

                                <button type="button" className="cursor-pointer" onClick={() => setShowPassword((prev) => !prev)} > {showPassword ? <EyeOff size={17} /> : <Eye size={17} />} </button>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formValues.password}
                                onChange={(e) => handleChange(e, setFormValues)}
                                required
                                className="w-full py-2 px-3 border border-gray-400 outline-none focus:outline-none text-sm rounded-lg " />
                        </label>


                        <button
                            className={
                                `w-full flex items-center justify-center  rounded-[100px] cursor-pointer py-3 text-sm font-semibold text-primary-foreground dark:text-white  dark:bg-[#e33e38]  hover:text-foreground bg-gray-100 hover:brightness-75 transition-all duration-200 ease-in-out `
                            }
                        >

                            Sign up
                        </button>


                    </div>

                </form>

            </div>
        </div>
    )
}