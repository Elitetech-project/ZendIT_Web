import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use Service Role Key on backend — bypasses RLS safely (never expose to frontend)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Phase 1.3: Intent Creation (Record in Supabase)
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, amountFlr, amountFiat, currency, recipientDetails } = body;

        if (!userId || !amountFlr) {
            return NextResponse.json({ error: 'Missing required transaction details' }, { status: 400 });
        }

        // Create the initial "pending" record
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                type: 'external_remittance',
                status: 'pending',
                amount_flr: amountFlr,
                amount_fiat: amountFiat,
                fiat_currency: currency || 'NGN',
                recipient_details: recipientDetails,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', JSON.stringify(error, null, 2));
            return NextResponse.json({
                error: 'Database insert failed',
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            transactionId: data.id
        });

    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}

/**
 * Phase 2.3: Hash Registration (Attach on-chain tx hash)
 */
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, txHash } = body;

        if (!transactionId || !txHash) {
            return NextResponse.json({ error: 'Missing transactionId or txHash' }, { status: 400 });
        }

        // Securely attach hash to the pending transaction
        const { data, error } = await supabase
            .from('transactions')
            .update({
                tx_hash: txHash,
            })
            .eq('id', transactionId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: 'Transaction hash registered successfully'
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
