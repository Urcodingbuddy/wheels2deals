"use client";

import { createClient } from "@/lib/client";
import { compressImage } from "@/lib/compress";

const IMAGE_BUCKET = "car-images";
const VIDEO_BUCKET = "car-videos";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

// Anchored to carId (unique) — not slug (can collide)
function buildImagePath(carId: string, index: number): string {
  return `${carId}/${index}-${Date.now()}.webp`;
}

function buildVideoPath(carId: string, file: File): string {
  const ext = file.name.split(".").pop();
  return `${carId}/${Date.now()}.${ext}`;
}

export interface UploadResult {
  url: string;
  index: number;
}

export interface UploadFailure {
  index: number;
  error: string;
}

export interface BatchUploadResult {
  succeeded: UploadResult[];
  failed: UploadFailure[];
}

export async function uploadCarImages(
  carId: string,
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchUploadResult> {
  const supabase = createClient();

  const tasks = files.map((file, index) =>
    (async (): Promise<UploadResult> => {
      const compressed = await compressImage(file);
      const path = buildImagePath(carId, index);

      const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, compressed, { contentType: "image/webp" });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      return { url: data.publicUrl, index };
    })()
  );

  const settled = await Promise.allSettled(tasks);

  const succeeded: UploadResult[] = [];
  const failed: UploadFailure[] = [];

  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      succeeded.push(result.value);
      onProgress?.(succeeded.length, files.length);
    } else {
      failed.push({ index, error: result.reason?.message ?? "Upload failed" });
    }
  });

  // Enforce order by original index — async uploads can complete out of order
  succeeded.sort((a, b) => a.index - b.index);

  return { succeeded, failed };
}

// Retry a specific set of failed uploads
export async function retryFailedUploads(
  carId: string,
  files: File[],
  failures: UploadFailure[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchUploadResult> {
  const filesToRetry = failures.map((f) => files[f.index]);
  return uploadCarImages(carId, filesToRetry, onProgress);
}

// Cleanup orphaned images if DB insert fails
export async function deleteUploadedImages(results: UploadResult[]): Promise<void> {
  const supabase = createClient();
  const paths = results.map((r) => extractPath(r.url, IMAGE_BUCKET));
  if (paths.length) {
    await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  }
}

export async function uploadCarVideo(carId: string, file: File): Promise<string> {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type))
    throw new Error("Invalid video type. Use MP4, MOV, or WebM.");
  if (file.size > MAX_VIDEO_SIZE)
    throw new Error("Video too large. Max 500MB.");

  const supabase = createClient();
  const path = buildVideoPath(carId, file);

  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteCarImage(url: string): Promise<void> {
  const path = extractPath(url, IMAGE_BUCKET);
  const supabase = createClient();
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

export async function deleteCarVideo(url: string): Promise<void> {
  const path = extractPath(url, VIDEO_BUCKET);
  const supabase = createClient();
  const { error } = await supabase.storage.from(VIDEO_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

function extractPath(publicUrl: string, bucket: string): string {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new Error("Invalid storage URL");
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}
