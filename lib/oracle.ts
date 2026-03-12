/**
 * ZendIT Oracle Utility
 * Centrally manages price feeds from Flare Time Series Oracle (FTSO).
 */

export const getFLRPrice = async () => {
    // In production, this would call the FTSO smart contract on Flare Network.
    // For now, we return a simulated price based on Coston2 market data.
    return 0.0245;
};

export const calculateQuote = async (fiatAmount: number, currency: string = "USD") => {
    const price = await getFLRPrice();
    const serviceFeePercent = 0.01; // 1% fee
    const networkFee = 0.5; // 0.5 FLR fixed

    // Convert fiat to FLR (simplified for demonstration)
    // If USD: flrNeeded = fiatAmount / price
    const flrEquivalent = fiatAmount / price;
    const fee = flrEquivalent * serviceFeePercent + networkFee;

    return {
        price,
        flrAmount: parseFloat((flrEquivalent + fee).toFixed(4)),
        fee: parseFloat(fee.toFixed(4)),
        expiry: Date.now() + 60000, // Quote valid for 60 seconds
    };
};
