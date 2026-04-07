# Enhanced Introduction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Intro v2" features including 7 structured fields, terminal header integration, and enhanced smart autofill.

**Architecture:**
- Store update: Add new fields to `ReadmeState`.
- Markdown utility: Update `generateMarkdown` to render the new list and terminal header.
- UI: Update `app/builder/page.tsx` (Bio section) to include the new inputs.
- Autofill: Update `fetchGithubUserData` with enhanced Regex parsing.

**Tech Stack:** Next.js, Zustand, Tailwind CSS, Markdown.

---

### Task 1: Store & Translations

**Files:**
- Modify: `store/useReadmeStore.ts`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add new fields to Zustand store**

Update `ReadmeState` and `initialState`:
`workingOn`, `learning`, `collaborateOn`, `askMeAbout`, `reachMe`, `funFact`, `location`.

- [ ] **Step 2: Add translations for new fields**

Add `intro` section to `lib/translations.ts` (labels and placeholders in EN/FR).

- [ ] **Step 3: Commit**

```bash
git add store/useReadmeStore.ts lib/translations.ts
git commit -m "feat: add structured intro fields to store and translations"
```

### Task 2: Markdown Generation Logic

**Files:**
- Modify: `utils/generateMarkdown.ts`

- [ ] **Step 1: Update getBioSection**

Implement the logic to render the "Terminal Header" (if configured) and the "Minimal Icons" list of structured fields.

- [ ] **Step 2: Commit**

```bash
git add utils/generateMarkdown.ts
git commit -m "feat: update markdown generation for enhanced intro"
```

### Task 3: Builder UI Update

**Files:**
- Modify: `app/builder/page.tsx`

- [ ] **Step 1: Implement new inputs in the Bio section**

Add responsive inputs for all 7 new fields with their corresponding icons and translations.

- [ ] **Step 2: Commit**

```bash
git add app/builder/page.tsx
git commit -m "feat: add structured field inputs to builder UI"
```

### Task 4: Smart Autofill Enhancement

**Files:**
- Modify: `store/useReadmeStore.ts`

- [ ] **Step 1: Update fetchGithubUserData with Regex parsing**

Add patterns to detect:
- `🔭 I’m currently working on (.*)`
- `🌱 I’m currently learning (.*)`
- ... and so on.

- [ ] **Step 2: Commit**

```bash
git add store/useReadmeStore.ts
git commit -m "feat: enhance smart autofill to detect intro fields"
```

### Task 5: Final Verification

- [ ] **Step 1: Run build**

Run: `npm run build`

- [ ] **Step 2: Verify generation and autofill**

Test with a known username (e.g., yours) to see if it parses correctly.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-04-06-enhanced-intro.md
git commit -m "docs: finalize enhanced intro implementation plan"
```
