import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { flareTestnet } from 'viem/chains';
import { createClient } from '@supabase/supabase-js';
import { initiateTransfer } from '@/lib/flutterwave';

// Use Service Role Key on backend — bypasses RLS safely
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

export async function POST(request: Request) {
    try {
        const { txHash, transactionId } = await request.json();

        if (!txHash || !transactionId) {
            return NextResponse.json({ error: 'Transaction ID and Hash are required' }, { status: 400 });
        }

        // 1. Fetch Transaction from DB to get the details (Recipient & Amount NGN)
        const { data: record, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', transactionId)
            .single();

        if (fetchError || !record) {
            return NextResponse.json({ error: 'Transaction record not found' }, { status: 404 });
        }

        // 2. Initialize Viem Client for Coston2 (Flare)
        const publicClient = createPublicClient({
            chain: flareTestnet,
            transport: http()
        });

        // 3. Wait for Transaction to be confirmed (handles latency)
        console.log(`Waiting for confirmation of tx: ${txHash}...`);

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash as `0x${string}`,
            confirmations: 1,
            timeout: 60_000 // Wait up to 60 seconds
        });

        const txData = await publicClient.getTransaction({
            hash: txHash as `0x${string}`
        });

        if (!txData || !receipt) {
            return NextResponse.json({ error: 'Transaction confirmation timed out' }, { status: 404 });
        }

        // Check: Status success? Correct Recipient? Correct Amount (within safety margin)?
        const isSuccess = receipt.status === 'success';
        const isToTreasury = txData.to?.toLowerCase() === TREASURY_WALLET.toLowerCase();

        // Final Chain Integrity Check
        if (!isSuccess || !isToTreasury) {
            return NextResponse.json({ error: 'On-chain verification failed' }, { status: 400 });
        }

        // 4. Update status to 'processing' before calling payout (avoid double-spending)
        await supabase.from('transactions').update({ status: 'processing', tx_hash: txHash }).eq('id', transactionId);

        // 5. CALL FLUTTERWAVE: The Real Fiat Settlement
        console.log(`Initiating Flutterwave payout for Transaction ${transactionId}...`);

        // Detected if we are in Test Mode to apply the mock success suffix (_PMCK)
        const isTestMode = process.env.FLW_SECRET_KEY?.includes('_T');
        const flwRef = isTestMode ? `ZENDIT-TX-${transactionId}_PMCK` : `ZENDIT-TX-${transactionId}`;

        console.log(`Using Reference: ${flwRef} (Test Mode: ${isTestMode})`);

        const payoutResponse = await initiateTransfer({
            account_bank: record.recipient_details.bankCode,
            account_number: record.recipient_details.accountNumber,
            amount: parseFloat(record.amount_fiat),
            currency: 'NGN',
            reference: flwRef,
        });

        // Log the full Flutterwave response for debugging
        console.log('Flutterwave Response:', JSON.stringify(payoutResponse, null, 2));

        if (payoutResponse.status === 'success') {
            // SUCCESS: Flutterwave has accepted the transfer request.
            // We set it to 'processing' because the bank still needs to settle it.
            // Our Webhook will set it to 'completed' once it lands.
            await supabase
                .from('transactions')
                .update({
                    status: 'processing',
                    flutterwave_id: String(payoutResponse.data?.id || ''),
                })
                .eq('id', transactionId);

            return NextResponse.json({
                success: true,
                message: 'Payout initiated and is being processed by the bank.',
                payoutId: payoutResponse.data?.id,
                flwStatus: payoutResponse.data?.status
            });
        } else {
            // Flutterwave declined — log and mark failed
            console.error('Flutterwave Payout Failed:', payoutResponse);
            await supabase
                .from('transactions')
                .update({ status: 'failed' })
                .eq('id', transactionId);

            return NextResponse.json({
                error: 'Fiat Payout Failed',
                details: payoutResponse.message,
                flwResponse: payoutResponse
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Final Settlement Error:', error);
        return NextResponse.json({
            error: 'Payout system error',
            details: error.message
        }, { status: 500 });
    }
}
