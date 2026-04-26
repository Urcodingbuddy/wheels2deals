"use client";

import { useCallback, useState } from "react";
import { revokePreviewUrl, type ImagePreview } from "@/lib/compress";
import {
  uploadCarImages,
  retryFailedUploads,
  deleteUploadedImages,
  type BatchUploadResult,
  type UploadFailure,
  type UploadResult,
} from "@/lib/storage";

export const MIN_IMAGES = 3;
export const MAX_IMAGES = 10;

interface UseImageUploadReturn {
  previews: ImagePreview[];
  isUploading: boolean;
  uploadProgress: { completed: number; total: number } | null;
  failedUploads: UploadFailure[];
  addPreviews: (incoming: ImagePreview[]) => void;
  remove: (index: number) => void;
  setCover: (index: number) => void;
  uploadAll: (carId: string) => Promise<BatchUploadResult>;
  retryFailed: (carId: string) => Promise<BatchUploadResult>;
  reset: () => void;
  validationError: string | null;
  canAddMore: boolean;
}

export function useImageUpload(): UseImageUploadReturn {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);
  const [failedUploads, setFailedUploads] = useState<UploadFailure[]>([]);
  // Keep reference to last upload's files for retry
  const [lastUploadFiles, setLastUploadFiles] = useState<File[]>([]);

  const addPreviews = useCallback((incoming: ImagePreview[]) => {
    setPreviews((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      if (remaining <= 0) return prev; // hard stop

      const capped = incoming.slice(0, remaining);
      const hasCover = prev.some((p) => p.isCover);
      return [
        ...prev,
        ...capped.map((p, i) => ({
          ...p,
          isCover: !hasCover && i === 0,
        })),
      ];
    });
  }, []);

  const remove = useCallback((index: number) => {
    setPreviews((prev) => {
      revokePreviewUrl(prev[index].previewUrl);
      const next = prev.filter((_, i) => i !== index);
      if (prev[index].isCover && next.length > 0) {
        next[0] = { ...next[0], isCover: true };
      }
      return next;
    });
  }, []);

  const setCover = useCallback((index: number) => {
    setPreviews((prev) =>
      prev.map((p, i) => ({ ...p, isCover: i === index }))
    );
  }, []);

  const uploadAll = useCallback(
    async (carId: string): Promise<BatchUploadResult> => {
      setIsUploading(true);
      setFailedUploads([]);
      setUploadProgress({ completed: 0, total: previews.length });

      // Cover always goes first → stored as images[0]
      const ordered = [
        ...previews.filter((p) => p.isCover),
        ...previews.filter((p) => !p.isCover),
      ];
      const files = ordered.map((p) => p.file);
      setLastUploadFiles(files);

      const result = await uploadCarImages(
        carId,
        files,
        (completed, total) => setUploadProgress({ completed, total })
      );

      // Sort by index after async settle — guarantees cover is index 0
      result.succeeded.sort((a, b) => a.index - b.index);

      setFailedUploads(result.failed);
      setIsUploading(false);
      setUploadProgress(null);
      return result;
    },
    [previews]
  );

  const retryFailed = useCallback(
    async (carId: string): Promise<BatchUploadResult> => {
      if (!failedUploads.length) return { succeeded: [], failed: [] };

      setIsUploading(true);
      setUploadProgress({ completed: 0, total: failedUploads.length });

      const result = await retryFailedUploads(
        carId,
        lastUploadFiles,
        failedUploads,
        (completed, total) => setUploadProgress({ completed, total })
      );

      result.succeeded.sort((a, b) => a.index - b.index);
      setFailedUploads(result.failed); // update with remaining failures
      setIsUploading(false);
      setUploadProgress(null);
      return result;
    },
    [failedUploads, lastUploadFiles]
  );

  const reset = useCallback(() => {
    previews.forEach((p) => revokePreviewUrl(p.previewUrl));
    setPreviews([]);
    setUploadProgress(null);
    setFailedUploads([]);
    setLastUploadFiles([]);
  }, [previews]);

  const validationError =
    previews.length > 0 && previews.length < MIN_IMAGES
      ? `Add at least ${MIN_IMAGES} images (${previews.length} selected)`
      : null;

  const canAddMore = previews.length < MAX_IMAGES;

  return {
    previews,
    isUploading,
    uploadProgress,
    failedUploads,
    addPreviews,
    remove,
    setCover,
    uploadAll,
    retryFailed,
    reset,
    validationError,
    canAddMore,
  };
}

// Helper for DB consistency — call if DB insert fails after upload
export async function rollbackUpload(succeeded: UploadResult[]): Promise<void> {
  await deleteUploadedImages(succeeded);
}
