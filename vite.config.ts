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
    ssr: {
      noExternal: ["@supabase/supabase-js", "@supabase/auth-js", "@supabase/functions-js", "@supabase/postgrest-js", "@supabase/storage-js"],
      external: ["@supabase/realtime-js", "ws"],
    },
  },
});
