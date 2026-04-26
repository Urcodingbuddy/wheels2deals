import { z } from "zod";
import { Constants } from "@/types/database";

const { car_type, fuel_type, transmission_type } = Constants.public.Enums;

export const carSchema = z.object({
  title:        z.string().min(5, "Title must be at least 5 characters").max(120),
  type:         z.enum([...car_type] as [string, ...string[]]),
  brand:        z.string().min(1, "Brand is required").max(60),
  model:        z.string().min(1, "Model is required").max(60),
  year:         z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price:        z.number().positive("Price must be positive").max(100_000_000),
  km_driven:    z.number().int().min(0),
  fuel_type:    z.enum([...fuel_type] as [string, ...string[]]),
  transmission: z.enum([...transmission_type] as [string, ...string[]]),
  location:     z.string().min(1, "Location is required").max(120),
  description:  z.string().max(5000).optional(),
  color:        z.string().max(40).optional(),
  owners_count: z.number().int().min(1).max(20).optional(),
  video_url:    z.string().url("Invalid video URL").optional().or(z.literal("")),
});

export type CarFormValues = z.infer<typeof carSchema>;

export const updateImagesSchema = z.object({
  carId:  z.string().uuid(),
  images: z.array(z.string().url()).min(3, "At least 3 images required").max(10),
});
