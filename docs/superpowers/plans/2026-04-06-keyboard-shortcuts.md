# Keyboard Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a set of keyboard shortcuts (Copy, Download, Focus Onboarding, Toggle Theme, Toggle Language) to optimize UX.

**Architecture:**
- Use `react-hotkeys-hook` for shortcut handling.
- Centralized `hooks/useKeyboardShortcuts.ts` for shortcut definitions.
- Integration in `app/builder/page.tsx` or a top-level layout.

**Tech Stack:** React, Next.js (App Router), Zustand (state), `react-hotkeys-hook`.

---

### Task 1: Setup & Hook Infrastructure

**Files:**
- Modify: `package.json`
- Create: `hooks/useKeyboardShortcuts.ts`

- [ ] **Step 1: Install react-hotkeys-hook**

Run: `npm install react-hotkeys-hook`

- [ ] **Step 2: Create useKeyboardShortcuts hook**

Implement the hook with placeholders for the actions.

```typescript
import { useHotkeys } from 'react-hotkeys-hook';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

export const useKeyboardShortcuts = (actions: {
  onCopy: () => void;
  onDownload: () => void;
  onFocusOnboarding: () => void;
}) => {
  const { toggleUITheme, setLanguage, language } = useReadmeStore();
  
  // Mod + C: Copy
  useHotkeys('mod+c', (e) => {
    e.preventDefault();
    actions.onCopy();
  });

  // Mod + S: Download
  useHotkeys('mod+s', (e) => {
    e.preventDefault();
    actions.onDownload();
  });

  // Mod + K: Focus Onboarding
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    actions.onFocusOnboarding();
  });

  // Mod + T: Toggle Theme
  useHotkeys('mod+t', (e) => {
    e.preventDefault();
    toggleUITheme(); // Need to check if this action exists in store
    toast.success('Theme toggled');
  });

  // Mod + L: Toggle Language
  useHotkeys('mod+l', (e) => {
    e.preventDefault();
    const nextLang = language === 'en' ? 'fr' : 'en';
    setLanguage(nextLang);
    toast.success(nextLang === 'fr' ? 'Langue changée en Français' : 'Language changed to English');
  });
};
```

- [ ] **Step 3: Commit**

```bash
git add package.json hooks/useKeyboardShortcuts.ts
git commit -m "feat: setup keyboard shortcuts infrastructure"
```

### Task 2: Store Update & Integration

**Files:**
- Modify: `store/useReadmeStore.ts`
- Modify: `app/builder/page.tsx`
- Modify: `components/PreviewPane.tsx` (to export copy/download logic if needed)

- [ ] **Step 1: Add toggleUITheme to store**

Ensure `toggleUITheme` or `setUITheme` is available and works correctly.

- [ ] **Step 2: Integrate shortcuts in the Builder page**

In `app/builder/page.tsx`, initialize the hook and pass the necessary actions. You'll need to use `useRef` to focus the `GithubProfileFetcher`.

- [ ] **Step 3: Commit**

```bash
git add store/useReadmeStore.ts app/builder/page.tsx
git commit -m "feat: integrate keyboard shortcuts in builder page"
```

### Task 3: Final Verification & UX Polish

- [ ] **Step 1: Run build**

Run: `npm run build`

- [ ] **Step 2: Verify all shortcuts**

Test `Mod+C`, `Mod+S`, `Mod+K`, `Mod+T`, `Mod+L` across different operating systems (simulated or verified). Ensure they are ignored when typing in an input.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-04-06-keyboard-shortcuts.md
git commit -m "docs: finalize keyboard shortcuts implementation plan"
```
