"use client"

import { handleChange } from "@/lib/utils"
import { fePointLight, sub } from "framer-motion/client"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import toast from "react-hot-toast"



export default function SignUpView() {
    const [showPassword, setShowPassword] = useState(false)
    const [formValues, setFormValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    })




    // function to handle validation and then submission
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formValues.username.trim()
            || !formValues.email.trim()
            || !formValues.password.trim()
            || !formValues.phoneNumber.trim()
        ) {
            return toast.error("Please fill the required fields")
        }

        if (formValues.password !== formValues.confirmPassword) {
            return toast.error("Passwords do not match!")
        }


    }


    return (
        <div className=" w-full h-[130vh] relative font-satoshi " >
            <div className="w-full h-full absolute inset-0 bg-black/25 backdrop-blur-md z-10 " ></div>
            <Image src={"/auth-images/zendIt-bg.webp"} alt="bg" fill className="object-cover object-center h-full w-full" />






            <div className="w-full h-full absolute inset-0 flex items-center justify-center px-3 py-4  z-20" >

                <form onSubmit={handleSubmit} className="w-full text-[#333333] max-w-xl h-fit flex flex-col items-center gap-7 bg-white px-5 py-8 rounded-xl "  >


                    <div className="w-fit flex flex-col gap-2 items-center justify-center text-center" >
                        <Image src={"/logos/zendit-logo.jpeg"} alt="bg" height={100} width={100} className="object-cover object-center size-12 rounded-full " />

                        <h1 className="font-roboto font-semibold text-lg md:text-2xl mt-2 " >Sign up</h1>
                        <p className="text-sm font-normal " >Already have an account? <Link href={"/login"} className="underline" >Log in</Link></p>

                    </div>


                    <div className="w-full max-w-sm flex flex-col items-center justify-center  gap-4  " >


                        {/* Username input  */}
                        <label htmlFor="username" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium  " >Username </span>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formValues.username}
                                onChange={(e) => handleChange(e, setFormValues)}
                                required
                                className="w-full py-2 px-3 border border-gray-400 outline-none focus:outline-none text-sm rounded-lg " />
                        </label>


                        {/* Email input  */}
                        <label htmlFor="email" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium  " >Email</span>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formValues.email}
                                onChange={(e) => handleChange(e, setFormValues)}
                                required
                                className="w-full py-2 px-3 border border-gray-400 outline-none focus:outline-none text-sm rounded-lg " />
                        </label>



                        {/* Phone number input  */}
                        <label htmlFor="phoneNumber" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium  " >Phone Number</span>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formValues.phoneNumber}
                                onChange={(e) => handleChange(e, setFormValues)}
                                required
                                className="w-full py-2 px-3 border border-gray-400 outline-none focus:outline-none text-sm rounded-lg " />
                        </label>




                        {/* password input  */}
                        <label htmlFor="password" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium w-full flex items-center justify-between gap-10 " >Password

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


                        {/* confirm password input  */}
                        <label htmlFor="confirmPassword" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium " >Confirm Password</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formValues.confirmPassword}
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