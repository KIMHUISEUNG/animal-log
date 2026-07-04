import { supabase } from "@/lib/supabase";

export async function fetchNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notification")
    .select("*, actor:profile!notification_actor_id_fkey (*)")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

export async function fetchUnreadNotificationCount(userId: string) {
  const { count, error } = await supabase
    .from("notification")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("is_read", false);

  if (error) throw error;
  return count ?? 0;
}

export async function markNotificationAsRead(id: number) {
  const { data, error } = await supabase
    .from("notification")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabase
    .from("notification")
    .update({ is_read: true })
    .eq("recipient_id", userId)
    .eq("is_read", false)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteReadNotifications(recipientId: string) {
  const { data, error } = await supabase
    .from("notification")
    .delete()
    .eq("recipient_id", recipientId)
    .eq("is_read", true)
    .select();

  if (error) throw error;
  return data;
}
