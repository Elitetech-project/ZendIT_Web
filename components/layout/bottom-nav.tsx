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
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'Utilities',
        href: '/dashboard/pages/utilities',
        icon: Zap,
    },
    {
        title: 'History',
        href: '/dashboard/pages/history',
        icon: Clock,
    },
    {
        title: 'Rewards',
        href: '/dashboard/pages/rewards',
        icon: Trophy,
    },
    {
        title: 'Settings',
        href: '/dashboard/pages/settings',
        icon: Settings,
    },
];

interface BottomNavProps {
    className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
    const pathname = usePathname();

    return (
        <nav className={cn(
            "fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe",
            className
        )}>
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
                                    ? "text-brand"
                                    : "text-muted-foreground hover:text-brand"
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
