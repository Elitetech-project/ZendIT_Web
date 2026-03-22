import { NextResponse } from 'next/server';
import { resolveAccount } from '@/lib/flutterwave';

/**
 * Automagically resolve account number into a human name
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { accountNumber, bankCode } = body;

        if (!accountNumber || !bankCode) {
            return NextResponse.json({ error: 'Missing account information' }, { status: 400 });
        }

        const accountName = await resolveAccount(accountNumber, bankCode);

        if (!accountName) {
            return NextResponse.json({ error: 'Could not resolve account name' }, { status: 404 });
        }

        return NextResponse.json({ accountName });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
