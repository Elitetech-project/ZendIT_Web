'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '@/components/layout/shell';
import { SendView } from '@/components/home/send-view';
import { ReceiveView } from '@/components/home/receive-view';
import { clsx } from 'clsx';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');

  return (
    <Shell>
      <div className="flex flex-col gap-6 font-satoshi">
        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#f17c37] p-6 text-white shadow-lg">
          <div className="relative z-10">
            <span className="text-sm font-medium opacity-80">Total Balance </span>
            <h2 className="mt-1 text-4xl font-bold font-roboto ">$12,450.00</h2>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md">
                +2.5%
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md">
                FXRP
              </span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 rounded-2xl bg-transparent p-1">
          <button
            onClick={() => setActiveTab('send')}
            className={clsx(
              "relative flex-1  rounded-xl py-3 text-sm font-semibold transition-colors",
              activeTab === 'send' ? "text-primary-foreground dark:text-white" : "text-muted-foreground dark:bg-[#e33e38]  hover:text-foreground bg-gray-100"
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
              "relative flex-1 rounded-xl py-3 text-sm font-semibold transition-colors",
              activeTab === 'receive' ? "text-primary-foreground dark:text-white" : "text-muted-foreground dark:bg-[#e33e38]/40 hover:text-foreground bg-gray-100"
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
