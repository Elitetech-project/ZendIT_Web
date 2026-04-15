'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
interface OTPModalProps {
    userId: string;
    email: string;
    userName: string;
    initialAttempts: number;
    onVerified: () => void;
    onCancel: () => void;
}

export default function OTPModal({
    userId,
    email,
    userName,
    initialAttempts,
    onVerified,
    onCancel,
}: OTPModalProps) {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [attempts, setAttempts] = useState(initialAttempts || 2);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    const sendOTP = async () => {
        setLoading(true);
        const toastId = toast.loading('Sending verification code...');
        try {
            const res = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email, userName, fullName: userName }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Verification code sent!', { id: toastId });
                setAttempts(data.attemptsLeft ?? 0);
                setTimeLeft(300); // Reset countdown on new code
            } else {
                toast.error(data.error || 'Failed to send code.', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error while sending code.', { id: toastId });
        }
        setLoading(false);
    };

    const validateOTP = async () => {
        setLoading(true);
        const toastId = toast.loading('Verifying code...');
        try {
            const res = await fetch('/api/otp/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, enteredOtp: otp }),
            });

            if (res.ok) {
                toast.success('Code verified successfully!', { id: toastId });
                onVerified(); // Trigger transfer
            } else {
                const data = await res.json();
                toast.error(data.error || 'Invalid or expired code', { id: toastId });
                setOtp('');
            }
        } catch (error) {
            toast.error('Network error during verification.', { id: toastId });
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 font-satoshi px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e33e38] to-transparent opacity-50" />

                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 flex items-center justify-center mb-6">
                        <Image src="/logos/Zendit_logo.png" alt="Logo" width={50} height={50} />
                    </div>

                    <h2 className="text-2xl font-black mb-2 text-white">Transfer Verification</h2>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-4">
                        To protect your funds, please verify this transaction with the 6-digit code sent to
                        <br /><span className="text-white font-bold">{email}</span>
                    </p>

                    <div className="bg-[#e33e38]/10 text-[#e33e38] px-4 py-2 rounded-full text-xs font-bold mb-8 flex items-center gap-2">
                        {timeLeft > 0 ? (
                            <>Code expires in {mins}:{secs.toString().padStart(2, '0')}</>
                        ) : (
                            <>Code expired!</>
                        )}
                    </div>

                    <div className="w-full space-y-4">
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="000000"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-center text-lg font-black tracking-[0.5em] text-white outline-none focus:border-[#e33e38]/50 transition-colors"
                        />

                        <button
                            onClick={validateOTP}
                            disabled={loading || otp.length < 6}
                            className="w-full flex items-center justify-center gap-2 bg-[#e33e38] hover:bg-[#c73430] text-white h-14 rounded-full font-black text-lg transition-all shadow-[0_0_20px_rgba(227,62,56,0.3)] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>Verify & Send Money <ArrowRight className="h-5 w-5" /></>
                            )}
                        </button>

                        <div className="pt-2">
                            <button
                                onClick={sendOTP}
                                disabled={loading || attempts <= 0 || timeLeft > 270} // Disable if out of attempts or just requested (wait 30s)
                                className="w-full font-bold text-xs text-muted-foreground hover:text-white transition-colors disabled:opacity-50 disabled:hover:text-muted-foreground"
                            >
                                {attempts > 0
                                    ? `Didn't receive it? Resend code (${attempts} left)`
                                    : "No more resends available this hour"}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="mt-6 font-bold text-xs text-zinc-600 hover:text-white transition-colors"
                    >
                        Cancel Transfer
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
