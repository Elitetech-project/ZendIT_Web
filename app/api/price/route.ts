import { NextResponse } from 'next/server';

/**
 * Live Price API - Always fetches real-time data from CoinGecko
 * Uses canonical ID 'flare-networks' as verified by documentation.
 */

// Simple cache to avoid rate limits
let cachedPrice: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1 * 1000; // 1 second cache

const currencySymbols: Record<string, string> = {
    usd: '$',
    ngn: '₦',
    gbp: '£',
    eur: '€',
    ghs: '₵'
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const queryCurrency = searchParams.get('currency')?.toLowerCase();
    const currentTime = Date.now();

    // 1. Determine target currency
    let targetCurrency = queryCurrency || 'ngn';

    // 2. Try cache first
    if (cachedPrice && currentTime - lastFetchTime < CACHE_DURATION) {
        return NextResponse.json({
            price: cachedPrice[targetCurrency] || cachedPrice['usd'],
            currency: targetCurrency.toUpperCase(),
            symbol: currencySymbols[targetCurrency] || '$',
            source: 'cache'
        });
    }

    try {
        // 3. Fetch Fresh Data from CoinGecko using 'flare-networks'
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=flare-networks&vs_currencies=usd,ngn,gbp,eur,ghs',
            { next: { revalidate: 1 } }
        );

        if (!response.ok) throw new Error('CoinGecko Error');

        const data = await response.json();
        const prices = data['flare-networks'];

        if (!prices || !prices[targetCurrency]) {
            throw new Error(`Price not found for ${targetCurrency}`);
        }

        cachedPrice = prices;
        lastFetchTime = currentTime;

        return NextResponse.json({
            price: prices[targetCurrency],
            currency: targetCurrency.toUpperCase(),
            symbol: currencySymbols[targetCurrency] || '$',
            source: 'live'
        });

    } catch (error) {
        console.error('Price fetch failed:', error);

        // Final Hard Fallback if API fails
        const fallbacks: Record<string, number> = {
            usd: 0.0084,
            ngn: 11.4
        };

        return NextResponse.json({
            //  price: fallbacks[targetCurrency] || 0.0084,
            currency: targetCurrency.toUpperCase(),
            symbol: currencySymbols[targetCurrency] || '$',
            source: 'fallback'
        });
    }
}