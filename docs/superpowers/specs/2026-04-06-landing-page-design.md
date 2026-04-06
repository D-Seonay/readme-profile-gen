# Design Spec: Landing Page (Indigo Glow)

## 1. Overview
The goal is to implement a high-visibility landing page for "Ultimate README Gen" at the root URL (`/`). This page will serve as the primary entry point for users, improving SEO and providing a clear value proposition before directing them to the actual generator (`/builder`).

## 2. Visual Style: "Indigo Glow"
- **Background:** `zinc-950` (Deep Black).
- **Typography:** `font-black`, `font-mono` for technical feel, `italic` comments.
- **Accents:** Indigo gradients (`indigo-500`, `indigo-600`) and glowing effects.
- **Animations:** Slow "stealth" entries using `framer-motion`.
- **Whitespace:** Extreme whitespace to emphasize content.

## 3. Architecture & Routing
- **Framework:** Next.js (App Router).
- **Routing:**
  - `app/page.tsx`: Landing Page (English by default, detects language or provides toggle).
  - `app/builder/page.tsx`: Existing Generator.
- **Internationalization:** Extend `lib/translations.ts` with a new `landing` section.

## 4. Page Sections (Order)
1. **Navbar:** Minimal logo, Language Switcher, "Go to App" button.
2. **Hero Section:**
   - Tagline: "The last GitHub profile generator you'll ever need."
   - Subtitle: "Design an exceptional developer brand in seconds."
   - CTA: "Start Building for Free" (links to `/builder`).
3. **Visual Preview:** A glowing, high-fidelity mockup of a generated README profile.
4. **Features Grid (3 columns):**
   - **Smart Auto-fill:** Scan profile & repositories.
   - **Drag & Drop UX:** Fluid reordering of sections.
   - **Live Preview:** Instant feedback on every change.
5. **How It Works (Horizontal Steps):**
   - 1. Enter Username.
   - 2. Customize Sections.
   - 3. Copy & Paste.
6. **Tech Stack / Credibility:** Logos of supported integrations (GitHub, WakaTime, Spotify).
7. **Footer:** Links to GitHub, Developer portfolio, and legal/info.

## 5. Technical Details
- **Library:** Add `framer-motion` for animations.
- **Components:** Create reusable landing components in `components/landing/`.
- **State:** Use existing `useReadmeStore` only if needed (e.g., to pre-fill from landing page input).

## 6. SEO Strategy
- Use semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`).
- Optimize `metadata` in `app/layout.tsx` to include rich snippets for the landing page.
- Add OpenGraph images and Twitter cards.
