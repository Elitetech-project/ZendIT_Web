import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client to update transaction states bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Flutterwave Webhook Listener
 * Updates transaction status based on final settlement events.
 */
export async function POST(request: Request) {
    try {
        // 1. Verify Secret Hash (Proves it actually came from Flutterwave)
        const signature = request.headers.get('verif-hash');
        const secretHash = process.env.FLW_SECRET_HASH;

        // Note: For live, you MUST set FLW_SECRET_HASH in .env.local and Flutterwave dashboard
        if (!signature || signature !== secretHash) {
            console.warn('Unauthorized Webhook attempt blocked - Signature mismatch.');
            return new Response('Unauthorized', { status: 401 });
        }

        const payload = await request.json();
        const event = payload.event;
        const flwId = payload.data?.id;
        const flwStatus = payload.data?.status;

        console.log(`--- [WEBHOOK] Received ${event} for ID ${flwId} ---`);

        // 2. Handle Final Transfer Settlement
        if (event === 'transfer.completed') {
            // Map Flutterwave status to our local status
            // Flutterwave uses 'SUCCESSFUL' or 'FAILED'
            const mappedStatus = flwStatus === 'SUCCESSFUL' ? 'completed' : 'failed';

            const { error } = await supabase
                .from('transactions')
                .update({
                    status: mappedStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('flutterwave_id', String(flwId));

            if (error) {
                console.error('Database update failed during webhook:', error);
                throw error;
            }

            console.log(`✅ Webhook Success: Transaction ${flwId} updated to ${mappedStatus}`);
            return NextResponse.json({ success: true, message: 'Status synced' });
        }

        return NextResponse.json({ message: 'Event ignored' });

    } catch (error: any) {
        console.error('Webhook processing failed:', error.message);
        return NextResponse.json({ error: 'Internal logic error' }, { status: 500 });
    }
}
