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
        const signature = request.headers.get('verif-hash') || request.headers.get('Verif-Hash');
        const secretHash = process.env.FLW_SECRET_HASH;

        if (!signature || signature !== secretHash) {
            console.warn('--- [FLW WEBHOOK] Unauthorized ---', { received: signature, expected: secretHash ? 'HAS_COORD' : 'MISSING_ENV' });
            return new Response('Unauthorized', { status: 401 });
        }

        const payload = await request.json();
        console.log('--- [FLW WEBHOOK] Payload ---', JSON.stringify(payload, null, 2));

        const { event, data } = payload;

        // 2. Handle Transfer Completion
        if (event === 'transfer.completed') {
            const flutterwaveId = data.id.toString();
            const txRef = data.tx_ref; // Expected: ZENDIT-TX-[transactionId]
            const flwStatus = data.status; // SUCCESSFUL or FAILED

            console.log(`--- [FLW WEBHOOK] Processing Ref: ${txRef} (FLW ID: ${flutterwaveId}) with status ${flwStatus} ---`);

            const finalStatus = flwStatus === 'SUCCESSFUL' ? 'completed' : 'failed';

            // Extract our UUID from the tx_ref (ZENDIT-TX-uuid)
            const transactionId = txRef?.replace('ZENDIT-TX-', '');

            // 3. Update Supabase (Matching by either FLW ID OR our internal ID)
            // Use an OR filter to be 100% safe
            const { data: updateData, error: updateError } = await supabase
                .from('transactions')
                .update({
                    status: finalStatus,
                    updated_at: new Date().toISOString()
                })
                .or(`flutterwave_id.eq.${flutterwaveId},id.eq.${transactionId}`);

            if (updateError) {
                console.error('--- [FLW WEBHOOK] DB Update Error ---', updateError);
                return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
            }

            console.log('--- [FLW WEBHOOK] Success: Status synced to DB ---', updateData);
            return NextResponse.json({ success: true, message: 'Status synced' });
        }

        return NextResponse.json({ success: true, message: 'Event ignored' });
    } catch (error: any) {
        console.error('--- [FLW WEBHOOK] Fatal Error ---', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
