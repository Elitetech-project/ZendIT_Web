/**
 * Flutterwave API Utility (Standard v3)
 */

const BASE_URL = 'https://api.flutterwave.com/v3';

/**
 * Fetches a list of banks supported by Flutterwave for a specific country.
 * @param country The ISO 3166-1 alpha-2 country code (default: NG)
 */
export async function fetchBanks(country: string = 'NG') {
    try {
        const response = await fetch(`${BASE_URL}/banks/${country}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error(`Failed to fetch banks for ${country}:`, error);
        return [];
    }
}

/**
 * Resolve Account Name 
 */
export async function resolveAccount(accountNumber: string, bankCode: string) {
    try {
        // Validation: Must be 10 digits
        if (!accountNumber || accountNumber.length !== 10) return null;

        const response = await fetch(`${BASE_URL}/accounts/resolve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_number: accountNumber,
                account_bank: bankCode
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            return data.data.account_name;
        }
        return null;
    } catch (error) {
        console.error('Error resolving account:', error);
        return null;
    }
}

/**
 * Initiate a Fiat Transfer (Payout)
 */
export async function initiateTransfer(payload: {
    account_bank: string;
    account_number: string;
    amount: number;
    currency: string;
    reference: string;
    callback_url?: string;
}) {
    try {
        const response = await fetch(`${BASE_URL}/transfers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
                'Content-Type': 'application/json',
                 ...(process.env.FLW_SECRET_KEY?.includes('_T') && {
                    'X-Scenario-Key': 'scenario:successful' // 👈 only added in test mode
                })
            },
            body: JSON.stringify({
                ...payload,
                debit_currency: 'NGN' // Using NGN as the source balance
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Flutterwave Transfer Error:', error);
        throw error;
    }
}
