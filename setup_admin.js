const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thasrggbhlzxbiunrqlh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYXNyZ2diaGx6eGJpdW5ycWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIyMjk2OSwiZXhwIjoyMDg4Nzk4OTY5fQ.XkBXmYF1D5ENi9R2yNA9nevcvjvZrMtD68adtEf0zFU';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const email = 'zendit.contact@gmail.com';
const password = 'zendit.testnet';

async function setup() {
    console.log('Starting Admin Setup...');
    
    // 1. Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    let user = users.find(u => u.email === email);

    if (!user) {
        console.log('User not found. Creating user...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (createError) {
            console.error('Error creating user:', createError);
            return;
        }
        user = newUser.user;
        console.log('User created successfully:', user.id);
    } else {
        console.log('User already exists. Updating password...');
        const { error: updateAuthError } = await supabase.auth.admin.updateUserById(user.id, { password });
        if (updateAuthError) console.error('Error updating password:', updateAuthError);
    }

    // 2. Upsert/Update profile with role='admin'
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: email,
            role: 'admin',
            full_name: 'Super Admin',
            updated_at: new Date().toISOString()
        });

    if (profileError) {
        console.error('Error updating profile role:', profileError);
    } else {
        console.log('Profile successfully promoted to Admin!');
    }
}

setup();
