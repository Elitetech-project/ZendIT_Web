'use client';

import { Shell } from '@/components/layout/shell';
import { Trophy, Gift, Users } from 'lucide-react';

export default function RewardsPage() {
    return (
        <Shell>
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Rewards</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-4 text-white">
                        <Gift className="h-6 w-6 mb-2" />
                        <p className="text-xs font-medium opacity-90">Cashback</p>
                        <p className="text-xl font-bold">$45.20</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 p-4 text-white">
                        <Users className="h-6 w-6 mb-2" />
                        <p className="text-xs font-medium opacity-90">Referrals</p>
                        <p className="text-xl font-bold">12</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Leaderboard
                    </h2>

                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
                                <div className="flex items-center gap-3">
                                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 1 ? 'bg-yellow-500 text-white' : i === 2 ? 'bg-gray-400 text-white' : i === 3 ? 'bg-orange-400 text-white' : 'bg-secondary text-muted-foreground'}`}>
                                        {i}
                                    </span>
                                    <span className="font-medium">User {i}</span>
                                </div>
                                <span className="text-sm font-semibold">{1000 - (i * 50)} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Shell>
    );
}
