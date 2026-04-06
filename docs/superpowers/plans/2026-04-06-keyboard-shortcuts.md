# Keyboard Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a set of keyboard shortcuts (Copy, Download, Focus Onboarding, Toggle Theme, Toggle Language) to optimize UX.

**Architecture:**
- Use `react-hotkeys-hook` for shortcut handling.
- Centralized `hooks/useKeyboardShortcuts.ts` for shortcut definitions.
- Integration in `app/builder/page.tsx` or a top-level layout.

**Tech Stack:** React, Next.js (App Router), Zustand (state), `react-hotkeys-hook`.

---

### Task 1: Setup & Hook Infrastructure ✅

**Files:**
- Modify: `package.json`
- Create: `hooks/useKeyboardShortcuts.ts`

- [x] **Step 1: Install react-hotkeys-hook**
- [x] **Step 2: Create useKeyboardShortcuts hook**
- [x] **Step 3: Commit**

### Task 2: Store Update & Integration ✅

**Files:**
- Modify: `store/useReadmeStore.ts`
- Modify: `app/builder/page.tsx`
- Modify: `components/PreviewPane.tsx`

- [x] **Step 1: Add toggleUITheme to store**
- [x] **Step 2: Integrate shortcuts in the Builder page**
- [x] **Step 3: Commit**

### Task 3: Final Verification & UX Polish ✅

- [x] **Step 1: Run build**
- [x] **Step 2: Verify all shortcuts**
- [x] **Step 3: Commit**
