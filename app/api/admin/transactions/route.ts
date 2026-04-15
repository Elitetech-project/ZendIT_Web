import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        let query = supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Simple client-side search simulation for now if requested
        let filteredData = data;
        if (search) {
            const s = search.toLowerCase();
            filteredData = data.filter(tx => 
                tx.tx_hash?.toLowerCase().includes(s) || 
                tx.id?.toLowerCase().includes(s) ||
                (tx.recipient_details as any)?.accountNumber?.includes(s)
            );
        }

        return NextResponse.json({ transactions: filteredData });

    } catch (error: any) {
        console.error("Admin Transactions API Error:", error);
        return NextResponse.json({ error: "Failed to fetch transactions", details: error.message }, { status: 500 });
    }
}
