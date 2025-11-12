import { ArrowLeft } from "lucide-react";
import BtnComponent from "./BtnComponent";


interface SignUpFormProps {
    onGoBack: () => void;
    onLoginClick: () => void;
}

export default function SignUpForm({ onGoBack, onLoginClick }: SignUpFormProps) {
    return (
        <div className="w-full  h-full font-poppins  " >
            <div className="w-full flex items-center justify-between " >
                <button onClick={onGoBack} ><ArrowLeft /></button>
                <h3 className="mx-auto font-semibold text-xl "  >Sign up</h3>
            </div>

            <div className=" w-full  h-[97%] flex items-center justify-between flex-col py-10  "  >

                <form className="w-full  h-fit flex flex-col items-center py-10 gap-10 " >


                    {/* Email input */}
                    {/* <label htmlFor="email" className="flex flex-col w-full gap-1 " >
                        <span className=" text-[#A7AEBF] text-base font-medium " >Email Address</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formValues.email}
                            onChange={handleInputChange}
                            className=" bg-[#21242D] py-4 px-6 font-normal text-lg text-white rounded-xl outline-none border-none "
                        />
                    </label> */}



                    {/* Password input */}
                    {/* <label htmlFor="password" className="flex flex-col w-full gap-1 " >
                        <span className=" text-[#A7AEBF] text-base font-medium " >Password</span>

                        <div className="bg-[#21242D] py-4 px-6 font-normal text-lg text-white rounded-xl flex items-center justify-between " >
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formValues.password}
                                onChange={handleInputChange}
                                className=" bg-transparent font-normal text-lg text-white  outline-none border-none w-full "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer" > {showPassword ? <EyeOff /> : <Eye />} </button>
                        </div>
                    </label> */}

                    <BtnComponent className="text-2xl font-medium font-poppins mt-16 " >Sign up</BtnComponent>
                </form>



                <p className=" text-center font-normal text-[#494D58] " > Already have an account? <button onClick={onLoginClick} type="button" className="text-[#C10F45] font-medium  " >Log in!</button></p>
            </div>
        </div>
    )
}