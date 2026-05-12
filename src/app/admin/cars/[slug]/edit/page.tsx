import { notFound } from "next/navigation";
import { createClient } from "@/lib/server";
import EditCarClient from "./EditCarClient";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!car) notFound();

  return <EditCarClient car={car} />;
}
