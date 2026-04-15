"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Settings, Archive, LogOut, Wallet } from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const NAV_ITEMS = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Treasury", href: "/admin/treasury", icon: Wallet },
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/logs", icon: Archive },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            router.push('/admin-login');
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <div 
                className={clsx(
                    "fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={clsx(
                "w-[280px] h-screen fixed left-0 top-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="flex  flex-col gap-2">
                        <div className=" flex items-center justify-center p-[2px]">
                          <Image src="/logos/logo.png" alt="ZendIT" width={50} height={50} /> 
                        </div>
                       <span className="text-[10px] uppercase tracking-widest font-black text-[#e33e38]">Admin Area</span>
                       
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2">Menu</div>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/admin");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive 
                                    ? "text-white font-semibold" 
                                    : "text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#e33e38] to-[#f17c37] opacity-100 dark:opacity-90" />
                                )}
                                <Icon className={clsx("size-5 relative z-10 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-zinc-400 group-hover:text-[#e33e38]")} />
                                <span className="relative z-10">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 pb-8">
                    <button 
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors w-full text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-500 font-medium"
                    >
                        <LogOut className="size-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
