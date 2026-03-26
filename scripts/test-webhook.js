const https = require('https');

/**
 * ZENDIT Manual Webhook Sync 🛠️
 * 
 * Instructions:
 * 1. Put the Flutterwave ID (e.g. 2121829) in 'id'
 * 2. Put the ZENDIT-TX (e.g. ZENDIT-TX-8749456d) in 'tx_ref'
 * 3. Run: node scripts/test-webhook.js
 */

const payload = {
    event: "transfer.completed",
    data: {
        id: process.argv[2] || 2121829, // Takes ID from terminal if you want
        tx_ref: "ZENDIT-TX-8749456d-8f2a-4394-a16f-1f061e8996e3", // <--- UPDATE THIS
        status: "SUCCESSFUL",
        amount: 100,
        currency: "NGN",
        fee: 10.75
    }
};

const options = {
    hostname: 'zend-it-web.vercel.app', // <--- YOUR LIVE URL
    port: 443,
    path: '/api/webhooks/flutterwave',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'verif-hash': 'zendit_secure_webhook_123456' // Must match .env.local
    }
};

console.log(`📡 Sending Sync Signal to ${options.hostname}...`);

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`🏁 Sync Status: ${res.statusCode}`);
        console.log(`💬 Message From Site: ${data}`);
    });
});

req.on('error', (error) => { console.error('❌ Sync Failed:', error); });
req.write(JSON.stringify(payload));
req.end();
