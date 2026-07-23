import { Link } from "@tanstack/react-router";

export function HubBreadcrumbs({ current }: { current: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-6xl px-4 pt-5 text-sm text-muted-foreground"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-primary hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="font-medium text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}

