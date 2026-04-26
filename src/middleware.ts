import { updateSession } from "@/lib/middleware";
import { type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin"];

export async function middleware(request: NextRequest) {
  return updateSession(request, PROTECTED_PREFIXES);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
