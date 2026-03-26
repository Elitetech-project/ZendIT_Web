'use client';

import { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/shell';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TransactionModal, Transaction } from '@/components/transaction-modal';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryPage() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch initial transactions
        const fetchTransactions = async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to fetch transactions:', error);
            } else {
                setTransactions(data || []);
            }
            setLoading(false);
        };

        fetchTransactions();

        // 2. Subscribe to realtime updates
        const channel = supabase
            .channel('transactions-history')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'transactions'
                },
                (payload) => {
                    // Update just the changed transaction in state
                    setTransactions((prev) =>
                        prev.map((tx) =>
                            tx.id === payload.new.id ? { ...tx, ...payload.new } : tx
                        )
                    );

                    setSelectedTransaction((prev) =>
                        prev?.id === payload.new.id ? { ...prev, ...payload.new } as Transaction : prev
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <Shell>
                <div className="flex flex-col gap-6 font-satoshi">
                    <h1 className="text-2xl font-bold font-roboto">History</h1>
                    <p className="text-muted-foreground text-sm">Loading transactions...</p>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="flex flex-col gap-6 font-satoshi">
                <h1 className="text-2xl font-bold font-roboto">History</h1>

                <div className="flex flex-col gap-4">
                    {transactions.length === 0 && (
                        <p className="text-muted-foreground text-sm">No transactions yet.</p>
                    )}
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            onClick={() => handleTransactionClick(tx)}
                            className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 hover:bg-secondary/70 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'send' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {tx.type === 'send' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium">{tx.name}</p>
                                    <p className="text-xs text-muted-foreground">{tx.date} • {tx.time}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${tx.type === 'send' ? 'text-foreground' : 'text-green-500'}`}>
                                    {tx.type === 'send' ? '-' : '+'}{tx.amount}
                                </p>
                                <p className={`text-xs capitalize font-medium ${tx.status === 'completed' ? 'text-green-500' :
                                        tx.status === 'failed' ? 'text-red-500' :
                                            'text-yellow-500'
                                    }`}>
                                    {tx.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </Shell>
    );
}
