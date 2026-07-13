## CDT Competency Study App

Build a mobile-friendly, client-side study app from `cdt_study_data.json`. All content rendered verbatim from the file — no invented clinical content.

### Data setup
- Copy `cdt_study_data.json` to `src/data/cdt_study_data.json` and import as the single source of truth.
- Add a lightweight typed wrapper (`src/data/cdt.ts`) exposing `domains`, `rapid_recall`, `reference_tables`, `assessor_probe_questions`.

### Progress state
- Session-scoped React context (`ProgressProvider`) tracking flashcard mastery keyed by `domainId:itemId:cardIndex` → `"mastered" | "review"`. No localStorage (per prompt).
- Exposes `markCard`, `getMastery`, and `domainMasteryPct(domainId)`.

### Routes (TanStack Start, file-based)
- `/` — Home: 4 domain cards (count + mastery %), prominent buttons for Rapid Recall, Assessor Probe Q&A, and a global search bar.
- `/search?q=` — filters item titles + key_facts, links to items.
- `/domain/$domainId` — list of item titles.
- `/domain/$domainId/item/$itemId` — tabs: Overview / Flashcards / Quiz. Sources as footer.
- `/rapid-recall` — two-column compact list + reference tables below.
- `/probe` — flashcard-style Q&A over `assessor_probe_questions`.

Each route sets its own head() title/description. `__root.tsx` gets an app-appropriate title/description replacing the Lovable defaults.

### Screens / components
- `DomainCard`, `ItemListRow`, `Tabs` (shadcn), `Flashcard` (flip on tap, Got it / Review again), `QuizRunner` (one Q at a time, immediate feedback using matching item's first key_fact as explanation, running score, end summary of misses), `RapidRecallTable`, `ReferenceTable`, `ProbeDeck`, `SearchBar`.
- Pitfalls rendered in an amber warning callout (icon + border + bg) — visually distinct from key facts, which use plain list styling. This is called out because it's the highest-value exam content.

### Design system
Calm clinical palette in `src/styles.css` (semantic tokens only, oklch):
- Background near-white, slate foreground, primary calm blue, warning amber for pitfalls, success green for "Got it", muted slate for secondary text.
- Large tap targets (min 44px), generous spacing, high contrast, system-ui font stack — legibility over polish.

### Out of scope for v1
No auth, no backend, no persistence beyond session, no PDF export.

### Technical notes
- Pure client rendering; no server functions needed.
- Fuzzy-free search: lowercase substring match over title + joined key_facts.
- Quiz `answer` is the index into `options`.
- Update `__root.tsx` metadata; leave `<Outlet />` intact.
