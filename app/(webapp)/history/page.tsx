'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TransactionModal, Transaction } from '@/components/transaction-modal';

export default function HistoryPage() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const transactions: Transaction[] = [
        { id: 1, type: 'send', name: 'User 1', amount: '$50.00', date: '2025-11-27', time: '10:23 AM', status: 'successful', bankName: 'Chase Bank', accountNumber: '1234567890' },
        { id: 2, type: 'receive', name: 'User 2', amount: '$120.00', date: '2025-11-26', time: '4:15 PM', status: 'successful', bankName: 'Bank of America', accountNumber: '0987654321' },
        { id: 3, type: 'send', name: 'Merchant ABC', amount: '$12.50', date: '2025-11-24', time: '2:30 PM', status: 'pending', bankName: 'Wells Fargo', accountNumber: '1111222233' },
        { id: 4, type: 'receive', name: 'Salary', amount: '$2,500.00', date: '2025-11-20', time: '9:00 AM', status: 'successful', bankName: 'Citibank', accountNumber: '4444555566' },
    ];

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    return (
        <Shell>
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">History</h1>

                <div className="flex flex-col gap-4">
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            onClick={() => handleTransactionClick(tx)}
                            className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 hover:bg-secondary/70 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'send' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
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
                                <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
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
