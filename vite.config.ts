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
      // ws is CJS and must NOT be bundled — let Bun resolve it natively
      external: ["ws"],
    },
  },
});
