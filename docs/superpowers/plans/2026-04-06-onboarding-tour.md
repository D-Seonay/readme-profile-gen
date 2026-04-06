# Interactive Onboarding Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a Guided Console onboarding tour at the bottom of the editor to guide first-time users.

**Architecture:**
- Tour state management in `store/useReadmeStore.ts`.
- A dedicated `OnboardingTour` component for the Guided Console UI.
- Context-aware highlighting in editor components based on the active tour step.

**Tech Stack:** React, Next.js (App Router), Zustand (state), Framer Motion (animations), Tailwind CSS.

---

### Task 1: State & Translations

**Files:**
- Modify: `store/useReadmeStore.ts`
- Modify: `lib/translations.ts`

- [x] **Step 1: Add tour state to Zustand store**

Update `ReadmeState` interface and `initialState` in `store/useReadmeStore.ts`:
```typescript
interface ReadmeState {
  // ... existing
  isTourActive: boolean;
  currentTourStep: number;
  hasCompletedTour: boolean;
  setTourActive: (active: boolean) => void;
  setTourStep: (step: number) => void;
  completeTour: () => void;
}

const initialState = {
  // ... existing
  isTourActive: false,
  currentTourStep: 0,
  hasCompletedTour: false,
};
```
Add actions to `useReadmeStore`:
```typescript
setTourActive: (isTourActive) => set({ isTourActive }),
setTourStep: (currentTourStep) => set({ currentTourStep }),
completeTour: () => set({ isTourActive: false, hasCompletedTour: true }),
```

- [x] **Step 2: Add tour translations**

Update `lib/translations.ts` with a `tour` section:
```typescript
// en:
tour: {
  skip: "SKIP",
  next: "NEXT",
  finish: "FINISH",
  step1: "START HERE: Enter your GitHub username to auto-fill your profile.",
  step2: "THE FLEX: Drag and drop to reorder your README sections.",
  step3: "THE RESULT: Check the live preview and copy your markdown code."
},
// fr:
tour: {
  skip: "PASSER",
  next: "SUIVANT",
  finish: "TERMINER",
  step1: "COMMENCE ICI : Entre ton pseudo GitHub pour auto-remplir ton profil.",
  step2: "LA FLEX : Glisse-dépose pour réorganiser tes sections.",
  step3: "LE RÉSULTAT : Vérifie l'aperçu et copie ton code markdown."
}
```

- [x] **Step 3: Commit**

```bash
git add store/useReadmeStore.ts lib/translations.ts
git commit -m "feat: add onboarding tour state and translations"
```

### Task 2: OnboardingTour Component

**Files:**
- Create: `components/OnboardingTour.tsx`

- [x] **Step 1: Implement the Guided Console UI**

Create `components/OnboardingTour.tsx` using `framer-motion` for animations.

```tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const OnboardingTour = () => {
  const { isTourActive, currentTourStep, setTourStep, completeTour } = useReadmeStore();
  const { t } = useTranslation();

  const steps = [t.tour.step1, t.tour.step2, t.tour.step3];

  if (!isTourActive) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 w-1/2 p-6 z-[100] pointer-events-none"
    >
      <div className="bg-zinc-950/90 border border-indigo-500/50 backdrop-blur-md rounded-xl p-4 flex items-center justify-between shadow-[0_0_30px_rgba(99,102,241,0.2)] pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">Step 0{currentTourStep + 1}</span>
          <p className="text-xs font-mono text-zinc-100">{steps[currentTourStep]}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={completeTour} className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors">
            {t.tour.skip}
          </button>
          <button 
            onClick={() => currentTourStep < 2 ? setTourStep(currentTourStep + 1) : completeTour()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-mono px-4 py-2 rounded uppercase tracking-widest transition-all"
          >
            {currentTourStep < 2 ? t.tour.next : t.tour.finish}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
```

- [x] **Step 2: Commit**

```bash
git add components/OnboardingTour.tsx
git commit -m "feat: create OnboardingTour component"
```

### Task 3: Integration & Highlighting

**Files:**
- Modify: `app/builder/page.tsx`
- Modify: `components/GithubProfileFetcher.tsx`
- Modify: `components/LayoutManager.tsx`
- Modify: `components/PreviewPane.tsx`

- [ ] **Step 1: Trigger tour on first visit**

In `app/builder/page.tsx`, use `useEffect` to start the tour if `hasCompletedTour` is false.

- [ ] **Step 2: Add highlighting logic to target components**

Update `GithubProfileFetcher.tsx` (Step 1):
```tsx
const { isTourActive, currentTourStep } = useReadmeStore();
const isHighlighted = isTourActive && currentTourStep === 0;
// Add class: isHighlighted ? 'ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-50' : ''
```
Update `LayoutManager.tsx` (Step 2):
```tsx
const isHighlighted = isTourActive && currentTourStep === 1;
```
Update `PreviewPane.tsx` (Step 3):
```tsx
const isHighlighted = isTourActive && currentTourStep === 2;
```

- [ ] **Step 3: Commit**

```bash
git add app/builder/page.tsx components/GithubProfileFetcher.tsx components/LayoutManager.tsx components/PreviewPane.tsx
git commit -m "feat: integrate tour logic and highlighting in components"
```

### Task 4: Final Verification

- [ ] **Step 1: Run build**

Run: `npm run build`

- [ ] **Step 2: Verify persistence**

Complete the tour, refresh, and ensure it doesn't reappear.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-04-06-onboarding-tour.md
git commit -m "docs: finalize onboarding tour implementation plan"
```
