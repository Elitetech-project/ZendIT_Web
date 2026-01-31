'use client';

import { useState } from 'react';
import { Search, QrCode, ArrowLeft, Building2, Send } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { TransactionModal, Transaction } from '@/components/transaction-modal';

type ViewMode = 'initial' | 'scan' | 'transfer';

// Mock bank data for account name lookup
const mockBankAccounts: Record<string, string> = {
    '1234567890': 'John Doe',
    '0987654321': 'Jane Smith',
    '1111222233': 'Alice Johnson',
    '4444555566': 'Bob Williams',
};

// Mock recent transactions with status
const recentTransactions: Transaction[] = [
    { id: 1, name: 'John Doe', date: '2025-11-27', time: '14:30', amount: '$250.00', status: 'successful', type: 'send', bankName: 'Chase Bank', accountNumber: '1234567890' },
    { id: 2, name: 'Jane Smith', date: '2025-11-27', time: '12:15', amount: '$150.50', status: 'pending', type: 'send', bankName: 'Bank of America', accountNumber: '0987654321' },
    { id: 3, name: 'Alice Johnson', date: '2025-11-26', time: '18:45', amount: '$89.99', status: 'successful', type: 'send', bankName: 'Wells Fargo', accountNumber: '1111222233' },
    { id: 4, name: 'Bob Williams', date: '2025-11-26', time: '09:20', amount: '$320.00', status: 'cancelled', type: 'send', bankName: 'Citibank', accountNumber: '4444555566' },
    { id: 5, name: 'Charlie Brown', date: '2025-11-25', time: '16:00', amount: '$75.25', status: 'successful', type: 'send', bankName: 'TD Bank', accountNumber: '5555666677' },
];




export function SendView() {
    const [mode, setMode] = useState<ViewMode>('initial');
    const [searchQuery, setSearchQuery] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [scannedData, setScannedData] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleScan = (result: any) => {
        if (result && result[0]?.rawValue) {
            setScannedData(result[0].rawValue);
            // You can process the scanned data here
            console.log('Scanned:', result[0].rawValue);
        }
    };

    const handleAccountNumberChange = (value: string) => {
        setAccountNumber(value);
        // Mock account name lookup
        if (mockBankAccounts[value]) {
            setAccountName(mockBankAccounts[value]);
        } else {
            setAccountName('');
        }
    };

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Initial View
    if (mode === 'initial') {
        return (
            <>
                <div className="flex flex-col gap-6">

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search name, @username, or address"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-[100%] rounded-xl bg-gray-100 dark:bg-transparent dark:border dark:text-white py-3 pl-10 pr-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                        />
                    </div>


                    <div className="flex flex-col md:flex-row  gap-4 ">
                        <button
                            onClick={() => setMode('scan')}
                            className="flex flex-col items-center w-full justify-center gap-3 rounded-2xl bg-[#f17c37] dark:bg-orange-600/10 dark:border dark:border-orange-500/20 p-6 text-white hover:opacity-90 transition-opacity"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <QrCode className="h-6 w-6" />
                            </div>
                            <span className="text-md font-semibold">Scan QR</span>
                        </button>


                        <button
                            onClick={() => setMode('transfer')}
                            className="flex flex-col items-center w-full justify-center gap-3 rounded-2xl bg-[#f15b35] dark:bg-red-600/10 dark:border dark:border-red-500/20 p-6 text-white hover:opacity-90 transition-opacity"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <span className="text-md font-semibold">Direct Transfer</span>
                        </button>
                    </div>


                    <div>
                        <h3 className=" mb-3 text-sm font-medium text-muted-foreground">Recent Transactions</h3>
                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    onClick={() => handleTransactionClick(transaction)}
                                    className="flex items-center justify-between rounded-xl bg-secondary p-4 hover:bg-secondary/80 transition-colors cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium dark:text-white">{transaction.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {transaction.date} • {transaction.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <TransactionModal
                    isOpen={isModalOpen}
                    onCloseAction={() => setIsModalOpen(false)}
                    transaction={selectedTransaction}
                />
            </>
        );
    }

    // Scan View
    if (mode === 'scan') {
        return (
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMode('initial')}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        <ArrowLeft className="h-5 dark:text-white w-5" />
                    </button>
                    <h2 className="text-lg font-semibold">Scan QR Code</h2>
                </div>

                {/* QR Scanner */}
                <div className="relative flex justify-center items-center mx-auto overflow-hidden rounded-2xl bg-black md:w-[50%] md:h-[60%] aspect-square">
                    <Scanner
                        onScan={handleScan}
                        components={{

                            finder: true,
                        }}
                        styles={{
                            container: {
                                width: '100%',
                                height: '100%',
                            },
                        }}
                    />
                </div>

                {scannedData && (
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                        <p className="text-sm font-medium text-green-700">Scanned Successfully!</p>
                        <p className="text-xs text-green-600 mt-1 break-all">{scannedData}</p>
                    </div>
                )}

                <p className="text-sm text-center text-muted-foreground">
                    Position the QR code within the frame to scan
                </p>
            </div>
        );
    }

    // Transfer View
    if (mode === 'transfer') {
        return (
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMode('initial')}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        <ArrowLeft className="h-5 dark:text-white w-5" />
                    </button>
                    <h2 className="text-lg font-semibold">Direct Transfer</h2>
                </div>

                {/* Transfer Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Name Input */}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Bank Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Enter bank name"
                                className="w-full dark:bg-transparent dark:border dark:text-white rounded-xl bg-secondary py-3 pl-10 pr-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Account Number Input */}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Account Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter account number"
                            value={accountNumber}
                            onChange={(e) => handleAccountNumberChange(e.target.value)}
                            className="w-full dark:bg-transparent dark:border dark:text-white rounded-xl bg-secondary py-3 px-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Account Name Display */}
                    {accountName && (
                        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                            <p className="text-xs font-medium text-green-700 mb-1">Account Name</p>
                            <p className="text-sm font-semibold text-green-800">{accountName}</p>
                        </div>
                    )}

                    {/* Amount Input */}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Amount
                        </label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full dark:bg-transparent dark:border dark:text-white rounded-xl bg-secondary py-3 px-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Send Button */}

                </div>
                <button className="flex items-center dark:text-white justify-center gap-2 w-full md:w-[50%] mx-auto rounded-xl bg-[#e33e38] py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity mt-2">
                    <Send className="h-4 w-4" />
                    Send Money
                </button>
            </div>
        );
    }

    return null;
}
