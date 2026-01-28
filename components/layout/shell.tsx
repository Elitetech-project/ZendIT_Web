'use client';

import { Header } from './header';
import { BottomNav } from './bottom-nav';
import { Sidebar } from './sidebar';

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="flex min-h-screen bg-background w-full">
            {/* Sidebar for Desktop */}
            <Sidebar className="hidden md:flex" />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col md:pl-64 lg:pl-72">
                <Header />
                <main className="flex-1 px-4 py-6 pb-24 md:pb-6">
                    <div className="mx-auto max-w-6xl w-full md:w-[95%]">
                        {children}
                    </div>
                </main>
                {/* Bottom Nav for Mobile */}
                <BottomNav className="md:hidden" />
            </div>
        </div>
    );
}
