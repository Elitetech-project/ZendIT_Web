'use client';

import { useState } from 'react';
import { Search, QrCode, ArrowLeft, Building2, Send } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { TransactionModal, Transaction } from '@/components/transaction-modal';
import { calculateQuote } from '@/lib/oracle';
import toast from 'react-hot-toast';

type ViewMode = 'initial' | 'scan' | 'transfer';

// Mock bank data for account name lookup
const mockBankAccounts: Record<string, string> = {
    // Adding few accounts to demonstrate direct lookup
};

// Mock recent transactions with status 
const recentTransactions: Transaction[] = [];




export function SendView() {
    const [mode, setMode] = useState<ViewMode>('initial');
    const [searchQuery, setSearchQuery] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [fiatAmount, setFiatAmount] = useState('');
    const [quote, setQuote] = useState<any>(null);
    const [isQuoting, setIsQuoting] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [accountName, setAccountName] = useState<string>('');

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
                            className="flex flex-col cursor-pointer  items-center w-full  justify-center gap-3 rounded-2xl bg-[#f17c37] p-6 text-white hover:opacity-90 transition-opacity"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <QrCode className="h-6 w-6" />
                            </div>
                            <span className="text-md font-semibold">Scan QR</span>
                        </button>


                        <button
                            onClick={() => setMode('transfer')}
                            className="flex flex-col cursor-pointer items-center w-full justify-center gap-3 rounded-2xl bg-[#f15b35] p-6 text-white hover:opacity-90 transition-opacity"
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
                                    className="flex items-center justify-between rounded-xl bg-secondary/35 p-4 hover:bg-secondary/45 transition-colors cursor-pointer"
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
                        className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full bg-secondary/50F hover:bg-secondary/80 transition-colors"
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

    // Transfer View (The Remittance Engine)
    if (mode === 'transfer') {
        const handleGetQuote = async () => {
            if (!fiatAmount || isNaN(Number(fiatAmount)) || Number(fiatAmount) <= 0) {
                return toast.error("Please enter a valid amount");
            }
            setIsQuoting(true);
            try {
                const q = await calculateQuote(Number(fiatAmount));
                setQuote(q);
            } catch (err) {
                toast.error("Failed to fetch price quote");
            } finally {
                setIsQuoting(false);
            }
        };

        const handleSend = async () => {
            if (!quote) return;
            toast.loading("Initiating on-chain transaction...", { duration: 3000 });
            // This is where we would call the Flare contract to send FLR
            setTimeout(() => {
                toast.success("FLR Sent! Payout initiated to bank account.");
                setMode('initial');
                setQuote(null);
                setFiatAmount('');
                setAccountNumber('');
                setBankName('');
            }, 3500);
        };

        return (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setMode('initial'); setQuote(null); }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary/80 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 dark:text-white w-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">Send to Bank</h2>
                        <p className="text-xs text-muted-foreground italic">Powered by Flare FTSO</p>
                    </div>
                </div>

                {/* Remittance Form */}
                <div className="flex flex-col gap-5">
                    {/* Bank & Account section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Receiving Bank</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                                <input
                                    type="text"
                                    placeholder="Enter bank name or code"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full h-12 bg-secondary/20 dark:border-primary/20 border-gray-200 border rounded-2xl pl-10 pr-4 text-sm font-medium outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Account Number</label>
                            <input
                                type="text"
                                placeholder="0000000000"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full h-12 bg-secondary/20 dark:border-primary/20 border-gray-200 border rounded-2xl px-4 text-sm font-medium outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Amount Input with selector */}
                    <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">How much should they receive?</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-foreground">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={fiatAmount}
                                    onChange={(e) => { setFiatAmount(e.target.value); setQuote(null); }}
                                    className="w-full h-16 bg-secondary/10 dark:text-white rounded-3xl pl-10 pr-4 text-2xl font-black outline-none border-2 border-transparent focus:border-primary transition-all"
                                />
                            </div>
                            <div className="w-24 h-16 bg-muted rounded-3xl flex items-center justify-center font-bold">USD</div>
                        </div>
                    </div>

                    {/* Quote Display Area */}
                    <div className="min-h-[100px] flex items-center justify-center">
                        {isQuoting ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                <p className="text-xs text-muted-foreground">Calculating best FLR route...</p>
                            </div>
                        ) : quote ? (
                            <div className="w-full p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 animate-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                                    <span className="text-sm font-medium text-muted-foreground">You send:</span>
                                    <span className="text-xl font-black text-primary">{quote.flrAmount} FLR</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-muted-foreground/60">
                                        <span>Exchange Rate</span>
                                        <span>1 FLR = ${quote.price}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-muted-foreground/60">
                                        <span>Platform Fee (1%)</span>
                                        <span>{quote.fee} FLR</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleGetQuote}
                                className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold transition-all cursor-pointer border border-dashed border-muted-foreground/20"
                            >
                                Generate Transfer Quote
                            </button>
                        )}
                    </div>

                    {/* Final Action */}
                    <button
                        disabled={!quote}
                        onClick={handleSend}
                        className={`group relative flex items-center justify-center gap-3 w-full h-16 rounded-3xl font-black text-lg transition-all
                            ${quote
                                ? "bg-[#e33e38] text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"}
                        `}
                    >
                        <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Complete Transfer
                    </button>

                    <p className="text-[10px] text-center text-muted-foreground px-10">
                        Funds are sent to the ZendIT treasury and settled to the recipient bank within 5-15 minutes.
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
