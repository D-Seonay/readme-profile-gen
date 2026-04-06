# Design Spec: Keyboard Shortcuts (UX Optimization)

## 1. Overview
The goal is to implement a set of keyboard shortcuts to speed up the developer workflow within the "Ultimate README Gen". This includes common actions like copying the markdown, downloading the file, focusing the onboarding input, and toggling UI settings (Theme and Language).

## 2. Shortcuts List
| Action | Shortcut (macOS) | Shortcut (Win/Linux) | Trigger |
| :--- | :--- | :--- | :--- |
| **Copy Markdown** | `Cmd + C` | `Ctrl + C` | `copyToClipboard()` |
| **Download README** | `Cmd + S` | `Ctrl + S` | `downloadMarkdown()` |
| **Focus Onboarding** | `Cmd + K` | `Ctrl + K` | Focus `GithubProfileFetcher` input |
| **Toggle UI Theme** | `Cmd + T` | `Ctrl + T` | `toggleUITheme()` |
| **Toggle Language** | `Cmd + L` | `Ctrl + L` | `toggleLanguage()` |

## 3. Technical Implementation
- **Library:** `react-hotkeys-hook`. This library handles platform-agnostic modifier keys (`mod` for Cmd/Ctrl) and automatically ignores shortcuts when an input field is focused.
- **Hook:** Create a custom hook `hooks/useKeyboardShortcuts.ts` to centralize all shortcut logic.
- **Visual Feedback:** 
  - Use existing `sonner` toasts to provide feedback (e.g., "Copied to clipboard (Cmd+C)").
  - Add a subtle glow/pulse effect to the target component when focused (for `Cmd+K`).

## 4. UI/UX Considerations
- **Prevent Default:** Use `preventDefault: true` for shortcuts like `Cmd+S` to override browser behavior.
- **Input Exclusion:** Ensure shortcuts like `Cmd+C` don't interfere with normal text selection and copying *within* an input field. `react-hotkeys-hook` handles this by default for `input`, `textarea`, and `contenteditable`.
- **Accessibility:** Ensure the shortcuts are documented in a way that users can find them (e.g., in a footer or a help tooltip).

## 5. Integration
- The `useKeyboardShortcuts` hook will be initialized in the main `Layout` or `App` component.
- It will interact with the `useReadmeStore` for state-driven actions (Toggle Theme, Toggle Language).
- It will interact with DOM refs for focusing specific components (Smart Onboarding).
