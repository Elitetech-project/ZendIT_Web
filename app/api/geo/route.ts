import { NextResponse } from 'next/server';

/**
 * Vercel Geolocation API - The "Brain" 🛰️
 * Detects where the user is to set smart currency/bank defaults.
 */
export async function GET(request: Request) {
    // Vercel Edge headers (fallback to NG for local dev)
    const country = request.headers.get('x-vercel-ip-country') || 'NG';
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';

    // Map countries to their Flutterwave codes
    const config: Record<string, { currency: string }> = {
        'NG': { currency: 'NGN' },
        'GH': { currency: 'GHS' },
        'KE': { currency: 'KES' },
        'UG': { currency: 'UGX' },
        'ZA': { currency: 'ZAR' }
    };

    const locationData = config[country] || config['NG'];

    return NextResponse.json({
        country,
        city,
        currency: locationData.currency
    });
}
