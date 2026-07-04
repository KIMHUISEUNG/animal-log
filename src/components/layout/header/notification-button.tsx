import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  useNotificationsData,
  useUnreadNotificationCount,
} from "@/hooks/queries/use-notifications-data";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/mutations/notification/use-mark-notification-as-read";
import { useNotificationsRealtime } from "@/hooks/realtime/use-notifications-realtime";
import { formatTimeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useSession } from "@/store/session";
import { type Notification } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";
import { Bell } from "lucide-react";
import { Link } from "react-router";
import { useDeleteReadNotifications } from "@/hooks/mutations/notification/use-delete-read-notifications";

function getNotificationMessage(notification: Notification) {
  const actorName = notification.actor?.nickname ?? "알 수 없는 사용자";

  if (notification.type === "REPLY_ON_COMMENT") {
    return actorName + "님이 내 댓글에 답글을 남겼습니다.";
  }

  return actorName + "님이 내 게시글에 댓글을 남겼습니다.";
}

export default function NotificationButton() {
  const session = useSession();
  const userId = session?.user.id;

  useNotificationsRealtime(userId);

  const { data: notifications = [], isLoading: isNotificationsLoading } =
    useNotificationsData(userId);
  const { data: unreadCount = 0 } = useUnreadNotificationCount(userId);
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead(userId);
  const { mutate: markAllNotificationsAsRead, isPending: isMarkAllPending } =
    useMarkAllNotificationsAsRead(userId);

  const {
    mutate: deleteReadNotifications,
    isPending: isDeleteReadNotificationsPending,
  } = useDeleteReadNotifications(userId);

  if (!session) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="알림"
          className="relative"
          size="icon"
          variant="ghost"
        >
          <Bell strokeWidth={2.25} />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[calc(100vw-2rem)] max-w-80 p-0">
        <div className="flex h-12 items-center justify-between border-b px-4">
          <div className="text-sm font-semibold">알림</div>
          <div className="flex gap-2">
            <button
              className="text-muted-foreground hover:text-foreground text-xs disabled:opacity-50"
              disabled={isDeleteReadNotificationsPending}
              onClick={() => deleteReadNotifications()}
              type="button"
            >
              읽은 알림 삭제
            </button>

            {unreadCount > 0 && (
              <button
                className="text-muted-foreground hover:text-foreground text-xs disabled:opacity-50"
                disabled={isMarkAllPending}
                onClick={() => markAllNotificationsAsRead()}
                type="button"
              >
                모두 읽음
              </button>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isNotificationsLoading ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              알림을 불러오는 중
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              아직 알림이 없습니다.
            </div>
          ) : (
            notifications.map((notification) => (
              <PopoverClose asChild key={notification.id}>
                <Link
                  className={cn(
                    "hover:bg-muted block border-b px-4 py-3 transition-colors last:border-b-0",
                    !notification.is_read && "bg-muted/40",
                  )}
                  onClick={() => {
                    if (!notification.is_read) {
                      markNotificationAsRead(notification.id);
                    }
                  }}
                  to={
                    notification.post_id ? "/post/" + notification.post_id : "/"
                  }
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1.5 size-2 rounded-full",
                        notification.is_read ? "bg-transparent" : "bg-primary",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm break-keep">
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              </PopoverClose>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
