'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { web3auth, initWeb3Auth, connectSupabaseToWeb3Auth } from '@/lib/web3auth';
import { createPublicClient, http, formatEther } from 'viem';
import { flareTestnet } from 'viem/chains';
import toast from 'react-hot-toast';

export function useWeb3Auth() {
    const [user, setUser] = useState<any>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>("0.00");
    const [isLoading, setIsLoading] = useState(true);

    const publicClient = createPublicClient({
        chain: flareTestnet,
        transport: http("https://coston2-api.flare.network/ext/C/rpc"),
    });

    const fetchBalance = async (walletAddress: string) => {
        try {
            const bal = await publicClient.getBalance({ address: walletAddress as `0x${string}` });
            setBalance(parseFloat(formatEther(bal)).toFixed(2));
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUser(session.user);

                // Initialize Web3Auth and connect if we have a session
                await initWeb3Auth();

                let provider = web3auth.provider;
                if (!provider) {
                    provider = await connectSupabaseToWeb3Auth(session.access_token);
                }

                if (provider) {
                    // Get address from Web3Auth provider
                    const accounts = await provider.request({ method: "eth_accounts" }) as string[];
                    if (accounts && accounts.length > 0) {
                        setAddress(accounts[0]);
                        await fetchBalance(accounts[0]);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading Web3Auth user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                loadUserData();
            } else {
                setUser(null);
                setAddress(null);
                setBalance("0.00");
                // Explicitly logout from Web3Auth when Supabase session is gone
                try {
                    if (web3auth.status === "connected") {
                        await web3auth.logout();
                    }
                } catch (e) {
                    console.error("Web3Auth logout failed:", e);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success("Address copied to clipboard!");
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            await supabase.auth.signOut();
            toast.success("Successfully signed out");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to sign out");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        address,
        balance,
        isLoading,
        copyAddress,
        signOut,
        refreshBalance: () => address && fetchBalance(address),
    };
}
