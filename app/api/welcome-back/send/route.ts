import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, fullName } = await req.json();

        const { error: resendError } = await resend.emails.send({
            from: 'ZendIT <noreply@zendit.online>',
            to: email,
            subject: 'New Login Detected! 🔒',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://zend-it-web.vercel.app/logos/Zendit_logo.png" alt="ZendIT" width="60" height="60" style="border-radius: 50%;" />
                        <h2 style="color: #e33e38; margin: 10px 0 0 0; font-size: 28px; letter-spacing: -0.5px;">ZendIT</h2>
                    </div>
                    
                    <div style="background: #fbfbfb; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
                        <h3 style="margin-top: 0; color: #111; text-align: center; font-size: 20px;">Welcome back, ${fullName}! 👋</h3>
                        <p style="color: #555; line-height: 1.6;">A new login was just detected on your ZendIT account.</p>
                        <p style="color: #555; line-height: 1.6;">If this was you, you can safely ignore this email. If this wasn't you, please secure your account immediately or reply to this email.</p>
                    </div>

                    <div style="text-align: center; margin-bottom: 30px;">
                        <a href="https://zendit.finance/dashboard" style="background: #e33e38; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
                    </div>

                    <div style="text-align: center; font-size: 11px; color: #999; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px;">
                        <p>© ${new Date().getFullYear()} ZendIT App. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        if (resendError) {
            console.error("Resend API Error (Welcome Back):", resendError);
            return NextResponse.json({ error: resendError.message }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Welcome back email error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
