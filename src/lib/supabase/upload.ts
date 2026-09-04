import "server-only";

import { supabaseAdminClient } from "./server";
import { Bucket, MAX_FILE_SIZE_IMAGE } from "./bucket";

type UploadBase64Params = {
  bucket: Bucket;
  filename: string;
  base64: string;
  contentType: string;
  maxBytes?: number;
};

export async function uploadBase64({
  bucket,
  filename,
  base64,
  contentType,
  maxBytes = MAX_FILE_SIZE_IMAGE,
}: UploadBase64Params): Promise<string> {
  const estimated = Math.ceil(base64.length * 0.75);
  if (estimated > maxBytes) {
    throw new Error(
      maxBytes === MAX_FILE_SIZE_IMAGE
        ? "Ukuran gambar tidak boleh lebih dari 5MB"
        : "Ukuran file tidak boleh lebih dari 10MB",
    );
  }

  const buffer = Buffer.from(base64, "base64");

  if (buffer.byteLength > maxBytes) {
    throw new Error(
      maxBytes === MAX_FILE_SIZE_IMAGE
        ? "Ukuran gambar tidak boleh lebih dari 5MB"
        : "Ukuran file tidak boleh lebih dari 10MB",
    );
  }

  const { data, error } = await supabaseAdminClient.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType,
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabaseAdminClient.storage.from(bucket).getPublicUrl(data.path);

  return `${publicUrl}?t=${Date.now()}`;
}

export async function deleteStoredFile(
  bucket: Bucket,
  publicUrl: string,
): Promise<void> {
  let path: string | null = null;
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx !== -1) {
      path = decodeURIComponent(
        url.pathname.slice(idx + marker.length).split("?")[0]!,
      );
    }
  } catch {
    return;
  }
  if (!path) return;
  await supabaseAdminClient.storage.from(bucket).remove([path]);
}
