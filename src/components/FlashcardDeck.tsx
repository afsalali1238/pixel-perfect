import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { Flashcard as FC } from "@/data/cdt";
import { useProgress, type Mastery } from "@/lib/progress";

export function FlashcardDeck({
  cards,
  keyFor,
}: {
  cards: FC[];
  keyFor?: (idx: number) => string;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const progress = useProgress();

  const isLast = idx === cards.length - 1;

  const advance = useCallback((m?: Mastery) => {
    if (m && keyFor) progress.markCard(keyFor(idx), m);
    if (isLast) {
      setIdx(0);
    } else {
      setIdx((i) => i + 1);
    }
    setFlipped(false);
  }, [idx, isLast, keyFor, progress]);

  useEffect(() => {
    if (cards.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "1" || e.code === "ArrowLeft") {
        e.preventDefault();
        advance("review");
      } else if (e.key === "2" || e.code === "ArrowRight") {
        e.preventDefault();
        advance("mastered");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advance, cards.length]);

  if (cards.length === 0) {
    return <p className="text-sm text-muted-foreground">No flashcards for this item.</p>;
  }

  const card = cards[idx];
  const mastery = keyFor ? progress.getMastery(keyFor(idx)) : undefined;

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

      <div 
        className="group relative w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="relative w-full rounded-xl border border-border bg-card text-center text-card-foreground shadow-sm transition-colors hover:border-primary/40 grid"
          animate={{ rotateX: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div 
            className="col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center gap-3 p-6 sm:p-8"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Question
            </span>
            <p className="text-lg leading-relaxed sm:text-xl">{card.front}</p>
            <span className="mt-2 text-xs text-muted-foreground">
              Tap or press Space to reveal answer
            </span>
          </div>

          {/* Back */}
          <div 
            className="col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center gap-3 p-6 sm:p-8"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Answer
            </span>
            <p className="text-lg leading-relaxed sm:text-xl">{card.back}</p>
            <span className="mt-2 text-xs text-muted-foreground">
              1 / &larr; to Review | 2 / &rarr; for Got it
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          onClick={() => advance("review")}
          variant="outline"
          className="h-12 border-warning text-warning-foreground hover:bg-warning-soft"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Review again [1]
        </Button>
        <Button
          type="button"
          onClick={() => advance("mastered")}
          className="h-12 bg-success text-success-foreground hover:bg-success/90"
        >
          Got it [2]
        </Button>
      </div>
    </div>
  );
}
