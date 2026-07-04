export const QUERY_KEYS = {
  profile: {
    all: ["profile"],
    list: ["profile", "list"],
    byId: (userId: string) => ["profile", "byId", userId],
  },
  post: {
    all: ["post"],
    list: ["post", "list"],
    userList: (userId: string) => ["post", "userList", userId],
    byId: (postId: number) => ["post", "byId", postId],
  },
  comment: {
    all: ["comment"],
    post: (postId: number) => ["comment", "post", postId],
  },
  notification: {
    all: ["notification"],
    list: (userId: string) => ["notification", "list", userId],
    unreadCount: (userId: string) => ["notification", "unreadCount", userId],
  },
};

export const BUCKET_NAME = "uploads";
