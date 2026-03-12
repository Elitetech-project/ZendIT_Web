'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '@/components/layout/shell';
import { SendView } from '@/components/home/send-view';
import { ReceiveView } from '@/components/home/receive-view';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

export default function Page() {
    const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
    const { user, balance, address, isLoading, copyAddress } = useWeb3Auth();

    return (
        <Shell>
            <div className="flex flex-col gap-6 font-satoshi">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                Welcome, {(() => {
                                    const name = user?.user_metadata?.username || user?.email?.split('@')[0] || "User";
                                    return name.length > 12 ? `${name.substring(0, 12)}...` : name;
                                })()}
                            </h1>
                            <div className="flex items-center gap-2 mt-1 blur-none">
                                <span className="text-sm text-muted-foreground font-medium">Your wallet:</span>
                                {address ? (
                                    <button
                                        onClick={copyAddress}
                                        className="text-sm font-mono text-primary font-bold hover:underline transition-colors cursor-pointer decoration-dotted underline-offset-4"
                                        title="Click to copy address"
                                    >
                                        {`${address.slice(0, 8)}...${address.slice(-6)}`}
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
                                `≈ $${(parseFloat(balance) * 0.0245).toFixed(2)} USD`
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
