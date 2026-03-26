'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, Building2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateQuote } from '@/lib/oracle';
import { fetchBanks, resolveAccount, initiateTransfer } from '@/lib/flutterwave';
import toast from 'react-hot-toast';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { clsx } from 'clsx';
import OTPModal from '../OTPModal';

export function SendView() {
    // Form State
    const [accountNumber, setAccountNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [accountName, setAccountName] = useState<string | null>(null);
    const [fiatAmount, setFiatAmount] = useState('');

    // UI State for Custom Dropdown
    const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
    const [bankSearch, setBankSearch] = useState('');
    const [banks, setBanks] = useState<any[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Business Logic State
    const [quote, setQuote] = useState<any>(null);
    const [isQuoting, setIsQuoting] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingBanks, setIsLoadingBanks] = useState(false); // New State
    const [countryCode, setCountryCode] = useState('NG'); // New State
    const [selectedCurrency, setSelectedCurrency] = useState('NGN'); // New State
    const [showOTP, setShowOTP] = useState(false);
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [initialAttempts, setInitialAttempts] = useState(3);

    const { user, sendTransaction } = useWeb3Auth();
    const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS;

    // 1. Detect Location & Auto-Select Currency
    useEffect(() => {
        const detect = async () => {
            try {
                const res = await fetch('/api/geo');
                const geo = await res.json();
                setCountryCode(geo.country);
                setSelectedCurrency(geo.currency);
            } catch (err) {
                console.error("Geo detection failed:", err);
            }
        };
        detect();
    }, []);

    // 2. Fetch Banks Dynamically via Local Secure API
    useEffect(() => {
        const loadBanks = async () => {
            setIsLoadingBanks(true);
            try {
                const res = await fetch(`/api/banks?country=${countryCode}`);
                const data = await res.json();

                if (data.banks) {
                    setBanks(data.banks);
                } else {
                    console.error('Error in bank API response:', data.error);
                    setBanks([]);
                }
            } catch (error) {
                console.error('Failed to load banks via local API:', error);
                setBanks([]);
            } finally {
                setIsLoadingBanks(false);
            }
        };
        loadBanks();
    }, [countryCode]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsBankDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Verification Logic (Auto-Resolve Account Name)
    useEffect(() => {
        if (accountNumber.length === 10 && selectedBank) {
            const resolve = async () => {
                setIsResolving(true);
                setAccountName(null);
                try {
                    const response = await fetch('/api/accounts/resolve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ accountNumber, bankCode: selectedBank.code })
                    });
                    const data = await response.json();
                    if (data.accountName) setAccountName(data.accountName);
                } catch (err) {
                    console.error("Resolve error:", err);
                } finally {
                    setIsResolving(false);
                }
            };
            resolve();
        }
    }, [accountNumber, selectedBank]);

    // 3. Automatic Live Quoting Logic (Stable & Smooth)
    useEffect(() => {
        const getQuote = async (isManualChange = false) => {
            if (!fiatAmount || isNaN(parseFloat(fiatAmount)) || parseFloat(fiatAmount) <= 0) {
                setQuote(null);
                return;
            }

            // Only show loading state on manual typing, not on pulse updates
            if (isManualChange) setIsQuoting(true);

            try {
                const res = await calculateQuote(parseFloat(fiatAmount), selectedCurrency);
                setQuote(res);
            } catch (err) {
                console.error("Quote failed:", err);
            } finally {
                setIsQuoting(false);
            }
        };

        // Trigger manual update (show spinner)
        const timeoutId = setTimeout(() => getQuote(true), 500);

        // Background polling (Silent update - no spinner)
        const intervalId = setInterval(() => getQuote(false), 3000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [fiatAmount, selectedCurrency]);

    const handleTransferClick = async () => {
        if (!quote || !user || !treasuryWallet || !accountName) return toast.error("Verify details first!");

        setIsSendingOTP(true);
        const toastId = toast.loading("Sending verification code...");
        try {
            const res = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email, userName: user.name || 'User' }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Verification code sent!', { id: toastId });
                setInitialAttempts(data.attemptsLeft ?? 2); // Default to 2 remaining if we just successfully requested 1
                setShowOTP(true);
            } else {
                toast.error(data.error || 'Failed to send code.', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error while sending code.', { id: toastId });
        }
        setIsSendingOTP(false);
    };

    const handleSend = async () => {
        if (!quote || !user || !treasuryWallet || !accountName) return toast.error("Verify details first!");

        setIsProcessing(true);
        const toastId = toast.loading("Initiating transaction...");

        try {
            // Step 1: Create local record
            const initResponse = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    amountFlr: quote.flrAmount.toString(),
                    amountFiat: fiatAmount,
                    currency: 'NGN',
                    recipientDetails: {
                        bankCode: selectedBank.code,
                        bankName: selectedBank.name,
                        accountNumber,
                        accountName
                    }
                })
            });

            if (!initResponse.ok) throw new Error("Failed to create record");
            const { transactionId } = await initResponse.json();

            // Step 2: Send FLR to Treasury
            toast.loading("Please sign the transaction in your wallet...", { id: toastId });
            const txHash = await sendTransaction(treasuryWallet, quote.flrAmount.toString());

            // Step 3: Register Hash
            toast.loading("Confirming on Blockchain (this may take 10s)...", { id: toastId });
            await fetch('/api/transactions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId, txHash })
            });

            // Step 4: Final Settlement & Verification
            const verifyResponse = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txHash, transactionId })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                throw new Error(verifyData.details || verifyData.error || 'Payout verification failed');
            }

            // Step 5: Send Success Email Receipt in the background
            fetch('/api/receipt/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    userName: user.name || 'User',
                    amountFiat: fiatAmount,
                    amountFlr: quote.flrAmount.toFixed(2),
                    recipientName: accountName,
                    bankName: selectedBank.name,
                    accountNumber: accountNumber,
                    txHash: txHash
                })
            }).catch(e => console.error("Failed to send receipt email:", e));

            toast.success("Payout initiated! Your Naira is on the way 🎉", { id: toastId });
            setQuote(null);
            setFiatAmount('');
            setAccountNumber('');
            setAccountName(null);
            setSelectedBank(null);

        } catch (error: any) {
            toast.error(error.message || "Transaction failed.", { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredBanks = banks.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-satoshi pr-2">

            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#e33e38]/10 text-[#e33e38]">
                    <Building2 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Transfer to Bank</h2>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Local Fiat Payout</p>
                </div>
            </div>

            <div className="flex flex-col gap-5 ">
                {/* Account Number FIRST */}
                <div>
                    <div className="space-y-1.5 transition-colors">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-4 tracking-widest">Account Number</label>
                        <div className="relative pt-2">
                            <input
                                type="text"
                                maxLength={10}
                                placeholder="10-digit account no."
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full h-14 bg-transparent text-muted-foreground rounded-full px-6 text-sm font-bold outline-none border dark:border-white/30 focus:border-[#e33e38]/30 transition-all"
                            />
                            {isResolving && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-[#e33e38]" />}
                        </div>
                    </div>
                </div>

                {/* Bank Dropdown SECOND */}
                <div className="space-y-1.5 transition-colors relative" ref={dropdownRef}>
                    <label className="text-[10px] font-black text-muted-foreground uppercase ml-4 tracking-widest">Receiving Bank</label>
                    <button
                        onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                        className="w-full mt-2 h-14 bg-transparent dark:border-white/30 border rounded-full px-6 flex items-center justify-between focus:border-[#e33e38]/30 transition-all cursor-pointer group hover:bg-secondary/30"
                    >
                        <span className={clsx("text-sm font-bold truncate", selectedBank ? "text-foreground" : "text-muted-foreground")}>
                            {selectedBank ? selectedBank.name : "Select your bank..."}
                        </span>
                        <ChevronDown className={clsx("h-5 w-5 transition-transform text-muted-foreground", isBankDropdownOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {isBankDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden p-2"
                            >
                                <div className="relative mb-2 px-2 pt-2">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search bank name..."
                                        value={bankSearch}
                                        onChange={(e) => setBankSearch(e.target.value)}
                                        className="w-full h-10 bg-secondary/20 dark:bg-zinc-800/50 rounded-full px-10 text-xs font-bold outline-none border border-transparent focus:border-[#e33e38]/30 transition-all"
                                    />
                                </div>
                                <div className="max-h-[250px] overflow-y-auto custom-scrollbar px-1">
                                    {filteredBanks.length > 0 ? filteredBanks.map((bank) => (
                                        <button
                                            key={bank.code}
                                            onClick={() => { setSelectedBank(bank); setIsBankDropdownOpen(false); setBankSearch(''); }}
                                            className="w-full px-4 py-3 rounded-2xl flex items-center justify-between hover:bg-[#e33e38]/5 group transition-colors cursor-pointer text-left"
                                        >
                                            <span className="text-sm font-bold truncate group-hover:text-[#e33e38] transition-colors">{bank.name}</span>
                                            {selectedBank?.code === bank.code && <Check className="h-4 w-4 text-[#e33e38]" />}
                                        </button>
                                    )) : (
                                        <div className="py-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest italic animate-pulse">No banks matching "{bankSearch}"</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Account Name */}
                <div className="space-y-1.5 w-full md:w-[50%]">
                    <label className="text-[10px] font-black text-muted-foreground uppercase ml-4 tracking-widest">Account Name</label>
                    <div className="relative pt-2">
                        <input
                            type="text"
                            readOnly
                            value={accountName || (isResolving ? "Resolving..." : "Pending Verification")}
                            className="w-full h-14 bg-transparent rounded-full px-6 text-sm font-black text-muted-foreground border dark:border-white/30 outline-none cursor-not-allowed uppercase italic"
                        />
                        {accountName && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#e33e38] animate-in zoom-in duration-300" />}
                        {!accountName && !isResolving && accountNumber.length === 10 && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500/50" />}
                    </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase ml-4 tracking-widest text-[#e33e38]">Payout Amount</label>
                    <div className="relative group pt-2">
                        <input type="number" placeholder="0.00" value={fiatAmount} onChange={(e) => setFiatAmount(e.target.value)} className="w-full h-14 bg-transparent text-muted-foreground rounded-full pl-16 pr-16 text-sm font-black outline-none border dark:border-white/30 focus:border-[#e33e38]/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        <span className="absolute left-12 top-[60%] -translate-y-1/2 font-black text-md text-[#e33e38]">₦</span>
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-muted-foreground/30 text-xs">NGN</span>
                    </div>
                </div>

                {/* Automatic Quote Box */}
                <div className="min-h-[110px] flex items-center justify-center pt-2">
                    <AnimatePresence mode="wait">
                        {isQuoting ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="loading" className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e33e38]" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Live Quoting...</span>
                            </motion.div>
                        ) : quote ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} key="quote" className="w-full p-6 rounded-[2rem] bg-zinc-950/50 border border-zinc-800 relative shadow-2xl overflow-hidden backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Est. Transfer Cost:</span>
                                    <span className="text-4xl font-black text-white">{quote.flrAmount.toFixed(2)} <span className="text-sm text-[#e33e38] font-black">FLR</span></span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black text-zinc-600 tracking-tighter">
                                    <span>Current Market Price</span>
                                    <span>1 FLR = {quote.symbol}{quote.price.toFixed(2)}</span>
                                </div>
                                <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#e33e38]/5 blur-[60px] rounded-full" />
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest text-center">
                                Enter an amount to see the exchange quote
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button disabled={!quote || isProcessing || isSendingOTP || !accountName} onClick={handleTransferClick} className="flex items-center justify-center gap-3 w-full md:w-[60%] mx-auto h-14 rounded-full font-black text-xl bg-[#e33e38] text-white disabled:opacity-20 cursor-pointer shadow-2xl shadow-[#e33e38]/10 hover:shadow-[#e33e38]/30 hover:scale-[1.02] active:scale-95 transition-all">
                    {(isProcessing || isSendingOTP) ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /> : <Send className="h-5 w-4" />}
                    {isSendingOTP ? "Sending Code..." : (isProcessing ? "Finalizing Transfer..." : "Send to Bank")}
                </button>
            </div>

            {showOTP && user && typeof user.email === 'string' && (
                <OTPModal
                    userId={user.id}
                    email={user.email}
                    userName={user.name || 'User'}
                    initialAttempts={initialAttempts}
                    onVerified={() => {
                        setShowOTP(false);
                        handleSend();
                    }}
                    onCancel={() => setShowOTP(false)}
                />
            )}
        </div>
    );
}