'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Clock, Trophy, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
    },
    {
        title: 'Utilities',
        href: '/utilities',
        icon: Zap,
    },
    {
        title: 'History',
        href: '/history',
        icon: Clock,
    },
    {
        title: 'Rewards',
        href: '/rewards',
        icon: Trophy,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
