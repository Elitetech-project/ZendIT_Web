import { Metadata } from "next"
import LoginView from "./LoginView"



export const metadata: Metadata = {
    title: "Login | ZendIt",
    description: "Login into ZendItPay"
}


export default function Page() {
    return (
        <>
            <LoginView />
        </>
    )
}