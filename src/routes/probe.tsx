import { createFileRoute } from "@tanstack/react-router";
import { probeQuestions } from "@/data/cdt";
import { PageShell } from "@/components/PageShell";
import { ProbeDeck } from "@/components/ProbeDeck";

export const Route = createFileRoute("/probe")({
  head: () => ({
    meta: [
      { title: "Assessor Probe Q&A — CDT Study" },
      {
        name: "description",
        content: "Rehearse spoken answers to common assessor probe questions.",
      },
    ],
  }),
  component: Probe,
});

function Probe() {
  return (
    <PageShell title="Assessor Probe Q&A" back={{ to: "/", label: "Home" }}>
      <p className="mb-4 text-sm text-muted-foreground">
        {probeQuestions.length} probe questions. Read the prompt, say your answer
        out loud, then flip.
      </p>
      <ProbeDeck items={probeQuestions} />
    </PageShell>
  );
}
