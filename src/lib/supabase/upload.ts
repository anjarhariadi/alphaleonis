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
