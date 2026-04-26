"use client";

import { useCallback, useRef, useState } from "react";
import { prepareImages } from "@/lib/compress";
import { useImageUpload, MIN_IMAGES, MAX_IMAGES } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  hook: ReturnType<typeof useImageUpload>;
  className?: string;
}

export function ImageUploader({ hook, className }: ImageUploaderProps) {
  const {
    previews,
    addPreviews,
    remove,
    setCover,
    isUploading,
    uploadProgress,
    validationError,
    failedUploads,
    canAddMore,
  } = hook;

  const [dragging, setDragging] = useState(false);
  const [compressProgress, setCompressProgress] = useState<{ completed: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (incoming: FileList | File[]) => {
      if (!canAddMore) return;
      const limited = Array.from(incoming).slice(0, MAX_IMAGES - previews.length);
      setErrors([]);
      setCompressProgress({ completed: 0, total: limited.length });

      const { previews: prepared, errors: errs, duplicates } = await prepareImages(
        limited,
        previews.map((p) => p.file),
        (completed, total) => setCompressProgress({ completed, total })
      );

      setCompressProgress(null);

      const allErrors = [
        ...errs,
        ...duplicates.map((n) => `"${n}" already added`),
      ];
      if (allErrors.length) setErrors(allErrors);
      if (prepared.length) addPreviews(prepared);
    },
    [previews, canAddMore, addPreviews]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const busy = !!compressProgress || isUploading;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone — hidden when at hard limit */}
      {canAddMore && (
        <div
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            busy ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          {compressProgress ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Compressing {compressProgress.completed}/{compressProgress.total}...
              </p>
              <ProgressBar value={compressProgress.completed} max={compressProgress.total} />
            </div>
          ) : isUploading && uploadProgress ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Uploading {uploadProgress.completed}/{uploadProgress.total} images...
              </p>
              <ProgressBar value={uploadProgress.completed} max={uploadProgress.total} />
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">Drop images here or click to select</p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP · Max 10MB each · {previews.length}/{MAX_IMAGES} · Min {MIN_IMAGES} required
              </p>
            </>
          )}
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Maximum {MAX_IMAGES} images reached. Remove one to add more.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Validation / errors */}
      {errors.length > 0 && (
        <ul className="text-xs text-destructive space-y-0.5">
          {errors.map((e) => <li key={e}>• {e}</li>)}
        </ul>
      )}

      {validationError && (
        <p className="text-xs text-amber-600 dark:text-amber-400">{validationError}</p>
      )}

      {/* Failed upload retry */}
      {failedUploads.length > 0 && (
        <div className="flex items-center justify-between rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <span>{failedUploads.length} image(s) failed to upload</span>
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={() => hook.retryFailed("")}
          >
            Retry
          </button>
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">Tap an image to set it as cover</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {previews.map((preview, i) => (
              <div
                key={preview.previewUrl}
                className={cn(
                  "relative aspect-square group rounded-md overflow-hidden ring-2 transition-all cursor-pointer",
                  preview.isCover ? "ring-primary" : "ring-transparent hover:ring-primary/40"
                )}
                onClick={() => setCover(i)}
              >
                <img
                  src={preview.previewUrl}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                {preview.isCover && (
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-primary h-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
