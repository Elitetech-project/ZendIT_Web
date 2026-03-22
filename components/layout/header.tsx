'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Clock, XCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeBtn from '../ui/ThemeBtn';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string | number;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'pending' | 'error';
    read: boolean;
}

export function Header() {
    const { user, address, copyAddress } = useWeb3Auth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchRealNotifications = async () => {
        if (!user?.id) return;

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(10);

        if (data) {
            const mapped: Notification[] = data.map(tx => ({
                id: tx.id,
                title: tx.status === 'completed' ? 'Payout Successful' :
                    tx.status === 'failed' ? 'Payout Failed' : 'Transfer Processing',
                message: tx.status === 'completed'
                    ? `₦${parseFloat(tx.amount_fiat).toLocaleString()} successfully sent to ${tx.recipient_details?.accountName}`
                    : `Your transfer of ₦${parseFloat(tx.amount_fiat).toLocaleString()} is being settled.`,
                time: formatDistanceToNow(new Date(tx.updated_at), { addSuffix: true }),
                type: tx.status === 'completed' ? 'success' :
                    tx.status === 'failed' ? 'error' : 'pending',
                read: tx.status === 'completed' // Consider settled ones as "read" for now or add a read column
            }));
            setNotifications(mapped);
        }
    };

    useEffect(() => {
        if (!user?.id) return;

        fetchRealNotifications();

        // REAL-TIME: Listen for any changes in the user's transactions
        const channel = supabase
            .channel(`user-notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transactions',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchRealNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id: string | number) => {
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
        <header className="sticky top-0 z-50 w-full border-b  backdrop-blur py-2 font-satoshi ">
            <div className="flex py-3 items-center mx-auto justify-between md:justify-end px-6">
                <Link href="/" className="flex items-center gap-2 md:hidden">
                    <Image src="/logos/Zendit_logo.png" alt="Logo" width={100} height={100} className='w-10 h-auto md:w-28 h-full' />
                </Link>

                <div className="flex items-center gap-4">
                    {/* Welcome message and Wallet Address display */}
                    <div className="flex flex-col items-end gap-0.5">

                        {address ? (
                            <button
                                onClick={copyAddress}
                                title="Click to copy address"
                                className="text-[10px] md:text-xs font-mono bg-muted py-1 px-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all uppercase tracking-wider text-muted-foreground border border-transparent hover:border-primary/20"
                            >
                                {`${address.slice(0, 6)}...${address.slice(-4)}`}
                            </button>
                        ) : (
                            <div className="h-4 w-24 animate-pulse bg-muted rounded-md" />
                        )}
                    </div>

                    <ThemeBtn />

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="cursor-pointer relative p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <Bell className="h-5 w-5 dark:text-white" />
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
                                        <div className="max-h-96 overflow-y-auto notification-scrollbar">
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
                                                                        <span className="flex-shrink-0 h-2 w-2 rounded-full bg-red-700 " />
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
