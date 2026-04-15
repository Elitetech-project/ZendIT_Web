'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Check if user has admin role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError || profile?.role !== 'admin') {
                await supabase.auth.signOut();
                toast.error("Unauthorized. Admin access only.");
                return;
            }

            toast.success("Welcome back, Commander.");
            router.push('/admin');
        } catch (err: any) {
            toast.error(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-satoshi flex items-center justify-center p-6 selection:bg-[#e33e38]/20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                            Admin <span className="text-[#e33e38]">Portal</span>
                        </h1>
                        <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] font-black mt-2 flex items-center gap-2">
                            <ShieldCheck className="size-3 text-[#e33e38]" /> Secure Governance Access
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none">
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="admin@zendit.online"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:border-[#e33e38]/30 transition-all font-satoshi"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:border-[#e33e38]/30 transition-all font-satoshi tracking-widest"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-[#e33e38] text-white py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-[#e33e38]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-4 group"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : (
                                <>
                                    Authorize Access <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Deco */}
                <div className="mt-12 flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                        <Activity className="size-3 text-emerald-500 animate-pulse" /> Platform Oversight Verifier v1.0
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
