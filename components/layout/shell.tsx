'use client';

import { Header } from './header';
import { BottomNav } from './bottom-nav';

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background w-full">
            <Header />
            <main className="flex-1 px-4 py-6 pb-24">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
