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
                const wei = BigInt(rpcData.result);
                flrBalance = (Number(wei) / 1e18).toFixed(2);
            }
        } catch (err) {
            console.error("Treasury RPC Fetch failed:", err);
        }

        // 2. Fetch Flutterwave Balance
        let flwBalance = 0;
        try {
            const flwRes = await fetch("https://api.flutterwave.com/v3/balances/NGN", {
                headers: { "Authorization": `Bearer ${FLW_SECRET_KEY}` }
            });
            const flwData = await flwRes.json();
            if (flwData.status === "success" && flwData.data) {
                flwBalance = flwData.data.available_balance;
            }
        } catch (err) {
            console.error("Treasury Flutterwave Fetch failed:", err);
        }

        // 3. Fetch Aggregate Stats
        const { data: txs } = await supabase
            .from('transactions')
            .select('amount_fiat, status, amount_flr');

        const totalFees = txs?.filter(t => t.status === 'completed')
            .reduce((acc, t) => acc + (Number(t.amount_fiat) * 0.01), 0) || 0; // Assuming 1% fee

        // 4. Fetch Settlement History
        const { data: history } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        return NextResponse.json({
            address: TREASURY_ADDRESS,
            balances: {
                flr: flrBalance,
                fiat: flwBalance,
                currency: 'NGN'
            },
            stats: {
                estimatedFees: totalFees,
                totalSettled: txs?.filter(t => t.status === 'completed').length || 0
            },
            history: history || []
        });

    } catch (error: any) {
        console.error("Admin Treasury API Error:", error);
        return NextResponse.json({ error: "Failed to fetch treasury data" }, { status: 500 });
    }
}
