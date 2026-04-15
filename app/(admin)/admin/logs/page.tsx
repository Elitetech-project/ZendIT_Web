'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, ShieldAlert, User, CreditCard, Settings, RefreshCcw, Search, Clock, ChevronDown, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/logs');
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (err) {
            toast.error("Failed to fetch logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(l => 
        l.action?.toLowerCase().includes(search.toLowerCase()) || 
        l.description?.toLowerCase().includes(search.toLowerCase())
    );

    const getActionIcon = (action: string) => {
        if (action.includes('USER')) return <User className="size-4" />;
        if (action.includes('TX') || action.includes('TRANSFER')) return <CreditCard className="size-4" />;
        if (action.includes('SETTINGS')) return <Settings className="size-4" />;
        return <ShieldAlert className="size-4" />;
    };

    if (loading && logs.length === 0) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#e33e38]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8 max-w-7xl mx-auto font-satoshi">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                        Audit <span className="text-[#e33e38]">Logs</span>
                    </h1>
                    <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] font-black">
                        System Event Trail & Security Ledger
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Filter by action..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold font-satoshi outline-none focus:border-[#e33e38]/30 transition-all min-w-[240px]"
                        />
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-[#e33e38] transition-all flex items-center gap-2"
                    >
                        <RefreshCcw className={clsx("size-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-zinc-950 border p-4 border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-900">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Action Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Description</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Metadata</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <Archive className="size-12" />
                                            <p className="font-black uppercase tracking-widest text-xs">No logs recorded</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-[#e33e38]/10 text-[#e33e38] flex items-center justify-center">
                                                {getActionIcon(log.action)}
                                            </div>
                                            <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                                                {log.action}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-medium text-zinc-500 max-w-md">
                                            {log.description}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        {log.metadata ? (
                                            <div className="group/meta relative">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-500 hover:bg-zinc-200 transition-colors">
                                                    View JSON <ChevronDown className="size-3" />
                                                </button>
                                                <div className="absolute top-0 right-full mr-2 hidden group-hover/meta:block z-50 bg-black text-white p-4 rounded-xl text-[10px] font-mono min-w-[200px] shadow-2xl">
                                                    <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-zinc-300 uppercase italic">None</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                                                <Clock className="size-3 text-zinc-400" />
                                                {format(new Date(log.created_at), 'HH:mm:ss')}
                                            </div>
                                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                                                {format(new Date(log.created_at), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Footer Info */}
            <div className="flex items-center justify-between px-8 text-zinc-400">
                <p className="text-[10px] font-black uppercase tracking-widest">Displaying last {filteredLogs.length} events</p>
                <div className="h-px flex-1 mx-8 bg-zinc-100 dark:bg-zinc-800" />
                <p className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                    <ShieldAlert className="size-3 text-[#e33e38]" /> Immutable Security Feed
                </p>
            </div>
        </div>
    );
}
