'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, ArrowUpRight, ArrowDownRight, RefreshCcw, Copy, ExternalLink, ShieldCheck, PieChart, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export default function TreasuryPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchTreasury = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/treasury');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            toast.error("Failed to fetch treasury data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreasury();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Address copied!");
    };

    if (loading && !data) {
        return (
            <div className="flex flex-col gap-8 animate-pulse p-8">
                <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />)}
                </div>
                <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8 font-satoshi max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                        Platform <span className="text-[#e33e38]">Treasury</span>
                    </h1>
                    <p className="text-zinc-500 font-medium flex items-center gap-2 uppercase tracking-[0.2em] text-[10px] font-black">
                        <Activity className="size-3 text-[#e33e38]" /> Liquidity & Settlement Control
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchTreasury}
                        className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-[#e33e38] transition-all hover:scale-110 active:rotate-180"
                    >
                        <RefreshCcw className="size-5" />
                    </button>
                    <div className="h-12 border-l border-zinc-200 dark:border-zinc-800 mx-2 hidden md:block" />
                    <div className="hidden lg:flex flex-col items-end">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Treasury Wallet (Coston2)</p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-zinc-500">{data?.address?.substring(0, 6)}...{data?.address?.substring(38)}</code>
                            <button onClick={() => copyToClipboard(data?.address)} className="p-1.5 hover:bg-[#e33e38]/10 rounded-lg text-zinc-400 hover:text-[#e33e38] transition-colors">
                                <Copy className="size-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* On-Chain Liquidity */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e33e38]/10 to-transparent blur-2xl group-hover:from-[#e33e38]/20 transition-all" />
                    <div className="size-12 rounded-2xl bg-[#e33e38]/10 flex items-center justify-center text-[#e33e38] mb-6">
                        <Wallet className="size-6" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Flare Liquidity</p>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{data?.balances?.flr}</h3>
                        <span className="text-lg font-bold text-zinc-400">FLR</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck className="size-3" /> Coston2 Testnet Secure
                    </div>
                </motion.div>

                {/* Fiat Settlement Account */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f17c37]/10 to-transparent blur-2xl group-hover:from-[#f17c37]/20 transition-all" />
                    <div className="size-12 rounded-2xl bg-[#f17c37]/10 flex items-center justify-center text-[#f17c37] mb-6">
                        <Landmark className="size-6" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Settlement Account</p>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-zinc-400">₦</span>
                        <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
                            {Number(data?.balances?.fiat).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        Flutterwave NGN Available
                    </div>
                </motion.div>

                {/* Platform Earnings */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e33e38] to-[#f17c37] p-8 text-white shadow-xl shadow-[#e33e38]/20 group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl opacity-50 group-hover:opacity-100 transition-all" />
                    <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-md">
                        <PieChart className="size-6 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 text-white opacity-80">Accumulated Fees (Est.)</p>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold">₦</span>
                        <h3 className="text-4xl font-black tracking-tighter">
                            {Number(data?.stats?.estimatedFees).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest">
                        Based on {data?.stats?.totalSettled} Settlements
                    </div>
                </motion.div>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        Settlement <span className="text-[#e33e38]">Activity</span>
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950/50">
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fiat Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">On-Chain Value</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {data?.history?.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "size-8 rounded-lg flex items-center justify-center",
                                                tx.type === 'external_remittance' ? "bg-blue-500/10 text-blue-500" : "bg-[#e33e38]/10 text-[#e33e38]"
                                            )}>
                                                {tx.type === 'external_remittance' ? <Landmark className="size-4" /> : <Wallet className="size-4" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
                                                    {tx.type?.replace('_', ' ')}
                                                </span>
                                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-mono text-zinc-400">{tx.tx_hash?.substring(0, 8)}...</span>
                                                    <a href={`https://coston2-explorer.flare.network/tx/${tx.tx_hash}`} target="_blank" className="text-[#e33e38] transition-colors">
                                                        <ExternalLink className="size-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-black text-zinc-900 dark:text-white">₦{Number(tx.amount_fiat).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 font-bold">
                                            <span className="text-sm text-zinc-400">{tx.amount_flr}</span>
                                            <span className="text-[10px] text-zinc-500">FLR</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            tx.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" : 
                                            tx.status === 'failed' ? "bg-red-500/10 text-red-500" : 
                                            "bg-amber-500/10 text-amber-500"
                                        )}>
                                            <div className={clsx("size-1.5 rounded-full", 
                                                tx.status === 'completed' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : 
                                                tx.status === 'failed' ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : 
                                                "bg-amber-500 animate-pulse"
                                            )} />
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{new Date(tx.created_at).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-zinc-400 font-medium">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {(!data?.history || data.history.length === 0) && (
                    <div className="p-20 flex flex-col items-center gap-4 text-center">
                        <div className="size-16 rounded-3xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-200">
                            <Activity className="size-8" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-black text-zinc-400 uppercase tracking-widest italic">No Treasury Activity Detected</p>
                            <p className="text-xs text-zinc-500 max-w-[200px]">Liquidity movements will appear here once settlements begin.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
