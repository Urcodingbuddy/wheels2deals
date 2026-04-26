import { createClient } from "@/lib/server";
import type { UploadResult } from "@/lib/storage";

const IMAGE_BUCKET = "car-images";

function extractPath(publicUrl: string, bucket: string): string {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new Error("Invalid storage URL");
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}

export async function deleteUploadedImages(results: UploadResult[]): Promise<void> {
  if (!results.length) return;
  const supabase = await createClient();
  const paths = results.map((r) => extractPath(r.url, IMAGE_BUCKET));
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}
