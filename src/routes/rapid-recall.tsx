import { createFileRoute } from "@tanstack/react-router";
import { rapidRecall, referenceTables, furtherReading } from "@/data/cdt";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/rapid-recall")({
  head: () => ({
    meta: [
      { title: "Rapid Recall — CDT Study" },
      {
        name: "description",
        content: "One-page rapid recall cheat sheet and reference tables for CDT exam prep.",
      },
    ],
  }),
  component: RapidRecall,
});

function RapidRecall() {
  return (
    <PageShell title="Rapid Recall" back={{ to: "/", label: "Home" }}>
      <p className="mb-4 text-sm text-muted-foreground">
        Fast scan under time pressure. No interaction.
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <dl className="divide-y divide-border">
          {rapidRecall.map((r, i) => (
            <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 px-4 py-3">
              <dt className="text-sm font-semibold text-foreground">{r.item}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{r.fact}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Reference tables
      </h2>
      <div className="flex flex-col gap-6">
        {referenceTables.map((t) => (
          <section
            key={t.title}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="border-b border-border bg-secondary px-4 py-2">
              <h3 className="text-sm font-semibold text-secondary-foreground">{t.title}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/50">
                    {t.columns.map((c) => (
                      <th
                        key={c}
                        className="border-b border-border px-3 py-2 text-left font-semibold text-foreground"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-border last:border-0 odd:bg-background/60"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-3 py-2 align-top leading-relaxed text-foreground"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Further reading
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Primary sources behind the content above — official DHA documents, peer-reviewed
        literature, and consensus guidelines. Verify anything with a specific number or
        regulatory citation against these directly before quoting it to an assessor.
      </p>
      <div className="flex flex-col gap-6">
        {Object.entries(
          furtherReading.reduce<Record<string, typeof furtherReading>>((acc, r) => {
            (acc[r.domain] ??= []).push(r);
            return acc;
          }, {}),
        ).map(([domain, items]) => (
          <section key={domain} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border bg-secondary px-4 py-2">
              <h3 className="text-sm font-semibold text-secondary-foreground">{domain}</h3>
            </div>
            <ul className="divide-y divide-border">
              {items.map((r) => (
                <li key={r.url} className="px-4 py-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm font-medium text-foreground underline underline-offset-2 hover:text-primary"
                  >
                    {r.title}
                  </a>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.note}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
