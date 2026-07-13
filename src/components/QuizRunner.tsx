import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/data/cdt";

export function QuizRunner({
  questions,
  explanations,
}: {
  questions: QuizQuestion[];
  /** Optional per-question explanation (first key_fact of the parent item). */
  explanations?: (string | undefined)[];
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState<{ q: QuizQuestion; picked: number }[]>([]);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const q = questions[idx];
  const explanation = useMemo(() => explanations?.[idx], [explanations, idx]);

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) {
      setScore((s) => s + 1);
    } else {
      setMisses((m) => [...m, { q, picked: i }]);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  useEffect(() => {
    if (total === 0 || done) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      if (picked === null) {
        if (e.key === "1") handlePick(0);
        else if (e.key === "2" && q.options.length > 1) handlePick(1);
        else if (e.key === "3" && q.options.length > 2) handlePick(2);
        else if (e.key === "4" && q.options.length > 3) handlePick(3);
      } else {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [picked, idx, done, total, q]);

  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No quiz questions for this item.</p>;
  }

  if (done) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">Quiz complete</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You scored {score} of {total}.
          </p>
        </div>
        {misses.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Missed questions
            </h4>
            {misses.map((m, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium">{m.q.question}</p>
                <p className="mt-2 text-sm text-destructive">
                  Your answer: {m.q.options[m.picked]}
                </p>
                <p className="mt-1 text-sm text-success">Correct: {m.q.options[m.q.answer]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-success">Perfect score — all correct.</p>
        )}
        <Button
          onClick={() => {
            setIdx(0);
            setPicked(null);
            setScore(0);
            setMisses([]);
            setDone(false);
          }}
          className="h-12"
        >
          Restart quiz
        </Button>
      </motion.div>
    );
  }

  const isCorrect = picked !== null && picked === q.answer;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {idx + 1} of {total}
        </span>
        <span>Score: {score}</span>
      </div>

      <motion.div 
        key={idx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <p className="text-base font-medium leading-relaxed sm:text-lg">{q.question}</p>
      </motion.div>

      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const selected = picked === i;
          const revealCorrect = picked !== null && i === q.answer;
          const revealWrong = selected && i !== q.answer;
          return (
            <button
              key={i}
              type="button"
              disabled={picked !== null}
              onClick={() => handlePick(i)}
              className={cn(
                "group flex items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all",
                "min-h-11 relative overflow-hidden",
                picked === null
                  ? "border-border bg-card hover:border-primary/40 hover:bg-accent"
                  : "cursor-default",
                revealCorrect && "border-success bg-success/10 text-success-foreground",
                revealWrong && "border-destructive bg-destructive/10 text-destructive",
                picked !== null && !selected && !revealCorrect && "opacity-60",
              )}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold text-center">
                {i + 1}
              </span>
              <span className="flex-1 z-10">{opt}</span>
              {revealCorrect ? <Check className="h-5 w-5 shrink-0 text-success z-10" /> : null}
              {revealWrong ? <X className="h-5 w-5 shrink-0 text-destructive z-10" /> : null}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked !== null ? (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "rounded-lg border p-4 text-sm overflow-hidden",
              isCorrect
                ? "border-success/40 bg-success/10 text-success-foreground"
                : "border-destructive/40 bg-destructive/10 text-destructive",
            )}
          >
            <p className="font-semibold">{isCorrect ? "Correct" : "Not quite"}</p>
            {explanation ? <p className="mt-1 text-foreground/80">{explanation}</p> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {picked !== null ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Button
              className="h-12 w-full mt-2"
              onClick={handleNext}
            >
              {idx + 1 >= total ? "See results" : "Next question (Space)"}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
