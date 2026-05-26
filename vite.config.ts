import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: 5000,
      allowedHosts: true,
    },
    preview: {
      host: "0.0.0.0",
      port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
      allowedHosts: true,
    },
    ssr: {
      noExternal: [
        "@supabase/supabase-js",
        "@supabase/auth-js",
        "@supabase/functions-js",
        "@supabase/postgrest-js",
        "@supabase/storage-js",
        "@supabase/realtime-js",
      ],
      // In dev, ws must be external so Bun handles it as CJS (avoids "require is not defined" in Vite's ESM evaluator).
      // In production the Cloudflare plugin forbids ssr.external, so we skip it — rollup bundles ws fine.
      ...(process.env.NODE_ENV !== "production" ? { external: ["ws"] } : {}),
    },
  },
});
