import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { Flashcard as FC } from "@/data/cdt";
import { useProgress, cardKey, type Mastery } from "@/lib/progress";

export function FlashcardDeck({
  cards,
  keyFor,
}: {
  cards: FC[];
  keyFor?: (idx: number) => string;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const progress = keyFor ? useProgress() : null;

  if (cards.length === 0) {
    return <p className="text-sm text-muted-foreground">No flashcards for this item.</p>;
  }

  const card = cards[idx];
  const isLast = idx === cards.length - 1;
  const mastery = keyFor && progress ? progress.getMastery(keyFor(idx)) : undefined;

  const advance = (m?: Mastery) => {
    if (m && keyFor && progress) progress.markCard(keyFor(idx), m);
    if (isLast) {
      setIdx(0);
    } else {
      setIdx((i) => i + 1);
    }
    setFlipped(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Card {idx + 1} of {cards.length}
        </span>
        {mastery ? (
          <span
            className={
              mastery === "mastered"
                ? "font-medium text-success"
                : "font-medium text-warning-foreground"
            }
          >
            {mastery === "mastered" ? "Marked: Got it" : "Marked: Review"}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="group relative flex min-h-64 w-full items-center justify-center rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm transition hover:border-primary/40"
      >
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {flipped ? "Answer" : "Question"}
          </span>
          <p className="text-lg leading-relaxed sm:text-xl">
            {flipped ? card.back : card.front}
          </p>
          <span className="mt-2 text-xs text-muted-foreground">
            Tap to {flipped ? "see question" : "reveal answer"}
          </span>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          onClick={() => advance("review")}
          variant="outline"
          className="h-12 border-warning text-warning-foreground hover:bg-warning-soft"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Review again
        </Button>
        <Button
          type="button"
          onClick={() => advance("mastered")}
          className="h-12 bg-success text-success-foreground hover:bg-success/90"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
