import { deleteReadNotifications } from "@/api/notification";
import { QUERY_KEYS } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteReadNotifications(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("사용자 정보를 찾을 수 없습니다.");
      return deleteReadNotifications(userId);
    },
    onSuccess: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notification.all,
      });
    },
  });
}
