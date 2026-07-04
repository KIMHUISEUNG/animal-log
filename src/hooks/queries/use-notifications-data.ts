import {
  fetchNotifications,
  fetchUnreadNotificationCount,
} from "@/api/notification";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useNotificationsData(userId?: string) {
  return useQuery({
    queryKey: userId
      ? QUERY_KEYS.notification.list(userId)
      : QUERY_KEYS.notification.list(""),
    queryFn: () => fetchNotifications(userId!),
    enabled: !!userId,
  });
}

export function useUnreadNotificationCount(userId?: string) {
  return useQuery({
    queryKey: userId
      ? QUERY_KEYS.notification.unreadCount(userId)
      : QUERY_KEYS.notification.unreadCount(""),
    queryFn: () => fetchUnreadNotificationCount(userId!),
    enabled: !!userId,
  });
}
