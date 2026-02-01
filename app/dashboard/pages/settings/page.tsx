'use client';

import { Shell } from '@/components/layout/shell';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
    return (
        <Shell>
            <div className="flex flex-col gap-6 font-satoshi ">
                <h1 className="text-2xl font-bold font-roboto ">Settings</h1>

                <div className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {[
                        { icon: Shield, label: 'Security' },
                        { icon: Bell, label: 'Notifications' },
                        { icon: HelpCircle, label: 'Help & Support' },
                    ].map((item) => (
                        <button key={item.label} className="flex w-full items-center justify-between rounded-xl bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ))}
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-500 hover:bg-red-500/10 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Log Out
                </button>
            </div>
        </Shell>
    );
}
