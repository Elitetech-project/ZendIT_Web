'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { Gift } from 'lucide-react';
import { TransactionModal, Transaction } from '@/components/transaction-modal';

export default function RewardsPage() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cashbackTransactions: Transaction[] = [
        { id: 1, name: 'Transfer to John Doe', amount: '$5.20', date: '2025-11-27', time: '14:30', status: 'successful', type: 'cashback', bankName: 'Chase Bank', accountNumber: '1234567890' },
        { id: 2, name: 'Transfer to Jane Smith', amount: '$3.50', date: '2025-11-26', time: '12:15', status: 'successful', type: 'cashback', bankName: 'Bank of America', accountNumber: '0987654321' },
        { id: 3, name: 'Transfer to Alice Johnson', amount: '$2.80', date: '2025-11-25', time: '18:45', status: 'successful', type: 'cashback', bankName: 'Wells Fargo', accountNumber: '1111222233' },
        { id: 4, name: 'Transfer to Bob Williams', amount: '$4.10', date: '2025-11-24', time: '09:20', status: 'pending', type: 'cashback', bankName: 'Citibank', accountNumber: '4444555566' },
        { id: 5, name: 'Transfer to Charlie Brown', amount: '$1.90', date: '2025-11-23', time: '16:00', status: 'successful', type: 'cashback', bankName: 'TD Bank', accountNumber: '5555666677' },
    ];

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    return (
        <Shell>
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Rewards</h1>

                <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-4 text-white">
                        <Gift className="h-6 w-6 mb-2" />
                        <p className="text-xs font-medium opacity-90">Total Cashback</p>
                        <p className="text-xl font-bold">$45.20</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Gift className="h-5 w-5 text-yellow-500" />
                        Cashback per Transaction
                    </h2>

                    <div className="space-y-2">
                        {cashbackTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                onClick={() => handleTransactionClick(transaction)}
                                className="flex items-center justify-between rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors cursor-pointer"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{transaction.name}</span>
                                    <span className="text-xs text-muted-foreground">{transaction.date}</span>
                                </div>
                                <span className="text-sm font-semibold text-green-600">+{transaction.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </Shell>
    );
}
