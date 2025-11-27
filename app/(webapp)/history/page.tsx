'use client';

import { Shell } from '@/components/layout/shell';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

export default function HistoryPage() {
    const transactions = [
        { id: 1, type: 'send', name: 'User 1', amount: '-$50.00', date: 'Today, 10:23 AM', status: 'completed' },
        { id: 2, type: 'receive', name: 'User 2', amount: '+$120.00', date: 'Yesterday, 4:15 PM', status: 'completed' },
        { id: 3, type: 'send', name: 'Merchant ABC', amount: '-$12.50', date: 'Nov 24, 2:30 PM', status: 'completed' },
        { id: 4, type: 'receive', name: 'Salary', amount: '+$2,500.00', date: 'Nov 20, 9:00 AM', status: 'completed' },
    ];

    return (
        <Shell>
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">History</h1>

                <div className="flex flex-col gap-4">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'send' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {tx.type === 'send' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium">{tx.name}</p>
                                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${tx.type === 'send' ? 'text-foreground' : 'text-green-500'}`}>
                                    {tx.amount}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    );
}
