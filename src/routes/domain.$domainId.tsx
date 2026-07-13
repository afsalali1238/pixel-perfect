import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { getDomain } from "@/data/cdt";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/domain/$domainId")({
  loader: ({ params }) => {
    const domain = getDomain(params.domainId);
    if (!domain) throw notFound();
    return { domain };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.domain.name} — CDT Study` : "Domain" },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.domain.items.length} study topics in the ${loaderData.domain.name} domain.`
          : "CDT study domain",
      },
    ],
  }),
  component: DomainView,
  notFoundComponent: () => (
    <PageShell title="Not found" back={{ to: "/" }}>
      <p className="text-sm text-muted-foreground">This domain doesn't exist.</p>
    </PageShell>
  ),
});

function DomainView() {
  const { domain } = Route.useLoaderData();
  return (
    <PageShell title={domain.name} back={{ to: "/", label: "Home" }}>
      <p className="mb-4 text-sm text-muted-foreground">
        {domain.items.length} topics
      </p>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {domain.items.map((it) => (
          <li key={it.id}>
            <Link
              to="/domain/$domainId/item/$itemId"
              params={{ domainId: domain.id, itemId: it.id }}
              className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 transition hover:bg-accent"
            >
              <span className="text-sm font-medium text-card-foreground">
                {it.title}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
