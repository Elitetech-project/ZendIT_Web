"use client";

import Image from "next/image";
import BtnComponent from "./BtnComponent";


interface IntroScreenProps {
    onLoginClick: () => void;
    onSignUpClick: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onLoginClick, onSignUpClick }) => {
    return (
        <div className="w-full h-full flex flex-col text-white items-center justify-between font-poppins">
            <div className="h-full w-full max-h-[500px]">
                <Image
                    src="/onboardingScreens/loginScreenOne.svg"
                    alt="slide-three-image"
                    height={500}
                    width={500}
                    className="w-full h-full object-center"
                />
            </div>

            <div className="w-full px-[5%]">
                <h1 className="mr-auto text-start font-semibold text-4xl leading-[170%] text-white">
                    Fast and Flexible
                    <br /> Trading
                </h1>
            </div>

            <div className="w-full flex items-center justify-between gap-10 p-6">
                <BtnComponent onClick={onSignUpClick} variant="outline" className="text-xl font-medium">
                    Sign up
                </BtnComponent>
                <BtnComponent onClick={onLoginClick} className="text-xl font-medium">
                    Log in
                </BtnComponent>
            </div>
        </div>
    );
};


export default IntroScreen