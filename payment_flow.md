# ZendIT Payment Flow Architecture

## 1. User Onboarding & Username Assignment
Currently, users are created without unique usernames. We need to enforce username assignment during onboarding to enable P2P transfers.

### 1.1 Update Database Schema
- Modify the `profiles` table in Supabase to include a unique `username` column.
- Create an index on `username` for fast lookups during internal transfers.

### 1.2 Automatic Username Generation (Backend)
- Users will not manually input a username during signup.
- During account creation, the backend (e.g., via a Supabase Trigger or Next.js route) will automatically generate a unique `@username` based on their full name or email.
- Example: If a user signs up as "John Doe", the backend generates `@johndoe` or `@johndoe123` if taken.
- The uniquely generated `username` will be saved to the user's `profiles` record along with their `user_id` and `wallet_address`.
---

## 2. Live Price Feed (Oracle)
No mock data. The application needs real-time price feeds for FLR to USD/NGN/etc.

### 2.1 API Integration
- Integrate CoinGecko API (Free Tier) or a similar free price API to fetch live FLR prices.
- Create Next.js API Route: `GET /api/price?currency=USD` 
- Caching: Implement short-lived caching (e.g., 60 seconds) in the API route to prevent hitting external API rate limits and to ensure fast responses.

### 2.2 Frontend Usage
- Replace the hardcoded price logic in `lib/oracle.ts` to call our new `/api/price` route.
- The UI will dynamically update exchange rates based on this real data.

---

## 3. The Remittance Flow (Crypto to Fiat)
This flow uses the Treasury Pool Model on Flare Coston2, settling fiat via **Flutterwave Testnet**.

### Phase 1: Initiation & Quote Calculation
1. **User Action:** User inputs recipient bank details and the desired fiat amount (e.g., 50,000 NGN) on the `SendView` UI.
2. **Quote Generation:** 
   - Frontend calls `/api/price` to get the live NGN to FLR exchange rate.
   - Frontend calculates the required FLR to cover the 50,000 NGN + Service Fees + Network Gas.
3. **Intent Creation:** 
   - Frontend calls `POST /api/transactions` to create a `pending` transaction in Supabase. This includes: User ID, Recipient Bank Details, Fiat Amount, Expected FLR Amount.
   - Returns a `transaction_id`.

### Phase 2: On-Chain Transfer (Coston2)
1. **Approval:** The UI prompts the user to sign a transaction sending the exact `Expected FLR Amount` from their Web3Auth wallet to the **ZendIT Treasury Wallet Address** on Coston2.
2. **Execution:** The user confirms, and the transaction is broadcasted to the Coston2 network.
3. **Hash Registration:** Frontend receives the `transaction_hash` and calls `PATCH /api/transactions/[id]` to securely attach the hash to the pending transaction in Supabase.

### Phase 3: On-Chain Verification (Next.js Backend)
*We do not trust the frontend alone to confirm payment. The backend must independently verify the transfer.*
1. **Verification Request:** The frontend immediately hits `POST /api/verify-tx` after broadcasting.
2. **Validation:** The Next.js API uses `viem` to query the Coston2 RPC:
   - Does `transaction_hash` exist?
   - Is it confirmed (mined)?
   - Is the `to` address strictly equal to `TREASURY_WALLET_ADDRESS`?
   - Is the `value` strictly equal to `Expected FLR Amount`?
3. **State Update:** If validation passes, update Supabase transaction status to `processing`. If failed, mark as `failed`.

### Phase 4: Fiat Settlement (Flutterwave Testnet)
1. **API Call:** Immediately after verification, the Next.js API securely calls the **Flutterwave Testnet Transfer API** (`https://api.flutterwave.com/v3/transfers`).
   - The payload includes: `account_bank`, `account_number`, `amount`, `currency`, and `reference` (we use our internal `transaction_id`).
2. **Awaiting Settlement:** Flutterwave accepts the request and returns a `transfer_id`. The status in Supabase remains `processing`.
3. **Webhook Listener:** We expose a secure endpoint `POST /api/webhooks/flutterwave`.
   - Flutterwave sends real-time events when the bank transfer ultimately becomes `SUCCESSFUL` or `FAILED`.
   - The webhook securely verifies the Flutterwave secret, parses the event, and updates the Supabase status to `completed` or `failed`.

---

## 4. Internal Transfers (P2P via Username)
For sending crypto instantly and cheaply between ZendIT users.

1. **Resolution:** User enters `@username` in the `SendView`.
2. **Query:** Frontend calls `GET /api/resolve-username?username=...`
3. **Lookup:** Backend queries the `profiles` table and returns the destination `wallet_address`.
4. **Transfer:** The frontend initiates a standard native token (FLR) transfer directly from the Sender's wallet to the Receiver's wallet on Coston2 via Web3Auth.
5. **Recording:** After confirmation, the frontend logs the `transaction_hash` in Supabase as an `internal_transfer` for history keeping.

---

## 5. Security & Infrastructure Requirements
- **Environment Variables Needed:**
  - `NEXT_PUBLIC_TREASURY_WALLET_ADDRESS` (Safe to be public, used by frontend to route funds)
  - `FLUTTERWAVE_SECRET_KEY` (Testnet, strictly backend only)
  - `FLUTTERWAVE_WEBHOOK_SECRET` (Strictly backend only)
  - `COINGECKO_API_KEY` (Backend only, if using a paid/pro tier)
- **RPC Providers:** Public Coston2 RPC node (`https://coston2-api.flare.network/ext/C/rpc`).
- **Supabase RLS:** Row-Level Security policies must enforce that users can only read/update their own transactions, and only the secure Next.js service role can mutate statuses to `completed`.
