"use server";

import { createClient } from "@/lib/server";
import { carSchema, updateImagesSchema, type CarFormValues } from "@/lib/validations/car";
import { generateUniqueSlug } from "@/lib/slug";
import { deleteUploadedImages } from "@/lib/storage.server";
import type { UploadResult } from "@/lib/storage";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    throw new ActionError("Unauthorized", "UNAUTHORIZED");
  }

  const role = (data.claims as { app_metadata?: { role?: string } })?.app_metadata?.role;
  if (role !== "admin") {
    throw new ActionError("Forbidden", "FORBIDDEN");
  }

  return { supabase };
}

// ─── Error class ──────────────────────────────────────────────────────────────

class ActionError extends Error {
  constructor(
    message: string,
    public code: string,
    public fields?: Record<string, string[]>
  ) {
    super(message);
  }
}

// ─── Response helpers ─────────────────────────────────────────────────────────

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string; fields?: Record<string, string[]> };

function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

function fail(error: unknown): ActionResult<never> {
  if (error instanceof ActionError) {
    return { success: false, error: error.message, code: error.code, fields: error.fields };
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  return { success: false, error: message, code: "INTERNAL_ERROR" };
}

// ─── Step 1: Create draft car ─────────────────────────────────────────────────

export async function createDraftCar(
  values: CarFormValues
): Promise<ActionResult<{ carId: string; slug: string }>> {
  try {
    const { supabase } = await requireAdmin();

    const parsed = carSchema.safeParse(values);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ActionError("Validation failed", "VALIDATION_ERROR", fields);
    }

    const slug = await generateUniqueSlug(parsed.data.title, parsed.data.brand, parsed.data.year);

    const { data, error } = await supabase
      .from("cars")
      .insert({
        ...parsed.data,
        slug,
        status: "draft",
        images: [],
        video_url: parsed.data.video_url || null,
      })
      .select("id, slug")
      .single();

    if (error) throw new ActionError(error.message, "DB_ERROR");

    return ok({ carId: data.id, slug: data.slug });
  } catch (err) {
    return fail(err);
  }
}

// ─── Step 2 is client-side: upload images using carId ────────────────────────
//     Call uploadCarImages(carId, files) from the client hook

// ─── Step 3: Save image URLs to car ──────────────────────────────────────────

export async function updateCarImages(
  carId: string,
  imageUrls: string[]
): Promise<ActionResult<void>> {
  try {
    const { supabase } = await requireAdmin();

    const parsed = updateImagesSchema.safeParse({ carId, images: imageUrls });
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ActionError("Validation failed", "VALIDATION_ERROR", fields);
    }

    const { error } = await supabase
      .from("cars")
      .update({ images: parsed.data.images })
      .eq("id", parsed.data.carId);

    if (error) throw new ActionError(error.message, "DB_ERROR");

    return ok(undefined);
  } catch (err) {
    return fail(err);
  }
}

// ─── Step 4: Publish car ──────────────────────────────────────────────────────

export async function publishCar(carId: string): Promise<ActionResult<{ slug: string }>> {
  try {
    const { supabase } = await requireAdmin();

    if (!carId) throw new ActionError("carId is required", "VALIDATION_ERROR");

    const { data, error } = await supabase
      .from("cars")
      .update({ status: "available" })
      .eq("id", carId)
      .select("slug")
      .single();

    if (error) throw new ActionError(error.message, "DB_ERROR");
    if (!data) throw new ActionError("Car not found", "NOT_FOUND");

    return ok({ slug: data.slug });
  } catch (err) {
    return fail(err);
  }
}

// ─── Rollback: delete draft + orphaned images ─────────────────────────────────

export async function rollbackCarCreation(
  carId: string,
  uploadedImages: UploadResult[]
): Promise<ActionResult<void>> {
  try {
    const { supabase } = await requireAdmin();

    // Delete orphaned images from storage
    if (uploadedImages.length > 0) {
      await deleteUploadedImages(uploadedImages);
    }

    // Delete the draft row
    if (carId) {
      await supabase.from("cars").delete().eq("id", carId);
    }

    return ok(undefined);
  } catch (err) {
    return fail(err);
  }
}

// ─── Update car (edit flow) ───────────────────────────────────────────────────

export async function updateCar(
  carId: string,
  values: Partial<CarFormValues>
): Promise<ActionResult<void>> {
  try {
    const { supabase } = await requireAdmin();

    const parsed = carSchema.partial().safeParse(values);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ActionError("Validation failed", "VALIDATION_ERROR", fields);
    }

    const { error } = await supabase
      .from("cars")
      .update(parsed.data)
      .eq("id", carId);

    if (error) throw new ActionError(error.message, "DB_ERROR");

    return ok(undefined);
  } catch (err) {
    return fail(err);
  }
}

// ─── Delete car ───────────────────────────────────────────────────────────────

export async function deleteCar(carId: string): Promise<ActionResult<void>> {
  try {
    const { supabase } = await requireAdmin();

    if (!carId) throw new ActionError("carId is required", "VALIDATION_ERROR");

    const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", carId);

    if (error) throw new ActionError(error.message, "DB_ERROR");

    return ok(undefined);
  } catch (err) {
    return fail(err);
  }
}
