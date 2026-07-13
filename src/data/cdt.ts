import data from "./cdt_study_data.json";

export type Flashcard = { front: string; back: string };
export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};
export type Item = {
  id: string;
  title: string;
  key_facts: string[];
  pitfalls: string[];
  sources: string[];
  flashcards: Flashcard[];
  quiz_questions: QuizQuestion[];
};
export type Domain = {
  id: string;
  name: string;
  items: Item[];
};
export type RapidRecall = { item: string; fact: string };
export type ReferenceTable = {
  title: string;
  columns: string[];
  rows: string[][];
};
export type ProbeQA = { question: string; model_answer: string };
export type FurtherReading = { domain: string; title: string; url: string; note: string };

type CDT = {
  domains: Domain[];
  rapid_recall: RapidRecall[];
  reference_tables: ReferenceTable[];
  assessor_probe_questions: ProbeQA[];
  further_reading: FurtherReading[];
};

const cdt = data as CDT;

export const domains = cdt.domains;
export const rapidRecall = cdt.rapid_recall;
export const referenceTables = cdt.reference_tables;
export const probeQuestions = cdt.assessor_probe_questions;
export const furtherReading = cdt.further_reading;

export function getDomain(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}
export function getItem(
  domainId: string,
  itemId: string,
): { domain: Domain; item: Item } | undefined {
  const domain = getDomain(domainId);
  const item = domain?.items.find((i) => i.id === itemId);
  if (!domain || !item) return undefined;
  return { domain, item };
}

export type SearchHit = {
  domainId: string;
  domainName: string;
  itemId: string;
  itemTitle: string;
  snippet?: string;
};

export function searchItems(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const d of domains) {
    for (const it of d.items) {
      const titleMatch = it.title.toLowerCase().includes(q);
      const factHit = it.key_facts.find((f) => f.toLowerCase().includes(q));
      const pitfallHit = it.pitfalls.find((p) => p.toLowerCase().includes(q));
      if (titleMatch || factHit || pitfallHit) {
        hits.push({
          domainId: d.id,
          domainName: d.name,
          itemId: it.id,
          itemTitle: it.title,
          snippet: !titleMatch ? (factHit ?? pitfallHit) : undefined,
        });
      }
    }
  }
  return hits;
}
