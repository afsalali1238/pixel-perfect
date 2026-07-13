import { AlertTriangle } from "lucide-react";

export function PitfallCallout({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-lg border-2 border-warning bg-warning-soft p-4">
      <div className="mb-2 flex items-center gap-2 text-warning-foreground">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="text-sm font-semibold uppercase tracking-wide">Exam Traps / Pitfalls</h3>
      </div>
      <ul className="space-y-2 text-sm leading-relaxed text-warning-foreground">
        {items.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
