-- Habits table
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#7c3aed',
  icon text not null default '⭐',
  created_at timestamptz default now()
);

-- Check-ins table
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  created_at timestamptz default now(),
  unique(habit_id, date)
);

-- Row Level Security
alter table habits enable row level security;
alter table check_ins enable row level security;

create policy "Users manage own habits"
  on habits for all using (auth.uid() = user_id);

create policy "Users manage own check_ins"
  on check_ins for all using (auth.uid() = user_id);
