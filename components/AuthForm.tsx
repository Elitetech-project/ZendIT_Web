"use client"

import { JSX, useState } from "react";
import IntroScreen from "./IntroScreen";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";


export default function AuthForm() {
    const [currentScreen, setCurrentScreen] = useState<JSX.Element | null>(null);

    const goBack = () => {
        setCurrentScreen(<IntroScreen
            onLoginClick={handleLoginClick}
            onSignUpClick={handleSignUpClick}
        />);
    };

    const handleLoginClick = () => {
        setCurrentScreen(<LoginForm
            onGoBack={goBack}
            onSignUpClick={handleSignUpClick} />);
    };

    const handleSignUpClick = () => {
        setCurrentScreen(<SignUpForm
            onGoBack={goBack}
            onLoginClick={handleLoginClick}
        />)
    }

    // Initialize to IntroScreen when the component mounts
    if (!currentScreen) {
        setCurrentScreen(<IntroScreen
            onLoginClick={handleLoginClick}
            onSignUpClick={handleSignUpClick}
        />);
    }

    return <>{currentScreen}</>;
}
