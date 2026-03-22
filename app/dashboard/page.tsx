'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '@/components/layout/shell';
import { SendView } from '@/components/home/send-view';
import { ReceiveView } from '@/components/home/receive-view';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import toast from 'react-hot-toast';

export default function Page() {
    const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
    const [price, setPrice] = useState<number>(0.0087);
    const [currency, setCurrency] = useState('USDT');
    const [symbol, setSymbol] = useState('');
    const { user, balance, address, isLoading, copyAddress, refreshBalance } = useWeb3Auth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure we get USD price for the balance card
                const response = await fetch('/api/price?currency=usd');
                const data = await response.json();

                if (data.price) {
                    setPrice(data.price);
                    setCurrency(data.currency);
                    setSymbol(data.symbol);
                }

                // Also refresh on-chain balance
                refreshBalance();
            } catch (err) {
                console.error("Dashboard poll error:", err);
            }
        };
        fetchData();

        // Auto-update price and balance every 15 seconds
        const intervalId = setInterval(fetchData, 15000);
        return () => clearInterval(intervalId);
    }, [refreshBalance]);

    return (
        <Shell>
            <div className="flex flex-col gap-6 font-satoshi">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                Welcome, {(() => {
                                    const fullName = user?.user_metadata?.full_name || "User";
                                    return fullName.length > 15 ? `${fullName.substring(0, 15)}...` : fullName;
                                })()}
                            </h1>
                            <div className="flex items-center gap-2 mt-1 blur-none">
                                <span className="text-sm text-muted-foreground font-medium">Username:</span>
                                {user?.user_metadata?.username ? (
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`@${user.user_metadata.username}`);
                                            toast.success("Username copied to clipboard!");
                                        }}
                                        className="text-sm font-mono text-primary font-bold hover:underline transition-colors cursor-pointer decoration-dotted underline-offset-4"
                                        title="Click to copy username"
                                    >
                                        @{(() => {
                                            const uname = user.user_metadata.username;
                                            return uname.length > 15 ? `${uname.substring(0, 15)}...` : uname;
                                        })()}
                                    </button>
                                ) : (
                                    <div className="h-4 w-32 animate-pulse bg-muted rounded mt-1" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e33e38] via-[#f17c37] to-[#f15b35] p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative z-10">
                        <span className="text-xs font-bold opacity-90 font-roboto uppercase tracking-[0.2em] mb-2 block">Total Portfolio Balance </span>
                        <div className="flex items-baseline gap-2">
                            {isLoading ? (
                                <div className="h-12 w-48 bg-white/20 animate-pulse rounded-xl mb-1" />
                            ) : (
                                <h2 className="text-5xl font-black font-roboto tracking-tighter">
                                    {balance}
                                </h2>
                            )}
                            {!isLoading && <span className="text-2xl font-bold opacity-80">FLR</span>}
                        </div>
                        <div className="mt-2 text-sm font-medium opacity-80">
                            {isLoading ? (
                                <div className="h-4 w-24 bg-white/20 animate-pulse rounded-lg" />
                            ) : (
                                `≈ ${symbol}${(parseFloat(balance) * price).toFixed(4)} ${currency}`
                            )}
                        </div>
                    </div>

                    <Button variant={"default"} className='cursor-pointer bg-white text-black ' >Fund Wallet</Button>

                    {/* Decorative circles */}
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                </div>

                {/* Tabs */}
                <div className="flex gap-6 rounded-2xl bg-transparent p-1">
                    <button
                        onClick={() => setActiveTab('send')}
                        className={clsx(
                            "relative cursor-pointer flex-1  rounded-xl py-3 text-sm font-semibold transition-colors",
                            activeTab === 'send' ? "text-primary-foreground dark:text-white " : "text-[#e33e38] dark:bg-gray-100  bg-gray-100"
                        )}
                    >
                        {activeTab === 'send' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 rounded-xl bg-[#e33e38] shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Send</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('receive')}
                        className={clsx(
                            "relative cursor-pointer flex-1 rounded-xl py-3 text-sm font-semibold transition-colors",
                            activeTab === 'receive' ? "text-primary-foreground dark:text-white" : "text-[#e33e38] bg-gray-100"
                        )}
                    >
                        {activeTab === 'receive' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0  rounded-xl bg-[#e33e38] shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Receive</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'send' ? <SendView /> : <ReceiveView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </Shell>
    );
}
