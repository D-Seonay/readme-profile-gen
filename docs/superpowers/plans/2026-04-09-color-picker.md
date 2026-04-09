# Interactive Color Picker Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clickable color picker to the dynamic text section of the README generator.

**Architecture:** Modify the `TypingConfig` component to include a hidden native `<input type="color">` that is triggered when the user clicks the color preview square.

**Tech Stack:** React, Tailwind CSS, Zustand (Store).

---

### Task 1: TypingConfig Component Update

**Files:**
- Modify: `components/TypingConfig.tsx`

- [ ] **Step 1: Locate the color preview square**

In `components/TypingConfig.tsx`, find the `div` responsible for the color preview (around line 72).

- [ ] **Step 2: Add the interactive color picker**

Replace the preview `div` with a relative container containing the hidden color input.

```tsx
<div className="relative w-8 h-8 rounded-lg border border-zinc-800 shadow-inner overflow-hidden">
  <div 
    className="w-full h-full" 
    style={{ backgroundColor: `#${displayColor}` }} 
  />
  <input 
    type="color"
    value={`#${displayColor.length === 6 ? displayColor : '000000'}`}
    onChange={(e) => setTypingColor(e.target.value.replace('#', ''))}
    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
    title="Pick a color"
  />
</div>
```

*Note: Ensure `displayColor` is handled correctly. If it's empty or invalid, the native picker might not behave as expected, so a fallback is provided.*

- [ ] **Step 3: Verify visually in the browser**

Run the app and check that:
1. Clicking the square opens the system color picker.
2. Selecting a color updates both the hex input field and the square's color.
3. The typing SVG preview updates with the new color.

- [ ] **Step 4: Commit the changes**

```bash
git add components/TypingConfig.tsx
git commit -m "feat: add interactive color picker to typing config"
```
