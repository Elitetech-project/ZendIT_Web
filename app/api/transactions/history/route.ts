import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client to safely fetch history
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API to fetch user's transaction history from Supabase.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Fetch user records ordered by newest first
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database query failed for history:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            transactions: data
        });

    } catch (error: any) {
        console.error('History Fetch Error:', error.message);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
