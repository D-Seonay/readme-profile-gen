# STAT-STATS Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate STAT-STATS (GitHub stats cards generator) as a modular feature in `readme-profile-gen`.

**Architecture:** Add STAT-STATS state to Zustand store, create a configuration component with a live SVG preview (using `<object>`), and update the Markdown generator to include the new section.

**Tech Stack:** React, Next.js, Zustand, Tailwind CSS, STAT-STATS API.

---

## Task 1: Store Update

**Files:**
- Modify: `store/useReadmeStore.ts`

- [ ] **Step 1: Add types for STAT-STATS**
Add `StatStatsCard` type and update `ReadmeState` interface.

```typescript
export type StatStatsCard = 'stats' | 'top-langs' | 'streak' | 'top-repos' | 'activity' | 'trophies' | 'org';

interface ReadmeState {
  // ...
  statStatsCards: StatStatsCard[];
  statStatsTheme: string;
  statStatsFont: string;
  statStatsCompact: boolean;
  statStatsHide: string[];
  
  setStatStatsCards: (cards: StatStatsCard[]) => void;
  setStatStatsTheme: (theme: string) => void;
  setStatStatsFont: (font: string) => void;
  toggleStatStatsCompact: () => void;
  setStatStatsHide: (hide: string[]) => void;
}
```

- [ ] **Step 2: Update initial state and actions**
Initialize with empty cards and default theme/font. Implement actions.

- [ ] **Step 3: Update SectionId and DEFAULT_LAYOUT**
Add `statstats` to `SectionId` and `DEFAULT_LAYOUT`.

- [ ] **Step 4: Commit**
```bash
git add store/useReadmeStore.ts
git commit -m "feat: add stat-stats state to store"
```

## Task 2: Translations

**Files:**
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add translations for STAT-STATS section**
Add keys for labels, help text, card types, etc. in both `en` and `fr`.

- [ ] **Step 2: Commit**
```bash
git add lib/translations.ts
git commit -m "feat: add stat-stats translations"
```

## Task 3: Configuration Component

**Files:**
- Create: `components/StatStatsConfig.tsx`

- [ ] **Step 1: Implement the UI for STAT-STATS**
Create a component with multi-select for cards, dropdowns for themes/fonts, and a toggle for compact mode.

- [ ] **Step 2: Add SVG Preview using <object>**
Include a preview section that renders the SVG cards based on selected parameters.

- [ ] **Step 3: Commit**
```bash
git add components/StatStatsConfig.tsx
git commit -m "feat: add StatStatsConfig component"
```

## Task 4: Layout & Builder Integration

**Files:**
- Modify: `components/LayoutManager.tsx`
- Modify: `app/builder/page.tsx`

- [ ] **Step 1: Update LayoutManager to handle 'statstats'**
Update `labels` and `isSectionUsed` in `LayoutManager.tsx`.

- [ ] **Step 2: Register section in builder page**
Add `case 'statstats'` to `renderSection` in `app/builder/page.tsx`.

- [ ] **Step 3: Commit**
```bash
git add components/LayoutManager.tsx app/builder/page.tsx
git commit -m "feat: integrate stat-stats into builder and layout manager"
```

## Task 5: Markdown Generation

**Files:**
- Modify: `utils/generateMarkdown.ts`

- [ ] **Step 1: Implement getStatStatsSection**
Create a function to generate the STAT-STATS Markdown.

- [ ] **Step 2: Add to finalSections**
Update `finalSections` mapping to include `statstats`.

- [ ] **Step 3: Commit**
```bash
git add utils/generateMarkdown.ts
git commit -m "feat: add stat-stats to markdown generator"
```

## Task 6: Verification

- [ ] **Step 1: Test in UI**
Verify that the new section appears in the layout manager and configuration panels.

- [ ] **Step 2: Verify SVG Preview**
Ensure SVGs render correctly with custom fonts using the `<object>` tag.

- [ ] **Step 3: Check Markdown Output**
Verify the generated Markdown matches the expected STAT-STATS URL format.

- [ ] **Step 4: Commit final changes**
```bash
git commit -m "chore: final adjustments for stat-stats integration"
```
