import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { domains } from "@/data/cdt";

export type Mastery = "mastered" | "review";
export type State = Record<string, Mastery>;

type ProgressCtx = {
  getMastery: (key: string) => Mastery | undefined;
  markCard: (key: string, m: Mastery) => void;
  domainMasteryPct: (domainId: string) => number;
  exportProgress: () => string;
  importProgress: (json: string) => boolean;
};

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("cdt_study_progress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("cdt_study_progress", JSON.stringify(state));
  }, [state]);

  const markCard = useCallback((key: string, m: Mastery) => {
    setState((s) => ({ ...s, [key]: m }));
  }, []);

  const getMastery = useCallback((key: string) => state[key], [state]);

  const domainMasteryPct = useCallback(
    (domainId: string) => {
      const d = domains.find((x) => x.id === domainId);
      if (!d) return 0;
      let total = 0;
      let mastered = 0;
      for (const it of d.items) {
        for (let i = 0; i < it.flashcards.length; i++) {
          total++;
          const k = `${domainId}:${it.id}:${i}`;
          if (state[k] === "mastered") mastered++;
        }
      }
      return total === 0 ? 0 : Math.round((mastered / total) * 100);
    },
    [state],
  );

  const exportProgress = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importProgress = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === "object" && parsed !== null) {
        setState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({ getMastery, markCard, domainMasteryPct, exportProgress, importProgress }),
    [getMastery, markCard, domainMasteryPct, exportProgress, importProgress],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProgress must be used inside ProgressProvider");
  return c;
}

export function cardKey(domainId: string, itemId: string, idx: number) {
  return `${domainId}:${itemId}:${idx}`;
}
