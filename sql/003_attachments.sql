create table if not exists attachments(
    id UUID primary key default gen_random_uuid(),
    task_id UUID not null,
    image_url text not null,
    public_id text not null,
    uploaded_by UUID not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_attachments_task_id on attachments(task_id);