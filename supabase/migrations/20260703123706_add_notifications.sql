create table if not exists public.notification (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone not null default now(),
  recipient_id uuid not null references public.profile(id) on delete cascade,
  actor_id uuid references public.profile(id) on delete set null,
  post_id bigint references public.post(id) on delete cascade,
  comment_id bigint references public.comment(id) on delete cascade,
  type text not null check (type in ('COMMENT_ON_POST', 'REPLY_ON_COMMENT')),
  is_read boolean not null default false,
  constraint notification_unique_recipient_type_comment unique (recipient_id, type, comment_id)
);

create index if not exists notification_recipient_created_at_idx
on public.notification (recipient_id, created_at desc);

create index if not exists notification_recipient_unread_idx
on public.notification (recipient_id, is_read, created_at desc);

grant select, update on public.notification to authenticated;
grant select, insert, update, delete on public.notification to service_role;

alter table public.notification enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'notification'
      and policyname = 'Users can select own notifications'
  ) then
    create policy "Users can select own notifications"
    on public.notification
    for select
    to authenticated
    using ((select auth.uid()) = recipient_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'notification'
      and policyname = 'Users can update own notifications'
  ) then
    create policy "Users can update own notifications"
    on public.notification
    for update
    to authenticated
    using ((select auth.uid()) = recipient_id)
    with check ((select auth.uid()) = recipient_id);
  end if;
end $$;

create or replace function public.create_comment_notifications()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author_id uuid;
  parent_author_id uuid;
begin
  select author_id
  into post_author_id
  from public.post
  where id = new.post_id;

  if post_author_id is not null and post_author_id <> new.author_id then
    insert into public.notification (
      recipient_id,
      actor_id,
      post_id,
      comment_id,
      type
    )
    values (
      post_author_id,
      new.author_id,
      new.post_id,
      new.id,
      'COMMENT_ON_POST'
    )
    on conflict (recipient_id, type, comment_id) do nothing;
  end if;

  if new.parent_comment_id is not null then
    select author_id
    into parent_author_id
    from public.comment
    where id = new.parent_comment_id;

    if parent_author_id is not null
      and parent_author_id <> new.author_id
      and parent_author_id is distinct from post_author_id
    then
      insert into public.notification (
        recipient_id,
        actor_id,
        post_id,
        comment_id,
        type
      )
      values (
        parent_author_id,
        new.author_id,
        new.post_id,
        new.id,
        'REPLY_ON_COMMENT'
      )
      on conflict (recipient_id, type, comment_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.create_comment_notifications() from public;
revoke all on function public.create_comment_notifications() from anon;
revoke all on function public.create_comment_notifications() from authenticated;

drop trigger if exists on_comment_created_create_notifications on public.comment;

create trigger on_comment_created_create_notifications
after insert on public.comment
for each row
execute function public.create_comment_notifications();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'comment'
  ) then
    alter publication supabase_realtime add table public.comment;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notification'
  ) then
    alter publication supabase_realtime add table public.notification;
  end if;
end $$;
