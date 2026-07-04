import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notification";
import { QUERY_KEYS } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMarkNotificationAsRead(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notification.all,
      });
    },
  });
}

export function useMarkAllNotificationsAsRead(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(userId!),
    onSuccess: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notification.all,
      });
    },
  });
}
