import { supabase } from "@/lib/supabase";
import { deleteImagesInPath, uploadImage } from "./image";
import type { PostEntity } from "@/types";
import { optimizeImage } from "@/lib/image-optimizer";

export async function fetchPosts({
  from,
  to,
  userId,
  authorId,
}: {
  from: number;
  to: number;
  userId: string;
  authorId?: string;
}) {
  const request = supabase
    .from("post")
    .select("*, author: profile!author_id (*), myLiked: like!post_id (*)")
    .eq("like.user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (authorId) request.eq("author_id", authorId);

  const { data, error } = await request;

  if (error) throw error;
  return data.map((post) => ({
    ...post,
    isLiked: post.myLiked && post.myLiked.length > 0,
  }));
}

export async function fetchPostById({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id (*), myLiked: like!post_id (*)")
    .eq("like.user_id", userId)
    .eq("id", postId)
    .single();

  if (error) throw error;
  return { ...data, isLiked: data.myLiked && data.myLiked.length > 0 };
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createPostWithImages({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  if (images.length === 0) return createPost(content);

  const optimizedImages: File[] = [];
  for (const image of images) {
    optimizedImages.push(
      await optimizeImage(image, { maxDimension: 1920, quality: 0.82 }),
    );
  }

  // 이미지 변환 성공 후 포스트를 생성해 실패 시 빈 포스트가 남지 않게 한다.
  const post = await createPost(content);

  try {
    const imageUrls = await Promise.all(
      optimizedImages.map((image) => {
        const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        return uploadImage({
          file: image,
          filePath,
        });
      }),
    );

    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });
    return updatedPost;
  } catch (error) {
    await Promise.allSettled([
      deleteImagesInPath(`${userId}/${post.id}`),
      deletePost(post.id),
    ]);
    throw error;
  }
}

//하나의 포스트를 업데이트하는 함수
export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

//하나의 포스트를 삭제하는 함수
export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function togglePostLike({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: postId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}
