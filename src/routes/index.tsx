import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Zap, MessagesSquare, ArrowRight } from "lucide-react";
import { domains } from "@/data/cdt";
import { useProgress } from "@/lib/progress";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CDT Study — Home" },
      {
        name: "description",
        content:
          "Study hub for the Complete Decongestive Therapy competency exam: 4 domains of flashcards, quizzes, rapid recall and assessor probe Q&A.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const progress = useProgress();

  return (
    <PageShell title="CDT Study">
      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics, facts, pitfalls…"
            className="h-12 pl-9"
            aria-label="Search"
          />
        </div>
      </form>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/rapid-recall"
          className="group flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 p-4 transition hover:border-primary hover:bg-primary/10"
        >
          <Zap className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <div className="font-semibold text-foreground">Rapid Recall</div>
            <div className="text-xs text-muted-foreground">One-page cheat sheet</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
        <Link
          to="/probe"
          className="group flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 p-4 transition hover:border-primary hover:bg-primary/10"
        >
          <MessagesSquare className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <div className="font-semibold text-foreground">Assessor Probe Q&amp;A</div>
            <div className="text-xs text-muted-foreground">Rehearse spoken answers</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Domains
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {domains.map((d) => {
          const pct = progress.domainMasteryPct(d.id);
          return (
            <Link
              key={d.id}
              to="/domain/$domainId"
              params={{ domainId: d.id }}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-card-foreground">
                  {d.name}
                </h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {d.items.length} topics
                </span>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Flashcards mastered</span>
                  <span className="font-medium text-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
