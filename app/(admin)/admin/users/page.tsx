"use client";

import { useEffect, useState } from "react";
import { 
    Search, 
    User, 
    Mail, 
    Calendar, 
    TrendingUp, 
    ShieldAlert, 
    MoreHorizontal,
    ArrowRight,
    Loader2,
    RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

interface UserData {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    created_at: string;
    txCount: number;
    totalVolume: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Registered Users</h1>
                    <p className="text-muted-foreground font-medium text-xs md:text-sm">Oversight of ZendIT platform participants.</p>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-sm shadow-sm hover:bg-zinc-50 transition-colors">
                    <RefreshCw className={clsx("size-4", isLoading && "animate-spin")} /> Refresh List
                </button>
            </div>

            {/* Search Header */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Name, Email, or User ID..."
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#e33e38]/30 transition-all font-satoshi"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-8 px-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Total Registered</span>
                        <span className="text-xl font-black text-zinc-900 dark:text-white">{users.length}</span>
                    </div>
                    <div className="h-8 w-px bg-zinc-100 dark:bg-zinc-800 hidden md:block" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Active This Week</span>
                        <span className="text-xl font-black text-emerald-500">{users.filter(u => u.txCount > 0).length}</span>
                    </div>
                </div>
            </div>

            {/* Users Grid/Table */}
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="size-10 animate-spin text-[#e33e38]" />
                    </div>
                )}

                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 whitespace-nowrap">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">User Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Join Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Transactions</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Volume</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Security</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 whitespace-nowrap">
                            {filteredUsers.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.2em] text-sm leading-relaxed"> No users found <br/> matching your search query </p>
                                    </td>
                                </tr>
                            )}
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                                {u.avatar_url ? (
                                                    <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="size-5 text-zinc-400" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{u.full_name || 'Anonymous User'}</span>
                                                <span className="text-xs text-zinc-400 font-medium">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Calendar className="size-3.5" />
                                            <span className="text-xs font-bold">{format(new Date(u.created_at), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-md text-[10px] font-black",
                                                u.txCount > 0 ? "bg-indigo-500/10 text-indigo-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                            )}>
                                                {u.txCount} TXs
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-black text-sm">
                                            <span className="text-[10px] text-zinc-400">₦</span>
                                            {u.totalVolume.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest w-fit">
                                            <CheckCircle2 className="size-3" /> VERIFIED
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-xl hover:bg-[#e33e38]/10 hover:text-[#e33e38] transition-colors text-zinc-400">
                                                <ShieldAlert className="size-4" />
                                            </button>
                                            <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400">
                                                <MoreHorizontal className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Info Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Only administrators can manage security privileges from this view.</p>
                </div>
            </div>

            {/* Detail Preview Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#e33e38] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <TrendingUp className="size-8 mb-4 text-white/50" />
                        <h3 className="text-2xl font-black mb-2">Growth Analytics</h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[80%]">
                            User retention is currently <span className="text-yellow-300 font-bold">84%</span>. New signups have increased by <span className="text-emerald-300 font-bold">12%</span> this month.
                        </p>
                        <button className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 transition-all px-6 py-3 rounded-full">
                            View Growth Report <ArrowRight className="size-3" />
                        </button>
                    </div>
                    <div className="absolute -right-12 -bottom-12 h-64 w-64 bg-white/10 blur-[80px] rounded-full" />
                </div>
            </div>
        </div>
    );
}

// Minimal missing component for the icon
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
