'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex py-3 items-center mx-auto justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                   <Image src="/logo.png" alt="Logo" width={100} height={100} className='w-28 h-full' />
                </Link>

                <div className="flex items-center gap-4">
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            const ready = mounted && authenticationStatus !== 'loading';
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus ||
                                    authenticationStatus === 'authenticated');

                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        'style': {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <button
                                                    onClick={openConnectModal}
                                                    type="button"
                                                    className="px-4 py-2 bg-[#e33e38] text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                                                >
                                                    Connect Wallet
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                onClick={openAccountModal}
                                                type="button"
                                                className="px-4 py-2 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                                            >
                                                {account.displayName
                                                    ? account.displayName
                                                    : `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                                            </button>
                                        );
                                    })()}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                    <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                    </button>
                </div>
            </div>
        </header>
    );
}
