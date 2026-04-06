# Design Spec: Interactive Onboarding Tour (Guided Console)

## 1. Overview
The goal is to implement a high-tech, minimal, and non-intrusive interactive tour to guide first-time users through the key features of the "Ultimate README Gen". This tour will use a "Guided Console" approach at the bottom of the editor to provide context-aware instructions.

## 2. Visual Style: "Guided Console"
- **Location:** A fixed/absolute bar at the bottom of the Editor section (left side of the screen).
- **Theme:** `zinc-950` background, `indigo-500` borders, technical typography (`font-mono`, `text-[10px]`).
- **Animations:** 
  - The console itself slides in from the bottom using `framer-motion`.
  - The active section being highlighted will have a pulsing indigo border (`shadow-[0_0_15px_rgba(99,102,241,0.5)]`).
  - Text transitions will be smooth fades.

## 3. Architecture & State
- **Component:** `components/OnboardingTour.tsx`.
- **State Management:** Add to `store/useReadmeStore.ts` or a dedicated `store/useOnboardingStore.ts`.
  - `currentStep`: index of the active step.
  - `isTourActive`: boolean to show/hide the tour.
  - `hasCompletedTour`: boolean persisted in `localStorage`.
- **Logic:** The tour starts automatically on the first visit if `hasCompletedTour` is false.

## 4. Tour Steps (Sequence)
1. **Step 1: Smart Onboarding**
   - **Target:** `GithubProfileFetcher` component.
   - **Instruction:** "START HERE: Enter your GitHub username to auto-fill your profile."
   - **Action:** Highlight the fetcher block.
2. **Step 2: Layout Manager**
   - **Target:** `LayoutManager` component.
   - **Instruction:** "THE FLEX: Drag and drop to reorder your README sections."
   - **Action:** Highlight the layout manager block.
3. **Step 3: Preview & Export**
   - **Target:** `PreviewPane` header/buttons.
   - **Instruction:** "THE RESULT: Check the live preview and copy your markdown code."
   - **Action:** Highlight the action buttons in the preview pane.

## 5. Technical Details
- **Intersection Observer:** Use refs to ensure the console stays synced with scroll positions if needed, though a fixed bar is simpler.
- **Z-Index:** Ensure the console sits above the editor content but below modals.
- **Bilingual:** Add `tour` section to `lib/translations.ts`.
  - `en`: { step1: "...", step2: "...", ... }
  - `fr`: { step1: "...", step2: "...", ... }
- **Persistence:** Use Zustand `persist` middleware to remember if the user skipped or finished the tour.

## 6. Interaction
- **Next Button:** Advances to the next step.
- **Skip Button:** Dismisses the tour entirely and marks it as completed.
- **Finish Button:** Final step completion.
