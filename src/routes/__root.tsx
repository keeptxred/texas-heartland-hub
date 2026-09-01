import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { SiteNotFound } from "../components/site-not-found";
import { ArticleSourceTransparencyPanel } from "../components/article-source-transparency";
import { organizationJsonLd } from "../lib/seo";

const ADSENSE_CLIENT = "ca-pub-1891256141359926";
const ADSENSE_SCRIPT = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
const ICON_VERSION = "20260822";
const ADSENSE_EXCLUDED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/auth",
  "/shop",
  "/product-offer",
  "/privacy",
  "/terms-of-service",
  "/return-refund-policy",
  "/shipping-policy",
  "/contact",
  "/about",
  "/editorial-standards",
  "/authors",
  "/sources",
  "/news",
] as const;
const ADSENSE_EXCLUDED_DETAIL_PATH_PREFIXES = [
  "/elections/candidates/",
  "/elections/districts/",
  "/elections/races/",
] as const;
const ADSENSE_BOOTSTRAP = `(function(){function load(){var p=location.pathname;var x=${JSON.stringify(ADSENSE_EXCLUDED_PATH_PREFIXES)};var d=${JSON.stringify(ADSENSE_EXCLUDED_DETAIL_PATH_PREFIXES)};var excluded=x.some(function(prefix){return p===prefix||p.indexOf(prefix+'/')===0;})||d.some(function(prefix){return p.indexOf(prefix)===0;});var noindex=Array.prototype.some.call(document.querySelectorAll('meta[name="robots"]'),function(m){return /(?:^|[,\\s])noindex(?:$|[,\\s])/i.test(m.content||'');});var ineligible=document.querySelector('[data-adsense-ineligible="true"]');if(excluded||noindex||ineligible)return;var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='${ADSENSE_SCRIPT}';s.setAttribute('data-adsense-gated','true');document.head.appendChild(s);}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',load,{once:true});}else{load();}}());`;

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div data-adsense-ineligible="true" className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
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
      {
        name: "robots",
        content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      },
      { name: "msvalidate.01", content: "74E5E79AEC351CF6D2577A6FC6A125DF" },
      { name: "google-site-verification", content: "58wEXUcyQN-Wcn4LaY6yS_mUwAWVh99ni3Z2SqJ_Bkk" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: `/favicon.ico?v=${ICON_VERSION}`, sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: `/keep-tx-red-icon.svg?v=${ICON_VERSION}` },
      { rel: "shortcut icon", href: `/favicon.ico?v=${ICON_VERSION}` },
      { rel: "apple-touch-icon", href: `/keep-tx-red-icon.svg?v=${ICON_VERSION}` },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://pagead2.googlesyndication.com" },
      { rel: "dns-prefetch", href: "https://googleads.g.doubleclick.net" },
      { rel: "dns-prefetch", href: "https://tpc.googlesyndication.com" },
      { rel: "dns-prefetch", href: "https://www.googletagservices.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children:
          "(function(){function l(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-R7QW1X96TW';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-R7QW1X96TW');}if(document.readyState==='complete'){setTimeout(l,500);}else{window.addEventListener('load',function(){setTimeout(l,500);});}})();",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          ...organizationJsonLd(),
          "@type": ["Organization", "NewsMediaOrganization"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: SiteNotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: ADSENSE_BOOTSTRAP }} />
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
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
          <ArticleSourceTransparencyPanel />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
