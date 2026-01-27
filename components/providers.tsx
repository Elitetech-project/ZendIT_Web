'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
    flare,
    flareTestnet,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ThemeProvider } from 'next-themes';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
    appName: 'ZendIT',
    projectId: 'YOUR_PROJECT_ID', // TODO: Replace with actual Project ID from WalletConnect
    wallets: [
        ...wallets,
        {
            groupName: 'Other',
            wallets: [argentWallet, trustWallet, ledgerWallet],
        },
    ],
    chains: [flare, flareTestnet],
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider
                        theme={darkTheme({
                            accentColor: '#7b3fe4',
                            accentColorForeground: 'white',
                            borderRadius: 'medium',
                            fontStack: 'system',
                            overlayBlur: 'small',
                        })}
                    >
                        {children}
                        {/* Dark mode gradient background */}
                        <div className="fixed inset-0 -z-50 pointer-events-none hidden dark:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-950/40 via-black to-red-950/40" />
                            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-700/20 rounded-full blur-[150px]" />
                            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-700/20 rounded-full blur-[150px]" />
                        </div>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
    );
}
