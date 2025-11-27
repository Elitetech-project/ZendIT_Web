'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, User, Globe } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const { isConnected } = useAccount();
    const router = useRouter();

    const handleContinue = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2 && isConnected) {
            router.push('/');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {step === 1 ? 'Tell us about yourself' : 'Connect your wallet'}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {step === 1
                            ? 'We need a few details to set up your account'
                            : 'Connect your wallet to start sending and receiving'}
                    </p>
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        className="flex h-10 w-full rounded-xl border bg-background px-3 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <select className="flex h-10 w-full rounded-xl border bg-background px-3 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                                        <option value="">Select your country</option>
                                        <option value="US">United States</option>
                                        <option value="NG">Nigeria</option>
                                        <option value="UK">United Kingdom</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 py-8">
                            <div className="rounded-full bg-secondary p-6">
                                <Wallet className="h-12 w-12 text-primary" />
                            </div>
                            <ConnectButton />
                            <p className="text-center text-sm text-muted-foreground">
                                By connecting, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleContinue}
                        disabled={step === 2 && !isConnected}
                        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {step === 1 ? 'Continue' : 'Get Started'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </motion.div>

                <div className="flex justify-center gap-2">
                    <div className={`h-2 w-2 rounded-full transition-colors ${step === 1 ? 'bg-primary' : 'bg-secondary'}`} />
                    <div className={`h-2 w-2 rounded-full transition-colors ${step === 2 ? 'bg-primary' : 'bg-secondary'}`} />
                </div>
            </div>
        </div>
    );
}
