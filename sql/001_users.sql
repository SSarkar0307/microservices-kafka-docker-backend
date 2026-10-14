create table if not exists users(
    id UUID primary key default gen_random_uuid(),
    name text not null,
    email text not null unique,
    password_hash text not null,
    role text not null default 'USER' check (role in ('USER', 'ADMIN')),
    created_at timestamptz not null default now()
)