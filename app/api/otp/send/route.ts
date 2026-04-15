import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, email } = body;
        // Handle both fullName and userName, fallback to User
        const fullName = body.fullName || body.userName || 'User';

        // Check how many OTP requests were made in the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
            .from('otps')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', oneHourAgo);

        if (countError) {
            console.error("Rate limit check error:", countError);
            return NextResponse.json({ error: 'Failed to verify usage limits' }, { status: 500 });
        }

        const maxAttemptsPerHour = 3;
        const currentAttempts = count || 0;

        if (currentAttempts >= maxAttemptsPerHour) {
            return NextResponse.json({
                error: 'Too many requests. You can only request 3 codes per hour. Please wait before trying again.',
                attemptsLeft: 0
            }, { status: 429 });
        }

        const attemptsLeft = maxAttemptsPerHour - (currentAttempts + 1);

        // Invalidate any existing unused OTPs for this user
        await supabase
            .from('otps')
            .update({ used: true })
            .eq('user_id', userId)
            .eq('used', false);

        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Store in Supabase
        const { error } = await supabase.from('otps').insert({
            user_id: userId,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            used: false,
        });

        if (error) {
            console.error("Supabase error storing OTP:", error);
            return NextResponse.json({ error: 'Failed to store OTP' }, { status: 500 });
        }

        // Send via Resend
        const { error: resendError } = await resend.emails.send({
            from: 'ZendIT <noreply@zendit.online>',
            to: email,
            subject: 'Your Transfer Confirmation Code',
            html: `
                <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
                    <h2>Confirm Your Transfer</h2>
                    <p>Hi ${fullName}, use the code below to confirm your payout transaction:</p>
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; 
                                text-align: center; padding: 20px; background: #f4f4f4; 
                                border-radius: 8px; color: #333;">
                        ${otp}
                    </div>
                    <p style="color: #888; font-size: 12px; margin-top: 20px;">
                        This code expires in 5 minutes. Do not share it with anyone.
                    </p>
                </div>
            `,
        });

        if (resendError) {
            console.error("Resend API Error:", resendError);
            return NextResponse.json({ error: resendError.message || 'Resend rejected the email (Check API Keys)' }, { status: 403 });
        }

        return NextResponse.json({ success: true, attemptsLeft });
    } catch (e: any) {
        console.error("OTP send error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
