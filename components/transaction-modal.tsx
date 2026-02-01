'use client';

import { X, CheckCircle, Clock, XCircle, Calendar, User, Building2, CreditCard, DollarSign, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

export type TransactionStatus = 'pending' | 'successful' | 'cancelled';

export interface Transaction {
    id: string | number;
    name: string;
    amount: string;
    date: string;
    time?: string;
    status: TransactionStatus;
    type?: 'send' | 'receive' | 'cashback';
    bankName?: string;
    accountNumber?: string;
    reference?: string;
}

interface TransactionModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    transaction: Transaction | null;
}

export function TransactionModal({ isOpen, onCloseAction, transaction }: TransactionModalProps) {
    if (!transaction) return null;

    const getStatusConfig = (status: TransactionStatus) => {
        switch (status) {
            case 'successful':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20',
                    label: 'Successful',
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/20',
                    label: 'Pending',
                };
            case 'cancelled':
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/20',
                    label: 'Cancelled',
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
                        className="fixed inset-x-4 h-[90vh] top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
                    >
                        <div className="bg-background rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-[#f17c37] to-[#e33e38] p-6 text-white">
                                <button
                                    onClick={onCloseAction}
                                    className="absolute top-4 cursor-pointer right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <h2 className="text-xl font-bold mb-2">Transaction Details</h2>
                                <p className="text-sm opacity-90">Reference: {transaction.reference || `TXN${transaction.id}`}</p>
                                <p className="text-sm opacity-90">Transaction Hash: {"#########"}</p>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Amount */}
                                <div className=" flex items-center gap-3 py-2  ">
                                    <p className="text-2xl font-bold mb-1">Amount:</p>
                                    <p className="text-2xl font-bold">{transaction.amount}</p>
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
