import { useState } from "react";
import type { ProbeQA } from "@/data/cdt";
import { Button } from "@/components/ui/button";

export function ProbeDeck({ items }: { items: ProbeQA[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!items.length) return null;
  const qa = items[idx];
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs text-muted-foreground">
        Probe {idx + 1} of {items.length}
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-72 w-full flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-primary/40"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {flipped ? "Model answer" : "Assessor asks"}
        </span>
        <p className="text-base leading-relaxed sm:text-lg">
          {flipped ? qa.model_answer : qa.question}
        </p>
        <span className="mt-auto text-xs text-muted-foreground">
          Tap to {flipped ? "see question" : "reveal model answer"}
        </span>
      </button>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-12"
          disabled={idx === 0}
          onClick={() => {
            setIdx((i) => Math.max(0, i - 1));
            setFlipped(false);
          }}
        >
          Previous
        </Button>
        <Button
          className="h-12"
          onClick={() => {
            setIdx((i) => (i + 1) % items.length);
            setFlipped(false);
          }}
        >
          {idx === items.length - 1 ? "Restart" : "Next"}
        </Button>
      </div>
    </div>
  );
}
