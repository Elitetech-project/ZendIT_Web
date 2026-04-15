"use client";

import { useEffect, useState } from "react";
import { 
    Search, 
    Filter, 
    ArrowUpRight, 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    MoreVertical, 
    ExternalLink,
    RefreshCw,
    Download,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

interface Transaction {
    id: string;
    created_at: string;
    status: string;
    amount_flr: number;
    amount_fiat: number;
    fiat_currency: string;
    tx_hash: string;
    type: string;
    recipient_details: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    profiles?: {
        full_name: string;
        email: string;
    };
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/admin/transactions?status=${statusFilter}&search=${search}`);
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [statusFilter, search]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'failed': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="size-3" />;
            case 'failed': return <AlertTriangle className="size-3" />;
            default: return <Clock className="size-3 animate-pulse" />;
        }
    };

    return (
        <div className="flex flex-col p-4 gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white underline decoration-[#e33e38] decoration-4 underline-offset-8">Transaction Ledger</h1>
                    <p className="text-muted-foreground font-medium text-sm">Monitor and manage all system payouts and deposits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-sm shadow-sm hover:bg-zinc-50 transition-colors">
                        <Download className="size-4" /> Export CSV
                    </button>
                    <button onClick={() => fetchTransactions()} className="p-2.5 rounded-xl bg-[#e33e38] text-white shadow-lg shadow-[#e33e38]/20 hover:scale-105 transition-all active:scale-95">
                        <RefreshCw className={clsx("size-5", isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input 
                        type="text" 
                        placeholder="Search by TxHash, Account Number, or ID..."
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#e33e38]/30 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
                    <Filter className="size-4 text-zinc-400 ml-2 hidden md:block" />
                    {['all', 'pending', 'completed', 'failed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                statusFilter === s 
                                    ? "bg-[#e33e38] text-white shadow-md shadow-[#e33e38]/10" 
                                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="size-10 animate-spin text-[#e33e38]" />
                    </div>
                )}

                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full  text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 whitespace-nowrap">
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date & Time</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Tx ID</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Recipient Name</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Bank</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Account No.</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Amount (FLR)</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Payout (NGN)</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Status</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 whitespace-nowrap">
                            {transactions.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-20 text-center">
                                        <p className="font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.2em] text-sm">No records found matching filters</p>
                                    </td>
                                </tr>
                            )}
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{format(new Date(tx.created_at), 'MMM dd, yyyy')}</span>
                                            <span className="text-[9px] text-zinc-400 font-bold leading-none">{format(new Date(tx.created_at), 'hh:mm a')}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 group/id">
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase">{tx.id.substring(0, 8)}</span>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-[#e33e38]">
                                                <ExternalLink className="size-2.5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{tx.recipient_details?.accountName || '—'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-medium text-zinc-500">{tx.recipient_details?.bankName || 'Unknown'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-mono font-medium text-zinc-400">{tx.recipient_details?.accountNumber || '—'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 underline decoration-indigo-500/30 underline-offset-4">{Number(tx.amount_flr).toLocaleString()} <span className="text-[9px]">FLR</span></span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="text-[9px] text-zinc-400 font-bold">₦</span>
                                            <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">{Number(tx.amount_fiat).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className={clsx(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusStyles(tx.status)
                                        )}>
                                            {getStatusIcon(tx.status)}
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400">
                                            <MoreVertical className="size-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-900 flex items-center flex-wrap gap-2 justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Showing {transactions.length} Transactions</span>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-black text-zinc-400 cursor-not-allowed">PREV</button>
                        <button className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-black text-zinc-400 cursor-not-allowed">NEXT</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
