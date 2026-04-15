import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Flutterwave Setup
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!;

// Treasury Detail
const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS!;
const COSTON2_RPC = "https://coston2-api.flare.network/ext/C/rpc";

export async function GET() {
    try {
        // 1. Fetch FLR Balance via RPC
        let flrBalance = "0";
        try {
            const rpcRes = await fetch(COSTON2_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getBalance",
                    params: [TREASURY_ADDRESS, "latest"],
                    id: 1
                })
            });
            const rpcData = await rpcRes.json();
            if (rpcData.result) {
                // Convert hex wei to FLR (18 decimals)
                const wei = BigInt(rpcData.result);
                flrBalance = (Number(wei) / 1e18).toFixed(2);
            }
        } catch (err) {
            console.error("RPC Fetch failed:", err);
        }

        // 2. Fetch Flutterwave Balance
        let flwBalance = 0;
        try {
            const flwRes = await fetch("https://api.flutterwave.com/v3/balances/NGN", {
                headers: { "Authorization": `Bearer ${FLW_SECRET_KEY}` }
            });
            const flwData = await flwRes.json();
            if (flwData.status === "success") {
                flwBalance = flwData.data.available_balance;
            }
        } catch (err) {
            console.error("Flutterwave Fetch failed:", err);
        }

        // 3. Fetch User and Transaction Stats from Supabase
        
        // Active Users
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // Total Volume (All time)
        const { data: allTxs } = await supabase
            .from('transactions')
            .select('amount_fiat, status, amount_flr, created_at, tx_hash, recipient_details');

        const totalVolume = allTxs?.reduce((acc, tx) => acc + (Number(tx.amount_fiat) || 0), 0) || 0;
        const totalTxCount = allTxs?.length || 0;

        // Last 10 Transactions (All time)
        const { data: latestTxs, error: txError } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (txError) {
            console.error("Latest Transactions Fetch Error:", txError);
        }

        // 4. Fetch Flare Price
        let flarePrice = 11.4; // fallback
        try {
            const priceRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/api/price?currency=ngn`);
            const priceData = await priceRes.json();
            if (priceData.price) flarePrice = priceData.price;
        } catch (err) {
            console.error("Price fetch failed in stats:", err);
        }

        return NextResponse.json({
            treasury: {
                flrBalance,
                flwBalance,
                flarePrice
            },
            stats: {
                userCount: userCount || 0,
                totalVolume,
                totalTxCount
            },
            recentTransactions: latestTxs || []
        });

    } catch (error: any) {
        console.error("Admin Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats", details: error.message }, { status: 500 });
    }
}
