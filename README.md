# wheels2deals

A production-ready car dealer website built with Next.js 16, Supabase, and Tailwind CSS.  
Single-admin system — one dealer manages all inventory, customers browse and inquire.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Validation | Zod v4 |
| Image Compression | browser-image-compression |
| Package Manager | pnpm |

---

## Project Structure

```
src/
  app/
    (public)/
      page.tsx                    # Homepage
    (auth)/                       # Login, signup pages (TODO)
    (admin)/
      actions/
        car.ts                    # Server actions: createDraftCar, updateCarImages, publishCar, rollback, updateCar, deleteCar
  components/
    ui/
      ImageUploader.tsx           # Drag-drop multi-image uploader with compression, preview, cover selection, retry
      button.tsx                  # Shadcn button
    layout/
      Navbar.tsx                  # Responsive navbar with logo + nav links + Login/Signup buttons
  lib/
    client.ts                     # Supabase browser client (createBrowserClient)
    server.ts                     # Supabase server client (createServerClient + cookies)
    middleware.ts                 # updateSession() — refreshes auth, protects routes
    storage.ts                    # Client-side upload utils (uploadCarImages, retryFailedUploads, etc.)
    storage.server.ts             # Server-side storage utils (deleteUploadedImages)
    compress.ts                   # Image compression + validation + deduplication
    slug.ts                       # Unique slug generator with DB collision check
    env.ts                        # Env var validation (throws on missing)
    utils/
      cn.ts                       # clsx + tailwind-merge helper
    validations/
      car.ts                      # Zod schemas: carSchema, updateImagesSchema
  hooks/
    useImageUpload.ts             # Full image upload state hook (previews, cover, retry, rollback)
  types/
    database.ts                   # Auto-generated Supabase TypeScript types
  middleware.ts                   # Root middleware — session refresh, /admin protection
```

> **Dead code to clean up:** `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` are duplicates of `src/lib/client.ts` and `src/lib/server.ts`. Use the latter.

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://hxkwxyypkbzxahteqzxv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Q0YsyztWkswqXgOti888uQ_dlOSLXhN
```

---

## Database Schema

### `cars` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto-generated |
| type | enum | sedan, suv, hatchback, coupe, convertible, wagon, van, truck, motorcycle, other |
| title | text | |
| price | numeric(12,2) | |
| brand | text | |
| model | text | |
| year | int | 1900 – current+1 |
| km_driven | int | |
| fuel_type | enum | petrol, diesel, electric, hybrid, cng, lpg |
| transmission | enum | manual, automatic, cvt, amt |
| location | text | |
| description | text | optional |
| images | text[] | array of public URLs, index 0 = cover |
| video_url | text | optional |
| color | text | optional |
| owners_count | int | default 1 |
| status | enum | **draft → available → sold / reserved** |
| is_featured | boolean | default false |
| views_count | int | default 0 (increment via DB function — not yet built) |
| slug | text unique | auto-generated from brand + title + year |
| created_at | timestamptz | |
| updated_at | timestamptz | auto-updated via trigger |

### `inquiries` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| car_id | uuid FK | references cars(id), on delete set null |
| name | text | |
| email | text | |
| phone | text | optional |
| message | text | optional |
| status | enum | new, contacted, closed |
| created_at | timestamptz | |

### Indexes

- `idx_cars_slug` — unique
- `idx_cars_brand`, `idx_cars_price`, `idx_cars_created_at DESC`
- `idx_cars_status`, `idx_cars_type`, `idx_cars_is_featured`
- `idx_inquiries_car_id`, `idx_inquiries_status`

### RLS Policies

**cars:**
- Public → SELECT where `status = 'available'`
- Admin → ALL (checked via `auth.jwt() ->> 'role' = 'admin'` from `app_metadata`)

**inquiries:**
- Anyone → INSERT
- Admin → ALL

### Set Admin Role

Run once in Supabase SQL editor after account creation:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
where email = 'your@email.com';
```

---

## Supabase Storage

| Bucket | Public | Size Limit | Allowed Types |
|--------|--------|-----------|---------------|
| `car-images` | ✅ | 10MB | image/jpeg, image/png, image/webp |
| `car-videos` | ✅ | 500MB | video/mp4, video/quicktime, video/webm |

**Storage path format:** `{carId}/{index}-{timestamp}.webp`  
Anchored to `carId` (not slug) to prevent collisions.

**Storage policies:**
- Public → read both buckets
- Admin only → upload and delete

---

## Image Upload Flow

1. User selects/drops images into `<ImageUploader />`
2. `prepareImages()` runs: validates type/size → deduplicates by `name+size` → compresses (1.5MB max, 1600px, WebP, quality 0.8)
3. Previews shown — user taps to set cover image
4. On submit: `useImageUpload.uploadAll(carId)` uploads all files via `Promise.allSettled`
5. Failed images surface a Retry button — `retryFailed(carId)` re-attempts only failures
6. If DB update fails after upload: `rollbackUpload(succeeded)` deletes orphaned storage files

**Constraints:**
- Min 3 images (validated in hook + UI)
- Max 10 images (hard-stopped in hook, drop zone hidden in UI)
- Cover image always uploaded first → stored as `images[0]`

---

## Car Creation Server Actions

File: `src/app/(admin)/actions/car.ts`

All actions are `"use server"`, admin-gated, Zod-validated, return typed results.

```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string; fields?: Record<string, string[]> }
```

| Action | Purpose |
|--------|---------|
| `createDraftCar(values)` | Validates form, generates slug, inserts `status=draft`, returns `{ carId, slug }` |
| `updateCarImages(carId, urls)` | Saves image URL array to car row |
| `publishCar(carId)` | Sets `status = available`, returns `{ slug }` |
| `rollbackCarCreation(carId, uploaded)` | Deletes storage files + draft DB row |
| `updateCar(carId, values)` | Partial update for edit flow |
| `deleteCar(carId)` | Hard deletes car row |

### Full 4-Step Creation Flow

```ts
// Step 1 — create draft
const draft = await createDraftCar(formValues);
if (!draft.success) return; // show draft.fields on form

// Step 2 — upload images (client-side)
const { succeeded, failed } = await imageHook.uploadAll(draft.data.carId);
const imageUrls = succeeded.map((r) => r.url);

// Step 3 — save URLs
const updated = await updateCarImages(draft.data.carId, imageUrls);
if (!updated.success) {
  await rollbackCarCreation(draft.data.carId, succeeded);
  return;
}

// Step 4 — publish
const published = await publishCar(draft.data.carId);
redirect(`/listings/${published.data.slug}`);
```

---

## Middleware

`src/middleware.ts` runs on every request (except static assets).  
Calls `updateSession()` which:
- Refreshes the Supabase session cookie
- Redirects unauthenticated users away from `/admin/*` to `/auth/login`

Public routes are open by default.

---

## MCP Servers

Configured in `.mcp.json` (project-scoped):

| Server | Transport | URL |
|--------|-----------|-----|
| supabase | HTTP | `https://mcp.supabase.com/mcp?project_ref=hxkwxyypkbzxahteqzxv` |

**Figma** and **Stitch** MCPs are configured globally in `~/.claude/settings.json`.  
**Supabase + Postgres Best Practices** agent skills installed under `.agents/skills/`.

---

## Running Locally

```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm build     # production build check
```

---

## What Is NOT Built Yet

| Area | Status |
|------|--------|
| Auth pages (login, signup, logout) | ❌ |
| Admin dashboard | ❌ |
| Car creation form (UI) | ❌ |
| Car listings page `/listings` | ❌ |
| Car detail page `/listings/[slug]` | ❌ |
| Inquiry submission form | ❌ |
| Search and filter UI | ❌ |
| `views_count` increment (DB function) | ❌ |
| Full-text search index | ❌ |
| Security headers in `next.config.ts` | ❌ |
| Supabase image domain in `next.config.ts` | ❌ |
| Error/loading/not-found pages | ❌ |
| Video compression | ❌ |
| Tests | ❌ |

---

## Known Issues

1. `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` are dead duplicates — delete them
2. `ImageUploader` calls `hook.retryFailed("")` with empty string — must pass real `carId` at call site
3. `next.config.ts` is empty — Supabase storage image domain not whitelisted, `<Image>` will fail
4. `.env.local` contains real keys — ensure it is in `.gitignore` before pushing to GitHub
