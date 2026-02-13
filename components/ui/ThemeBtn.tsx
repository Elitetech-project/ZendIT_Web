"use client"

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


interface ThemeBtnProps{
    className?: string
}


export default function ThemeBtn({className}: ThemeBtnProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);



    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && (
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`p-2 hidden md:block cursor-pointer hover:bg-accent rounded-full transition-colors ${className} `}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun className={`h-5 w-5 text-yellow-500 ${className} `} />
                    ) : (
                        <Moon className={`h-5 w-5 text-slate-700 ${className} `} />
                    )}
                </button>
            )}
        </>
    )
}