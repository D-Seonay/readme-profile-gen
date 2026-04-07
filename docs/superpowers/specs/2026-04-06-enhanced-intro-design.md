# Design Spec: Enhanced Introduction Section

## 1. Overview
The goal is to transform the basic "Introduction" section into a more professional and dynamic experience. This includes adding a terminal-style interactive header and a set of structured fields (Working on, Learning, etc.) that are commonly found in high-quality GitHub profiles.

## 2. Interactive Terminal Header
- **Technology:** Integration with `Typing SVG`.
- **Content:** "Hi, I'm [Name]" followed by dynamic taglines (e.g., "Senior Developer", "Open Source Enthusiast").
- **Style:** Technical monospace font, technical colors (Indigo/Zinc), and a blinking cursor effect.

## 3. Structured Fields (Bio v2)
We will add 7 new optional fields to the `useReadmeStore`:
- **🔭 Currently working on** (`workingOn`)
- **🌱 Currently learning** (`learning`)
- **👯 Looking to collaborate on** (`collaborateOn`)
- **💬 Ask me about** (`askMeAbout`)
- **📫 How to reach me** (`reachMe`)
- **⚡ Fun fact** (`funFact`)
- **📍 Location** (`location`)

## 4. Visual Layout: "Minimal Icons"
- **Markdown Output:** A clean vertical list using emojis as icons.
- **Example:**
  ```markdown
  🔭 I’m currently working on **[Project]**
  🌱 I’m currently learning **[Tech]**
  📍 Based in **[City, Country]**
  ```

## 5. Smart Autofill Enhancement
- **GitHub Fetcher:** Update `fetchGithubUserData` to parse these fields from the user's existing `README.md` using Regex patterns (matching common "I'm currently..." phrases).

## 6. UI/UX in the Builder
- **Collapsible Section:** Group these new fields under the "Introduction / Bio" section.
- **Toggle:** Each field will be optional; if empty, it won't appear in the generated README.
- **Translations:** Add `intro` section to `lib/translations.ts` for all new field labels and placeholders.
