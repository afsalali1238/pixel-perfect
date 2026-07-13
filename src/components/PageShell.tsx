import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageShell({
  title,
  back,
  children,
  actions,
}: {
  title: string;
  back?: { to: string; label?: string };
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {back ? (
              <Link
                to={back.to}
                className="inline-flex h-11 min-w-11 items-center gap-1 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{back.label ?? "Back"}</span>
              </Link>
            ) : null}
            <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
