import { createFileRoute, notFound } from "@tanstack/react-router";
import { getItem } from "@/data/cdt";
import { PageShell } from "@/components/PageShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PitfallCallout } from "@/components/PitfallCallout";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { QuizRunner } from "@/components/QuizRunner";
import { cardKey } from "@/lib/progress";

export const Route = createFileRoute("/domain/$domainId_/item/$itemId")({
  loader: ({ params }) => {
    const res = getItem(params.domainId, params.itemId);
    if (!res) throw notFound();
    return res;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.item.title} — CDT Study` : "Topic" },
      {
        name: "description",
        content: loaderData
          ? (loaderData.item.key_facts[0] ?? loaderData.item.title)
          : "CDT study topic",
      },
    ],
  }),
  component: ItemView,
  notFoundComponent: () => (
    <PageShell title="Not found" back={{ to: "/" }}>
      <p className="text-sm text-muted-foreground">This topic doesn't exist.</p>
    </PageShell>
  ),
});

function ItemView() {
  const { domain, item } = Route.useLoaderData();
  const explanations = item.quiz_questions.map(() => item.key_facts[0]);
  return (
    <PageShell title={item.title} back={{ to: "/domain/$domainId", label: domain.name }}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flashcards">
            Flashcards
            <span className="ml-1 text-[10px] text-muted-foreground">{item.flashcards.length}</span>
          </TabsTrigger>
          <TabsTrigger value="quiz">
            Quiz
            <span className="ml-1 text-[10px] text-muted-foreground">
              {item.quiz_questions.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Key facts
            </h2>
            <ul className="space-y-2 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-card-foreground">
              {item.key_facts.map((f: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <PitfallCallout items={item.pitfalls} />

          {item.sources.length ? (
            <footer className="border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Sources
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {item.sources.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </footer>
          ) : null}
        </TabsContent>

        <TabsContent value="flashcards" className="mt-6">
          <FlashcardDeck
            cards={item.flashcards}
            keyFor={(idx) => cardKey(domain.id, item.id, idx)}
          />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <QuizRunner questions={item.quiz_questions} explanations={explanations} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
