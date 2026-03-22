'use client';

import { X, CheckCircle, Clock, XCircle, Calendar, User, Building2, CreditCard, DollarSign, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

import { toast } from 'react-hot-toast';

export type TransactionStatus = 'pending' | 'successful' | 'cancelled' | 'completed' | 'processing' | 'failed';

export interface Transaction {
    id: string | number;
    name: string;
    amount: string;
    amountFlr?: string;
    date: string;
    time?: string;
    status: string;
    type?: 'send' | 'receive' | 'cashback';
    bankName?: string;
    accountNumber?: string;
    reference?: string;
    txHash?: string;
}

interface TransactionModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    transaction: Transaction | null;
}

export function TransactionModal({ isOpen, onCloseAction, transaction }: TransactionModalProps) {
    if (!transaction) return null;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`, {
            id: 'copy-toast',
            style: { fontSize: '12px', fontWeight: 'bold' }
        });
    };

    const formatHash = (hash: string) => {
        if (!hash || hash === 'N/A') return 'N/A';
        return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
    };

    const getStatusConfig = (status: string) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'completed':
            case 'successful':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20',
                    label: 'Successful',
                };
            case 'processing':
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/20',
                    label: 'Processing',
                };
            case 'failed':
            case 'cancelled':
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/20',
                    label: 'Failed',
                };
            default:
                return {
                    icon: Clock,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-500/10',
                    borderColor: 'border-gray-500/20',
                    label: status.toUpperCase(),
                };
        }
    };

    const statusConfig = getStatusConfig(transaction.status);
    const StatusIcon = statusConfig.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCloseAction}
                        className="fixed inset-0 bg-white/12 backdrop-blur-sm z-50 font-satoshi "
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4  top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
                    >
                        <div className="bg-background rounded-2xl shadow-2xl overflow-hidden border border-white/5">
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-[#f17c37] to-[#e33e38] p-6 text-white">
                                <button
                                    onClick={onCloseAction}
                                    className="absolute top-4 cursor-pointer right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <h2 className="text-xl font-bold mb-1 tracking-tight uppercase">Transaction Receipt</h2>

                                <div
                                    onClick={() => copyToClipboard(transaction.reference || String(transaction.id), 'Reference ID')}
                                    className="text-[10px] opacity-70 font-mono flex items-center gap-1 uppercase font-bold tracking-widest cursor-pointer hover:opacity-100 transition-opacity"
                                >
                                    Ref: {transaction.reference || transaction.id}
                                </div>

                                <div
                                    onClick={() => copyToClipboard(transaction.txHash || '', 'Transaction Hash')}
                                    className="group text-[10px] opacity-100 font-mono mt-2 break-all bg-black/20 p-2 rounded-lg border border-white/10 cursor-pointer hover:bg-black/40 transition-all"
                                >
                                    <span className=" uppercase mr-1">Hash:</span>
                                    {formatHash(transaction.txHash || 'N/A')}
                                    <span className="float-right opacity-0 group-hover:opacity-100 transition-opacity text-[8px] uppercase tracking-tighter">Click to Copy</span>
                                </div>
                            </div>

                            {/* Content - Scrollable with Hidden Scrollbar */}
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                                <style jsx>{`
                                    .scrollbar-hide::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                {/* Amount Section */}
                                <div className=" flex items-center justify-between py-4 border-b border-white/5 ">
                                    <p className="text-xl font-bold uppercase tracking-[0.2em] text-xs text-white">Payout Amount:</p>
                                    <div className="text-right">
                                        <p className="text-3xl font-black italic mb-1 text-white">{transaction.amount}</p>
                                        <p className="text-xs font-bold text-brand italic">≈ {transaction.amountFlr} FLR</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className={`flex items-center gap-3`}>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                                            <StatusIcon className="h-4 w-4 text-muted-foreground text-green-700 " />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Status</p>
                                            <span className={`font-semibold text-sm `}>
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-7 w-7  items-center justify-center rounded-full bg-secondary">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Recipient</p>
                                            <p className="font-medium text-sm">{transaction.name}</p>
                                        </div>
                                    </div>

                                    {transaction.bankName && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7  items-center justify-center rounded-full bg-secondary">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground">Bank</p>
                                                <p className="font-medium text-sm">{transaction.bankName}</p>
                                            </div>
                                        </div>
                                    )}

                                    {transaction.accountNumber && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7  items-center justify-center rounded-full bg-secondary">
                                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground">Account Number</p>
                                                <p className="font-medium text-sm">{transaction.accountNumber}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-7 w-7  items-center justify-center rounded-full bg-secondary">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Date & Time</p>
                                            <p className="font-medium text-sm">
                                                {transaction.date} {transaction.time && `• ${transaction.time}`}
                                            </p>
                                        </div>
                                    </div>

                                    {transaction.type && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7  items-center justify-center rounded-full bg-secondary">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground">Type</p>
                                                <p className="font-medium capitalize text-sm">{transaction.type}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <Button variant={"default"} className='cursor-pointer mt-3' > Download Reciept <Download size={16} /> </Button>


                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
