"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, ArrowDownRight, Users, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StatsData {
    treasury: {
        flrBalance: string;
        flwBalance: number;
        flarePrice: number;
    };
    stats: {
        userCount: number;
        totalVolume: number;
        totalTxCount: number;
    };
    recentTransactions: any[];
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("Failed to fetch admin stats:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#e33e38]" />
                    <p className="font-bold text-zinc-500 animate-pulse uppercase tracking-widest text-xs">Loading Live System Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-0">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Admin Overview</h1>
                <p className="text-muted-foreground font-medium text-sm md:text-base">Real-time metrics and system health for ZendIT.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Liquidity Card */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Treasury Liquidity</span>
                        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Activity className="size-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
                            {Number(data?.treasury.flrBalance).toLocaleString()} <span className="text-sm text-indigo-500 font-bold">FLR</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-500 mt-2">
                            <ArrowUpRight className="size-4" /> <span>Real-time Flare Node</span>
                        </div>
                    </div>
                </div>

                {/* Fiat Payout Balance */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Flutterwave NGN</span>
                        <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <TrendingUp className="size-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
                            <span className="text-sm text-zinc-400 font-bold">₦</span> {data?.treasury.flwBalance.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold mt-2">
                            {Number(data?.treasury.flwBalance) < 50000 ? (
                                <span className="text-rose-500 flex items-center gap-1"><AlertTriangle className="size-4" /> Low Liquidity Alert</span>
                            ) : (
                                <span className="text-emerald-500 flex items-center gap-1"><ArrowUpRight className="size-4" /> Sufficient Funds</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Volume */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Total Volume</span>
                        <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <ArrowUpRight className="size-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
                            <span className="text-sm text-zinc-400 font-bold">₦</span> {data?.stats.totalVolume.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-500 mt-2">
                            <span>{data?.stats.totalTxCount} Total Transactions</span>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Active Users</span>
                        <div className="h-10 w-10 rounded-full bg-[#e33e38]/10 flex items-center justify-center text-[#e33e38]">
                            <Users className="size-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
                            {data?.stats.userCount}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-500 mt-2">
                            <ArrowUpRight className="size-4" /> <span>Total Sign-ups</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lower Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions Box */}
                <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Recent Payouts</h2>
                        <button className="text-sm font-bold text-[#e33e38] hover:underline">View All</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {data?.recentTransactions.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No transactions recorded yet.</p>
                            </div>
                        )}
                        {data?.recentTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                        tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                                        tx.status === 'failed' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                                    }`}>
                                        {tx.status === 'completed' ? <ArrowUpRight className="size-5" /> : 
                                         tx.status === 'failed' ? <AlertTriangle className="size-5" /> : <Loader2 className="size-5 animate-spin" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Payout to {(tx.recipient_details as any)?.bankName || 'Unknown Bank'}</span>
                                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                            {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })} • {tx.tx_hash?.substring(0, 10)}...
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col">
                                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{Number(tx.amount_flr).toLocaleString()} FLR</span>
                                    <span className={`text-[10px] uppercase font-black tracking-widest ${
                                        tx.status === 'completed' ? 'text-emerald-500' : 
                                        tx.status === 'failed' ? 'text-rose-500' : 'text-amber-500'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side Info Box */}
                <div className="rounded-3xl bg-gradient-to-br from-[#e33e38] via-[#f17c37] to-[#f15b35] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                <Activity className="animate-pulse" /> System Status
                            </h2>
                            <p className="text-white/80 text-sm font-medium leading-relaxed">
                                Flare Coston2 node is operating normally. Treasury address is active. Flutterwave API sync verified.
                            </p>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/70 block mb-1">Current Oracle Rate (ZendIT Margin)</span>
                            <div className="text-3xl font-black font-roboto">
                                1 FLR = <span className="text-yellow-300 tracking-tighter">₦{data?.treasury.flarePrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-[40px]" />
                    <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-black/20 blur-[40px]" />
                </div>
            </div>
        </div>
    );
}

