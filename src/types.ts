import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"]; //타입 정제
export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];
export type CommentEntity = Database["public"]["Tables"]["comment"]["Row"];
export type NotificationEntity =
  Database["public"]["Tables"]["notification"]["Row"];

export type Post = PostEntity & { author: ProfileEntity; isLiked: boolean };
export type Comment = CommentEntity & { author: ProfileEntity };
export type Notification = NotificationEntity & { actor: ProfileEntity | null };
export type NestedComment = Comment & {
  parentComment?: Comment;
  children: NestedComment[];
};

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};

export type Theme = "system" | "dark" | "light";
