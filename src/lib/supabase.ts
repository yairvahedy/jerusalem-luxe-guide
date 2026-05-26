import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// In Node.js < 22 there is no native WebSocket — provide the ws package as transport.
// We use globalThis so this assignment is safe in both browser and server environments.
if (typeof globalThis.WebSocket === "undefined") {
  // Dynamic import resolves at runtime only; the `ws` package is installed.
  const wsModule = await import("ws");
  // @ts-expect-error polyfill
  globalThis.WebSocket = wsModule.default;
}

const url = (import.meta as any).env?.VITE_SUPABASE_URL as string ?? "";
const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string ?? "";

export const supabase = createClient<Database>(url, key, {
  auth: { persistSession: typeof window !== "undefined" },
});
