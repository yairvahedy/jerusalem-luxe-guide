import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LangProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ListingAgentProvider } from "@/lib/listing-agent-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">404</div>
        <h1 className="font-display text-5xl text-foreground mb-4">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center justify-center h-11 px-6 bg-primary text-primary-foreground text-sm tracking-wider uppercase rounded-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">Error</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground mb-3">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-8">You can try refreshing or head back home.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center h-11 px-6 bg-primary text-primary-foreground text-sm uppercase tracking-wider rounded-sm">
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center h-11 px-6 border border-border bg-background text-sm uppercase tracking-wider rounded-sm">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JF Realty | Jerusalem Rentals" },
      { name: "description", content: "Find your next Jerusalem apartment with JF Realty — rentals and sales across Jerusalem's best neighborhoods, guided by local experts." },
      { name: "author", content: "JF Realty" },
      { property: "og:title", content: "JF Realty | Jerusalem Rentals" },
      { property: "og:description", content: "Rentals and sales across Jerusalem's best neighborhoods — guided by local experts." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/favicon.jpeg?v=2" },
      { rel: "shortcut icon", href: "/favicon.jpeg?v=2" },
      { rel: "apple-touch-icon", href: "/favicon.jpeg?v=2" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=Heebo:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LangProvider>
          <ListingAgentProvider>
            <SiteLayout>
              <Outlet />
            </SiteLayout>
          </ListingAgentProvider>
        </LangProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
