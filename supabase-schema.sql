-- 1. Create the `profiles` table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  username text unique,
  phone_number text,
  wallet_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies (safe defaults)
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );


-- 2. This BEFORE INSERT trigger modifies the user payload seamlessly to append a unique generated username 
CREATE OR REPLACE FUNCTION public.set_username_before_insert()
RETURNS trigger AS $$
DECLARE
  base_username text;
  new_username text;
  counter integer := 0;
  is_unique boolean := false;
BEGIN
  -- Use full name (if provided) or fallback to email prefix
  if NEW.raw_user_meta_data->>'full_name' is null or NEW.raw_user_meta_data->>'full_name' = '' then
    base_username := split_part(NEW.email, '@', 1);
  else
    base_username := lower(regexp_replace(NEW.raw_user_meta_data->>'full_name', '\s+', '', 'g'));
  end if;

  -- strip non-alphanumeric characters
  base_username := regexp_replace(base_username, '[^a-z0-9]', '', 'g');
  new_username := base_username;

  -- Ensure it is unique
  while not is_unique loop
    if not exists (select 1 from public.profiles where username = new_username) then
      is_unique := true;
    else
      counter := counter + 1;
      new_username := base_username || counter::text;
    end if;
  end loop;

  -- Overwrite metadata with new generated username
  NEW.raw_user_meta_data := coalesce(NEW.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('username', new_username);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_before_insert ON auth.users;
CREATE TRIGGER on_auth_user_before_insert
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.set_username_before_insert();


-- 3. This AFTER INSERT trigger inserts the user into your public.profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, phone_number)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'phone_number'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();


-- 4. Create the `transactions` table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('external_remittance', 'internal_p2p')) not null,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  amount_flr decimal not null,
  amount_fiat decimal,
  fiat_currency text default 'NGN',
  recipient_details jsonb, -- { bank_code, account_number, account_name, etc }
  tx_hash text unique, -- Coston2 transaction hash
  flutterwave_id text, -- ID returned by Flutterwave for tracking settlement
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for transactions
alter table public.transactions enable row level security;

-- Users can view only their own transactions
create policy "Users can view their own transactions."
  on public.transactions for select
  using ( auth.uid() = user_id );

-- Users can create (insert) their own transactions
create policy "Users can initiate transactions."
  on public.transactions for insert
  with check ( auth.uid() = user_id );
