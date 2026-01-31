import { Metadata } from "next";
import SignUpView from "./SignUpView";



export const metadata: Metadata = {
    title: "Sign up | ZendIt",
    description: "Sign up on ZendItPay"
}

export default function Page() {
    return (
        <SignUpView />
    )
}