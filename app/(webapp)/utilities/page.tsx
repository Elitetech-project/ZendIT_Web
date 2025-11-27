'use client';

import { Shell } from '@/components/layout/shell';
import { Smartphone, Zap, Tv, Wifi } from 'lucide-react';

export default function UtilitiesPage() {
    return (
        <Shell>
            <div className="flex flex-col pt-[10%] gap-6">
                
                {/*
                <h1 className="text-2xl font-bold">Utilities</h1>
                <p className="text-muted-foreground">Pay bills and top up instantly.</p>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: Smartphone, label: 'Airtime' },
                        { icon: Wifi, label: 'Data' },
                        { icon: Zap, label: 'Electricity' },
                        { icon: Tv, label: 'Cable TV' },
                    ].map((item) => (
                        <button key={item.label} className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-secondary p-6 hover:bg-secondary/80 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </div> */}

                <div className=" p-6 text-center ">
                    <p className="text-sm font-medium text-primary">coming soon!</p>
                </div>
            </div>
        </Shell>
    );
}
