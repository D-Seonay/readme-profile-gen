# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a visually stunning, SEO-friendly landing page at the root `/` with the "Indigo Glow" aesthetic, directing users to the `/builder` app.

**Architecture:**
- New `app/page.tsx` as the landing page entry.
- Modular components in `components/landing/` for maintainability.
- `framer-motion` for "stealth" animations and glow effects.
- Enhanced metadata in `app/layout.tsx` for better SEO and social sharing.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Framer Motion, Zustand (store), Lucide React (for icons, if not present I will use native SVG).

---

### Task 1: Setup & Translations

**Files:**
- Modify: `package.json`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Install framer-motion**

Run: `npm install framer-motion`

- [ ] **Step 2: Add landing page translations**

Add a `landing` section to both `en` and `fr` in `lib/translations.ts`.

```typescript
// en:
landing: {
  hero: {
    tagline: "The last GitHub profile generator you'll ever need.",
    subtitle: "Design an exceptional developer brand in seconds.",
    cta: "Start Building for Free"
  },
  features: {
    autofill: { title: "Smart Auto-fill", desc: "Scan profile & repositories." },
    dragdrop: { title: "Drag & Drop UX", desc: "Fluid reordering of sections." },
    livepreview: { title: "Live Preview", desc: "Instant feedback on every change." }
  },
  howItWorks: {
    step1: { title: "1. Enter Username", desc: "Magic scanning begins." },
    step2: { title: "2. Customize", desc: "Drag, drop, and style." },
    step3: { title: "3. Copy & Paste", desc: "Your README is ready." }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json lib/translations.ts
git commit -m "feat: setup landing translations and framer-motion"
```

### Task 2: Landing Navbar

**Files:**
- Create: `components/landing/LandingNavbar.tsx`

- [ ] **Step 1: Implement LandingNavbar**

Create a sticky navbar with a minimal logo, language switcher (reusing `LanguageSwitcher` if possible), and a "Launch App" button.

```tsx
'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export const LandingNavbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
      <div className="text-xl font-black italic tracking-tighter uppercase">
        Readme <span className="text-zinc-500">Gen</span>
      </div>
      <div className="flex items-center gap-6">
        <LanguageSwitcher />
        <Link href="/builder" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-mono text-xs uppercase tracking-widest transition-all">
          Launch App
        </Link>
      </div>
    </nav>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add components/landing/LandingNavbar.tsx
git commit -m "feat: add landing navbar"
```

### Task 3: Hero Section & Visual Preview

**Files:**
- Create: `components/landing/HeroSection.tsx`
- Create: `components/landing/VisualPreview.tsx`

- [ ] **Step 1: Implement HeroSection with Framer Motion**

Add the main heading with a subtle glow and slow entry animations.

- [ ] **Step 2: Implement VisualPreview**

Create a component that shows a "floating" README mockup with glowing indigo borders.

- [ ] **Step 3: Commit**

```bash
git add components/landing/HeroSection.tsx components/landing/VisualPreview.tsx
git commit -m "feat: add hero section and visual preview"
```

### Task 4: Features & How It Works

**Files:**
- Create: `components/landing/FeaturesGrid.tsx`
- Create: `components/landing/HowItWorks.tsx`

- [ ] **Step 1: Implement FeaturesGrid**

Use a 3-column grid with cards that have a hover "glow" effect.

- [ ] **Step 2: Implement HowItWorks**

Show the 3 steps with connecting lines or visual flow.

- [ ] **Step 3: Commit**

```bash
git add components/landing/FeaturesGrid.tsx components/landing/HowItWorks.tsx
git commit -m "feat: add features and how-it-works sections"
```

### Task 5: Main Page & SEO

**Files:**
- Create: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create app/page.tsx**

Combine all landing components into the main entry.

- [ ] **Step 2: Update SEO Metadata in app/layout.tsx**

Enhance keywords and descriptions for better search ranking.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: complete landing page and update SEO metadata"
```

### Task 6: Final Verification

- [ ] **Step 1: Run build to ensure no errors**

Run: `npm run build`

- [ ] **Step 2: Check visual alignment and responsiveness**

Verify the page looks good on mobile and desktop.
