import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"]
})


const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
})


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})


const satoshi = localFont({
  src: "../public/fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
})



export const metadata: Metadata = {
  title: "ZendIt",
  description: "Send money with ZendIt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${roboto.variable} ${inter.variable} ${satoshi.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
