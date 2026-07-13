import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { searchItems } from "@/data/cdt";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({ q: z.string().optional().catch("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search — CDT Study" },
      { name: "description", content: "Search across CDT study topics and facts." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
  const hits = q ? searchItems(q) : [];

  return (
    <PageShell title="Search" back={{ to: "/", label: "Home" }}>
      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/search", search: { q: value.trim() } });
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search topics, facts, pitfalls…"
            className="h-12 pl-9"
            aria-label="Search"
          />
        </div>
      </form>

      {!q ? (
        <p className="text-sm text-muted-foreground">Type a query to search.</p>
      ) : hits.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches for &ldquo;{q}&rdquo;.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {hits.map((h) => (
            <li key={`${h.domainId}:${h.itemId}`}>
              <Link
                to="/domain/$domainId/item/$itemId"
                params={{ domainId: h.domainId, itemId: h.itemId }}
                className="block rounded-lg border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-accent"
              >
                <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {h.domainName}
                </div>
                <div className="mt-0.5 text-sm font-medium text-card-foreground">{h.itemTitle}</div>
                {h.snippet ? (
                  <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{h.snippet}</div>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
