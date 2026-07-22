import { supabase } from "@/lib/supabase";
import { getRandomNickname } from "@/lib/utils";
import { deleteImageByUrl, uploadImage } from "./image";
import { optimizeImage } from "@/lib/image-optimizer";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .insert({
      id: userId,
      nickname: getRandomNickname(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile({
  userId,
  nickname,
  bio,
  avatarImageFile,
}: {
  userId: string;
  nickname?: string;
  bio?: string;
  avatarImageFile?: File;
}) {
  const previousAvatarUrl = avatarImageFile
    ? (await fetchProfile(userId)).avatar_url
    : null;
  let newAvatarImageUrl: string | undefined;

  if (avatarImageFile) {
    const optimizedAvatar = await optimizeImage(avatarImageFile, {
      maxDimension: 512,
      quality: 0.82,
    });
    const filePath = `${userId}/avatar/${Date.now()}-${crypto.randomUUID()}.webp`;

    newAvatarImageUrl = await uploadImage({
      file: optimizedAvatar,
      filePath,
    });
  }

  const { data, error } = await supabase
    .from("profile")
    .update({
      nickname,
      bio,
      ...(newAvatarImageUrl ? { avatar_url: newAvatarImageUrl } : {}),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    if (newAvatarImageUrl) {
      await deleteImageByUrl(newAvatarImageUrl).catch(() => undefined);
    }
    throw error;
  }

  if (previousAvatarUrl && previousAvatarUrl !== newAvatarImageUrl) {
    await deleteImageByUrl(previousAvatarUrl).catch((deleteError) => {
      console.error("기존 프로필 이미지 삭제에 실패했습니다.", deleteError);
    });
  }

  return data;
}
