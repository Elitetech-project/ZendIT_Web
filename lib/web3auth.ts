import { Web3Auth } from "@web3auth/single-factor-auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x72", // Flare testnet hex (114)
    rpcTarget: "https://coston2-api.flare.network/ext/C/rpc",
    displayName: "Coston2 Testnet",
    ticker: "C2FLR",
    tickerName: "Coston2 Flare",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

export const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: "sapphire_devnet",
    privateKeyProvider,
});

export const initWeb3Auth = async () => {
    if (web3auth.status === "not_ready") {
        await web3auth.init();
    }
};

export const connectSupabaseToWeb3Auth = async (supabaseAppToken: string) => {
    try {
        if (web3auth.status === "not_ready") {
            await web3auth.init();
        }

        // Decode token to get 'sub' safely (handling base64url)
        const base64 = supabaseAppToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const sub = payload.sub;

        // Check if already connected
        if (web3auth.status === "connected") {
            try {
                const info = await web3auth.getUserInfo();
                if (info.verifierId === sub) {
                    console.log("SFA already connected to correct account");
                    return web3auth.provider;
                }
                console.warn("SFA account mismatch. Switching...");
                await web3auth.logout();
            } catch (e) {
                console.error("SFA verification failed", e);
                await web3auth.logout();
            }
        }

        // Invisible connection using Single Factor Auth (SFA)
        // No popup or modal will appear now
        const web3authProvider = await web3auth.connect({
            verifier: "zendit-auth",
            verifierId: sub,
            idToken: supabaseAppToken,
        });

        return web3authProvider;
    } catch (error) {
        console.error("Single Factor Auth Connection Failed", error);
        throw error;
    }
};
