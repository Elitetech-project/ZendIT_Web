'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'pending' | 'error';
    read: boolean;
}

export function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, title: 'Payment Received', message: 'You received $120.00 from User 2', time: '5m ago', type: 'success', read: false },
        { id: 2, title: 'Transfer Pending', message: 'Your transfer of $150.50 to Jane Smith is pending', time: '1h ago', type: 'pending', read: false },
        { id: 3, title: 'Payment Successful', message: 'Successfully sent $250.00 to John Doe', time: '2h ago', type: 'success', read: true },
        { id: 4, title: 'Transfer Failed', message: 'Transfer to Bob Williams was cancelled', time: '1d ago', type: 'error', read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

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
                                                    className="px-4 py-2 text-md bg-[#e33e38] text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
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

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                            )}
                        </button>

                        {/* Notifications Panel */}
                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        onClick={() => setShowNotifications(false)}
                                        className="fixed inset-0 z-40"
                                    />

                                    {/* Panel */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-12 w-80 bg-background border rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-4 border-b">
                                            <h3 className="font-semibold">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>

                                        {/* Notifications List */}
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">No notifications</p>
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => markAsRead(notification.id)}
                                                        className={`p-4 border-b hover:bg-secondary/50 transition-colors cursor-pointer ${!notification.read ? 'bg-secondary/20' : ''
                                                            }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="flex-shrink-0 mt-1">
                                                                {getNotificationIcon(notification.type)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <p className="font-medium text-sm">{notification.title}</p>
                                                                    {!notification.read && (
                                                                        <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary" />
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {notification.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
