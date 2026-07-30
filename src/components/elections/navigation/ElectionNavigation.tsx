import { ELECTION_PRIMARY_NAVIGATION } from "@/lib/elections";

export interface ElectionNavigationProps {
  currentPath?: string;
  className?: string;
  ariaLabel?: string;
}

export function ElectionNavigation({
  currentPath,
  className = "",
  ariaLabel = "Election Central navigation",
}: ElectionNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`border-y border-border/70 bg-background/95 ${className}`.trim()}
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-4">
        <ul className="flex min-w-max items-center gap-1 py-2">
          {ELECTION_PRIMARY_NAVIGATION.map((item) => {
            const isActive =
              currentPath === item.href || currentPath?.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default ElectionNavigation;
