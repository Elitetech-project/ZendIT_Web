import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, fullName, amountFiat, amountFlr, recipientName, bankName, accountNumber, txHash } = await req.json();

        const { error: resendError } = await resend.emails.send({
            from: 'ZendIT <noreply@zendit.online>',
            to: email,
            subject: 'Transfer Successful - ZendIT Receipt',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #e33e38; margin: 0; font-size: 28px; letter-spacing: -0.5px;">ZendIT</h2>
                        <p style="color: #666; font-size: 14px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Transaction Receipt</p>
                    </div>
                    
                    <div style="background: #fbfbfb; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
                        <h3 style="margin-top: 0; color: #111; text-align: center; font-size: 20px;">Payout Successful 🎉</h3>
                        <p style="color: #555; line-height: 1.6;">Hi <strong>${fullName}</strong>,</p>
                        <p style="color: #555; line-height: 1.6;">Your transaction was verified and settled on the Flare blockchain successfully. The fiat payout is on its way to the recipient's bank account.</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Flare Sent</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #111; font-size: 14px;">${amountFlr} FLR</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Naira Payout</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 900; color: #e33e38; font-size: 16px;">₦${amountFiat}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Recipient</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #111; font-size: 14px;">${recipientName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Bank</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #111; font-size: 14px;">${bankName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Account Number</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #111; font-size: 14px;">${accountNumber}</td>
                        </tr>
                    </table>

                    <div style="text-align: center; font-size: 11px; color: #999; line-height: 1.5;">
                        <p style="font-family: monospace; background: #f5f5f5; padding: 8px; border-radius: 4px; word-break: break-all;">Tx Hash: ${txHash}</p>
                        <p style="margin-top: 15px;">© ${new Date().getFullYear()} ZendIT Finance. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        if (resendError) {
            console.error("Resend API Error (Receipt):", resendError);
            return NextResponse.json({ error: resendError.message }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Receipt send error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
