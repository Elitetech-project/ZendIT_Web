import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
            // If table doesn't exist or row missing, return defaults
            return NextResponse.json({
                fee_percentage: 1.0,
                min_transfer_amount: 100,
                max_transfer_amount: 1000000,
                maintenance_mode: false,
                support_email: 'support@zendit.online'
            });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const { data, error } = await supabase
            .from('platform_settings')
            .upsert({
                id: 1,
                fee_percentage: body.fee_percentage,
                min_transfer_amount: body.min_transfer_amount,
                max_transfer_amount: body.max_transfer_amount,
                maintenance_mode: body.maintenance_mode,
                support_email: body.support_email,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // Log the change in Audit Logs
        await supabase.from('audit_logs').insert({
            action: 'UPDATE_SETTINGS',
            description: 'Updated platform fees and limits',
            metadata: body
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
