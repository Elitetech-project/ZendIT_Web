/**
 * ZendIT Oracle Utility
 * Fetches real-time price feeds for the Flare network.
 */

/**
 * Fetch Live Price from local API (which proxy to CoinGecko)
 */
export const getFLRPrice = async (currency: string = "ngn") => {
    try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const response = await fetch(`${baseUrl}/api/price?currency=${currency}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch price');
        const data = await response.json();

        if (!data.price || isNaN(data.price)) throw new Error('Invalid price data from API');

        return { price: data.price, symbol: data.symbol || '₦' };
    } catch (error) {
        console.error("Price fetch error:", error);
        return { price: 11.4, symbol: '₦' }; // Safety fallback
    }
};

/**
 * Calculate the exchange quote based on live market prices.
 */
export const calculateQuote = async (fiatAmount: number, currency: string = "NGN") => {
    // 1. Fetch live market price for 1 FLR in the target currency (e.g. NGN)
    const res = await getFLRPrice(currency.toLowerCase());
    const price = res.price;
    const symbol = res.symbol;

    // 2. We use a 1:1 conversion rate as requested (0% fees added here)
    const serviceFeePercent = 0;

    // 3. Do the math: Fiat / Live Price = FLR Amount
    const flrEquivalent = fiatAmount / price;
    const fee = (flrEquivalent * serviceFeePercent);

    return {
        price: parseFloat(price.toFixed(2)),
        symbol: symbol,
        flrAmount: parseFloat((flrEquivalent + fee).toFixed(2)), // Set to 2 decimal places
        fee: parseFloat(fee.toFixed(2)),
        expiry: Date.now() + 60000,
    };
};
