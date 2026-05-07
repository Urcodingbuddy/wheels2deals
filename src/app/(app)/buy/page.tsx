import { createClient } from "@/lib/server";
import BuyClient from "./BuyClient";

export default async function BuyPage() {
  const supabase = await createClient();

  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  const allCars = cars ?? [];
  const brands = [...new Set(allCars.map((c) => c.brand))].sort();

  return <BuyClient cars={allCars} brands={brands} />;
}
