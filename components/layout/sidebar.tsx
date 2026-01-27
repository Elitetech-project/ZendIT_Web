'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Clock, Trophy, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

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

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn(
            "fixed inset-y-0  left-0 z-50 flex w-64 flex-col py-4 borde bg-background transition-all duration-300 ease-in-out lg:w-72",
            className
        )}>
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={100} height={100} className='w-28 h-auto' />
                </Link>
            </div>
            <nav className="flex-1 space-y-1 pt-8 px-4 border-r py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-brand/10 text-brand shadow-sm"
                                    : "text-muted-foreground hover:bg-brand/5 hover:text-brand"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                {/* Optional: User profile or help link could go here */}
                <div className="rounded-2xl bg-secondary/50 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Support</p>
                    <Link href="#" className="text-sm text-foreground hover:underline">Help Center</Link>
                </div>
            </div>
        </aside>
    );
}
