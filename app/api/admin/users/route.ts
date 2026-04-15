import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
    try {
        // Fetch profiles with a count of their transactions and sum of fiat volume
        // Note: Supabase doesn't easily sum in a single nested select without a view, 
        // but it can count. We'll fetch and then do the math if needed, or just show count for now.
        // Fetch all profiles
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profileError) throw profileError;

        // Fetch all transactions to compute stats 
        // (In a huge app we'd do this via a SQL view, but for now this is safest)
        const { data: allTxs, error: txError } = await supabase
            .from('transactions')
            .select('user_id, amount_fiat, status');

        if (txError) throw txError;

        // Process users to add stats
        const usersWithStats = (profiles || []).map(user => {
            const userTxs = (allTxs || []).filter(t => t.user_id === user.id);
            const completedTxs = userTxs.filter(t => t.status === 'completed');
            const totalVolume = completedTxs.reduce((acc, t) => acc + (Number(t.amount_fiat) || 0), 0);
            
            return {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                avatar_url: user.avatar_url,
                created_at: user.created_at,
                txCount: userTxs.length,
                totalVolume: totalVolume
            };
        });

        return NextResponse.json({ users: usersWithStats });

    } catch (error: any) {
        console.error("Admin Users API Error:", error);
        return NextResponse.json({ error: "Failed to fetch users", details: error.message }, { status: 500 });
    }
}
