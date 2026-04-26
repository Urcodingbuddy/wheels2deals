import slugify from "slugify";
import { createClient } from "@/lib/server";

export async function generateUniqueSlug(title: string, brand: string, year: number): Promise<string> {
  const base = slugify(`${brand} ${title} ${year}`, {
    lower: true,
    strict: true,
    trim: true,
  });

  const supabase = await createClient();
  let slug = base;
  let attempt = 0;

  while (true) {
    const { data } = await supabase
      .from("cars")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;

    attempt++;
    slug = `${base}-${attempt}`;
  }
}
