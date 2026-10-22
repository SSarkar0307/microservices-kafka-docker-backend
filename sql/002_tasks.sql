create table if not exists tasks(
    id UUID primary key default gen_random_uuid(),
    title text not null,
    status text not null default 'OPEN' check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_by UUID not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_created_by on tasks (created_by)