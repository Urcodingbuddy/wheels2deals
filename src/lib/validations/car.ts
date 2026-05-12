import { z } from "zod";
import { Constants } from "@/types/database";

const { car_type, fuel_type, transmission_type, car_category } = Constants.public.Enums;

export const carSchema = z.object({
  title:        z.string()
                  .min(5, "Listing title is too short (min 5 characters)")
                  .max(120),

  type:         z.string()
                  .min(1, "Please select a body type")
                  .refine((v) => (car_type as readonly string[]).includes(v), {
                    message: "Please select a body type",
                  }),

  brand:        z.string()
                  .min(1, "Brand is required")
                  .max(60),

  model:        z.string()
                  .min(1, "Model is required")
                  .max(60),

  year:         z.string()
                  .min(1, "Year is required")
                  .refine((v) => /^\d{4}$/.test(v), { message: "Please enter a valid 4-digit year" })
                  .refine((v) => Number(v) >= 1900, { message: "Year must be 1900 or later" })
                  .refine((v) => Number(v) <= new Date().getFullYear() + 1, { message: "Year cannot be in the future" }),

  price:        z.string()
                  .refine((v) => v === "" || (!isNaN(Number(v)) && Number(v) > 0), {
                    message: "Price must be a positive number",
                  })
                  .optional()
                  .nullable(),

  km_driven:    z.string()
                  .min(1, "Mileage is required")
                  .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
                    message: "Please enter a valid KM value",
                  }),

  fuel_type:    z.string()
                  .min(1, "Please select a fuel type")
                  .refine((v) => (fuel_type as readonly string[]).includes(v), {
                    message: "Please select a fuel type",
                  }),

  transmission: z.string()
                  .min(1, "Please select a transmission type")
                  .refine((v) => (transmission_type as readonly string[]).includes(v), {
                    message: "Please select a transmission type",
                  }),

  location:     z.string()
                  .min(1, "Location is required")
                  .max(120),

  description:  z.string().max(5000).optional(),
  color:        z.string().max(40).optional(),
  owners_count: z.coerce.number().int().min(1).max(20).optional().or(z.literal("")).or(z.null()),

  video_url:    z.string().url("Please provide a valid URL").optional().or(z.literal("")),

  category:     z.string()
                  .refine((v) => v === "" || (car_category as readonly string[]).includes(v), {
                    message: "Please select a valid category",
                  })
                  .optional()
                  .nullable(),
});

export type CarFormValues = z.infer<typeof carSchema>;

export const updateImagesSchema = z.object({
  carId:  z.string().uuid(),
  images: z.array(z.string().url()).min(3, "At least 3 images required").max(10),
});
