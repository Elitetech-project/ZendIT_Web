const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thasrggbhlzxbiunrqlh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYXNyZ2diaGx6eGJpdW5ycWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIyMjk2OSwiZXhwIjoyMDg4Nzk4OTY5fQ.XkBXmYF1D5ENi9R2yNA9nevcvjvZrMtD68adtEf0zFU';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    const email = 'zendit.contact@gmail.com';
    const password = 'zendit.testnet';

    console.log('--- Phase 1: Auth Setup ---');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
        const { data } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
        user = data.user;
        console.log('User created:', user.id);
    } else {
        await supabase.auth.admin.updateUserById(user.id, { password });
        console.log('User password updated.');
    }

    console.log('--- Phase 2: Profile Role ---');
    // Try to update role. If column doesn't exist, this will error.
    const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

    if (error) {
        console.log('Role update failed. This likely means the "role" column is missing.');
        console.log('Error:', error.message);
    } else {
        console.log('SUCCESS: zendit.contact@gmail.com is now an Admin!');
    }
}

run();
