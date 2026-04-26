"use client";

import imageCompression from "browser-image-compression";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_RAW_SIZE = 10 * 1024 * 1024; // 10MB

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/webp" as const,
  initialQuality: 0.8,
};

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type))
    return `"${file.name}" is not a valid image type. Use JPEG, PNG, or WebP.`;
  if (file.size > MAX_RAW_SIZE)
    return `"${file.name}" exceeds 10MB.`;
  return null;
}

export function deduplicateFiles(incoming: File[], existing: File[]): { valid: File[]; duplicates: string[] } {
  const existingKeys = new Set(existing.map((f) => `${f.name}-${f.size}`));
  const seen = new Set(existingKeys);
  const valid: File[] = [];
  const duplicates: string[] = [];

  for (const file of incoming) {
    const key = `${file.name}-${file.size}`;
    if (seen.has(key)) {
      duplicates.push(file.name);
    } else {
      seen.add(key);
      valid.push(file);
    }
  }

  return { valid, duplicates };
}

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, COMPRESSION_OPTIONS);
}

export async function compressImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<File[]> {
  const results: File[] = [];
  for (let i = 0; i < files.length; i++) {
    results.push(await compressImage(files[i]));
    onProgress?.(i + 1, files.length);
  }
  return results;
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

export interface ImagePreview {
  file: File;
  previewUrl: string;
  isCover: boolean;
}

export async function prepareImages(
  files: File[],
  existing: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ previews: ImagePreview[]; errors: string[]; duplicates: string[] }> {
  const errors: string[] = [];

  // Validate before compression
  const validationErrors = files.map(validateImageFile).filter(Boolean) as string[];
  if (validationErrors.length) errors.push(...validationErrors);

  const passedValidation = files.filter((f) => !validateImageFile(f));

  // Deduplicate
  const { valid, duplicates } = deduplicateFiles(passedValidation, existing);

  if (!valid.length) return { previews: [], errors, duplicates };

  const compressed = await compressImages(valid, onProgress);

  const previews: ImagePreview[] = compressed.map((file) => ({
    file,
    previewUrl: createPreviewUrl(file),
    isCover: false,
  }));

  return { previews, errors, duplicates };
}
