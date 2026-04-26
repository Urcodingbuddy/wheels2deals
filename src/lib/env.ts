function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const env = {
  supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabasePublishableKey: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
};
