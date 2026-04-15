'use client';

import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from 'lucide-react';
import { TransactionModal, Transaction } from '@/components/transaction-modal';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { format } from 'date-fns';

export default function HistoryPage() {
    const { user } = useWeb3Auth();
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user?.id) fetchHistory();
    }, [user?.id]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/transactions/history?userId=${user.id}`);
            const data = await response.json();
            if (data.success) setHistory(data.transactions);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransactionClick = (tx: any) => {
        // Map Supabase record to Transaction Modal interface
        const mappedTx: Transaction = {
            id: tx.id,
            type: tx.type === 'external_remittance' ? 'send' : 'receive',
            name: tx.recipient_details?.accountName || 'Remittance',
            amount: `₦${parseFloat(tx.amount_fiat).toLocaleString()}`,
            amountFlr: parseFloat(tx.amount_flr).toFixed(2),
            date: format(new Date(tx.created_at), 'yyyy-MM-dd'),
            time: format(new Date(tx.created_at), 'p'),
            status: tx.status,
            bankName: tx.recipient_details?.bankName,
            accountNumber: tx.recipient_details?.accountNumber,
            txHash: tx.tx_hash,
            errorNote: tx.error_note,
            reference: `TXN${tx.id.substring(0, 8).toUpperCase()}`,
        };
        setSelectedTransaction(mappedTx);
        setIsModalOpen(true);
    };

    return (
        <Shell>
            <div className="flex flex-col gap-6 font-satoshi ">
                <h1 className="text-2xl font-bold font-roboto ">History</h1>

                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-24 gap-4 text-muted-foreground opacity-50">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="text-sm font-bold uppercase tracking-[0.2em]">Syncing History...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <p className="text-sm font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">No transactions recorded yet</p>
                        </div>
                    ) : (
                        history.map((tx) => (
                            <div
                                key={tx.id}
                                onClick={() => handleTransactionClick(tx)}
                                className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 hover:bg-secondary/70 transition-all border border-transparent hover:border-white/5 cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${tx.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-brand/10 text-brand'}`}>
                                        {tx.status === 'processing' ? <Clock className="h-5 w-5 animate-pulse" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase italic tracking-tight leading-none mb-1">{tx.recipient_details?.accountName || 'Remittance'}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">
                                            {format(new Date(tx.created_at), 'MMM dd, yyyy')} • {format(new Date(tx.created_at), 'p')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-base italic leading-none mb-1 ${tx.status === 'failed' ? 'text-red-500' : 'text-white'}`}>
                                        -₦{parseFloat(tx.amount_fiat).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-mono font-bold mb-1">
                                        {parseFloat(tx.amount_flr).toFixed(2)} FLR
                                    </p>
                                    <p className={`text-[10px] uppercase font-black tracking-widest ${tx.status === 'completed' ? 'text-green-500' : tx.status === 'failed' ? 'text-red-500' : 'text-amber-500'}`}>
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
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
