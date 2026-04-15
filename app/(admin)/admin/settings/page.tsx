'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Percent, ShieldCheck, Mail, Save, AlertTriangle, ShieldX, DollarSign, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        fee_percentage: 1.0,
        min_transfer_amount: 100,
        max_transfer_amount: 1000000,
        maintenance_mode: false,
        support_email: 'support@zendit.online'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success("Platform settings updated!");
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#e33e38]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto p-4 md:p-8 font-satoshi">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Platform <span className="text-[#e33e38]">Governance</span>
                </h1>
                <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] font-black">
                    Global Parameters & Control Center
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fee Configuration */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-[#e33e38]/10 flex items-center justify-center text-[#e33e38]">
                            <Percent className="size-5" />
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 dark:text-white">Fee Logic</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Platform Fee (%)</label>
                            <input 
                                type="number" 
                                value={settings.fee_percentage}
                                onChange={(e) => setSettings({...settings, fee_percentage: parseFloat(e.target.value)})}
                                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-[#e33e38]/30 transition-all font-mono"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed italic">
                            Applied to across all external remittances from the treasury.
                        </p>
                    </div>
                </div>

                {/* Transfer Limits */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <ShieldCheck className="size-5" />
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 dark:text-white">Guardrails</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Min (NGN)</label>
                            <input 
                                type="number" 
                                value={settings.min_transfer_amount}
                                onChange={(e) => setSettings({...settings, min_transfer_amount: parseFloat(e.target.value)})}
                                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none font-mono"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Max (NGN)</label>
                            <input 
                                type="number" 
                                value={settings.max_transfer_amount}
                                onChange={(e) => setSettings({...settings, max_transfer_amount: parseFloat(e.target.value)})}
                                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none font-mono"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Support & Security */}
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                                <Mail className="size-5" />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 dark:text-white">Communications</h3>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Support Endpoint</label>
                            <input 
                                type="email" 
                                value={settings.support_email}
                                onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <AlertTriangle className="size-5" />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 dark:text-white">Safety Switch</h3>
                        </div>
                        <button 
                            onClick={() => setSettings({...settings, maintenance_mode: !settings.maintenance_mode})}
                            className={clsx(
                                "flex items-center justify-between px-6 py-3 rounded-2xl font-bold text-sm transition-all",
                                settings.maintenance_mode ? "bg-amber-500 text-white" : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500"
                            )}
                        >
                            <span>Maintenance Mode</span>
                            <div className={clsx(
                                "size-4 rounded-full border-2",
                                settings.maintenance_mode ? "bg-white border-transparent" : "border-zinc-300 dark:border-zinc-700"
                            )} />
                        </button>
                        <p className="text-[10px] text-zinc-400 font-medium italic">
                            Disables all live transactions except for administrators.
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="group bg-[#e33e38] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-[#e33e38]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4 group-hover:rotate-12 transition-transform" />}
                    Save Parameters
                </button>
            </div>
        </div>
    );
}
