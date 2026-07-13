import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
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

  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No quiz questions for this item.</p>;
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
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
                <p className="mt-1 text-sm text-success">
                  Correct: {m.q.options[m.q.answer]}
                </p>
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
      </div>
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

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-base font-medium leading-relaxed sm:text-lg">{q.question}</p>
      </div>

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
              onClick={() => {
                setPicked(i);
                if (i === q.answer) {
                  setScore((s) => s + 1);
                } else {
                  setMisses((m) => [...m, { q, picked: i }]);
                }
              }}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left text-sm transition",
                "min-h-11",
                picked === null
                  ? "border-border bg-card hover:border-primary/40 hover:bg-accent"
                  : "cursor-default",
                revealCorrect && "border-success bg-success/10 text-success-foreground",
                revealWrong && "border-destructive bg-destructive/10 text-destructive",
                picked !== null && !selected && !revealCorrect && "opacity-60",
              )}
            >
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-current text-[11px] font-semibold leading-5 text-center">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {revealCorrect ? <Check className="h-5 w-5 shrink-0 text-success" /> : null}
              {revealWrong ? <X className="h-5 w-5 shrink-0 text-destructive" /> : null}
            </button>
          );
        })}
      </div>

      {picked !== null ? (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm",
            isCorrect
              ? "border-success/40 bg-success/10 text-success-foreground"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          <p className="font-semibold">{isCorrect ? "Correct" : "Not quite"}</p>
          {explanation ? <p className="mt-1 text-foreground/80">{explanation}</p> : null}
        </div>
      ) : null}

      {picked !== null ? (
        <Button
          className="h-12"
          onClick={() => {
            if (idx + 1 >= total) {
              setDone(true);
            } else {
              setIdx((i) => i + 1);
              setPicked(null);
            }
          }}
        >
          {idx + 1 >= total ? "See results" : "Next question"}
        </Button>
      ) : null}
    </div>
  );
}
