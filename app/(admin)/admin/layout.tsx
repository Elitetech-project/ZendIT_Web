'use client';

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Providers } from "@/components/providers";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-satoshi selection:bg-[#e33e38]/20">
            <Providers>
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
                    {/* Top Admin Header Bar */}
                    <header className="h-20 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-zinc-600 dark:text-zinc-400"
                            >
                                <Menu className="size-6" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs md:text-sm font-semibold text-zinc-600 dark:text-zinc-300">System Live</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:flex flex-col">
                                <span className="font-bold text-sm leading-none">Super Admin</span>
                                <span className="text-xs text-muted-foreground uppercase">Role</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 border-2 border-white dark:border-zinc-950 shadow-sm" />
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="py-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4 overflow-hidden">
                        {children}
                    </div>
                </main>
            </Providers>
        </div>
    );
}
