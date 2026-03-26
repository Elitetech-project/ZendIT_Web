"use client"

import { handleChange } from "@/lib/utils"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { supabase } from "@/lib/supabaseClient"
import { connectSupabaseToWeb3Auth } from "@/lib/web3auth"



export default function SignUpView() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formValues, setFormValues] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    })




    // function to handle validation and then submission
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formValues.fullName.trim()
            || !formValues.email.trim()
            || !formValues.password.trim()
            || !formValues.phoneNumber.trim()
        ) {
            return toast.error("Please fill the required fields")
        }

        if (formValues.password !== formValues.confirmPassword) {
            return toast.error("Passwords do not match!")
        }

        setIsLoading(true);
        const toastId = toast.loading("Creating your dashboard...");

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formValues.email,
                password: formValues.password,
                options: {
                    data: {
                        full_name: formValues.fullName,
                        phone_number: formValues.phoneNumber,
                    }
                }
            });

            if (error) {
                console.error("Supabase Error:", error);
                toast.dismiss(toastId);
                setIsLoading(false);
                return toast.error(error.message);
            }

            console.log("Supabase Success Data:", data);

            if (data.session) {
                try {
                    // Send Welcome Email in background
                    fetch('/api/welcome/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formValues.email, fullName: formValues.fullName })
                    }).catch(e => console.error(e));

                    // Background connection without distracting toasts
                    await connectSupabaseToWeb3Auth(data.session.access_token);
                    toast.success("Success! Dashboard is ready.", { id: toastId });

                    // Redirect user to dashboard after short delay to show success
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1500);
                } catch (err) {
                    toast.error("Account created, but dashboard connection failed", { id: toastId });
                    setIsLoading(false);
                }
            } else {
                // Send Welcome Email in background
                fetch('/api/welcome/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formValues.email, fullName: formValues.fullName })
                }).catch(e => console.error(e));

                toast.success("Account created! Please check your email to confirm.", { id: toastId });
                setIsLoading(false);
            }
        } catch (err) {
            toast.error("An unexpected error occurred", { id: toastId });
            setIsLoading(false);
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


                        {/* Full Name input  */}
                        <label htmlFor="fullName" className=" w-full flex flex-col items-start gap-1  " >
                            <span className="text-sm  font-medium  " >Full Name</span>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formValues.fullName}
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
                            type="submit"
                            disabled={isLoading}
                            className={
                                `w-full flex items-center justify-center gap-2 rounded-[100px] cursor-pointer py-3 text-sm font-semibold text-primary-foreground dark:text-white dark:bg-[#e33e38] hover:text-foreground bg-gray-100 hover:brightness-75 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`
                            }
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? "Signing up..." : "Sign up"}
                        </button>


                    </div>

                </form>

            </div>
        </div>
    )
}