import { NextResponse } from 'next/server';

/**
 * Banks API
 * Safely fetches the list of banks from Flutterwave on the server-side
 * to avoid CORS errors and protect the Secret Key.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'NG';

    try {
        const response = await fetch(`https://api.flutterwave.com/v3/banks/${country}`, {
            headers: {
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ banks: data.data || [] });
    } catch (error) {
        console.error('Bank fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
    }
}
