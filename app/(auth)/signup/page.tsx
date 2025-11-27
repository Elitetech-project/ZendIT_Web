'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Create an account</h1>
                    <p className="mt-2 text-muted-foreground">Enter your email below to create your account</p>
                </div>

                <div className="space-y-4">
                    <button className="flex w-full items-center justify-center gap-3 rounded-xl border bg-card p-4 font-medium transition-colors hover:bg-secondary">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                        Sign up with Google
                    </button>
                    <button className="flex w-full items-center justify-center gap-3 rounded-xl border bg-card p-4 font-medium transition-colors hover:bg-secondary">
                        <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="h-5 w-5 dark:invert" />
                        Sign up with Apple
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                className="flex h-10 w-full rounded-xl border bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="email"
                                placeholder="m@example.com"
                                type="email"
                            />
                        </div>
                    </div>
                    <button className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
