import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { userId, enteredOtp } = await req.json();

        const { data, error } = await supabase
            .from('otps')
            .select('*')
            .eq('user_id', userId)
            .eq('otp_code', enteredOtp)
            .eq('used', false)
            .gte('expires_at', new Date().toISOString())
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // Mark as used so it cannot be reused
        await supabase
            .from('otps')
            .update({ used: true })
            .eq('id', data.id);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
