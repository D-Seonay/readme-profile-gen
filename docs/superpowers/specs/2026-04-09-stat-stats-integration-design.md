# STAT-STATS Integration Design

Integration of the STAT-STATS project as a modular feature in the `readme-profile-gen` application.

## Overview

STAT-STATS is an API that generates GitHub statistics cards as SVGs. This integration will allow users to configure and preview these cards within the README generator.

## Requirements

1. **Selection UI:** A panel to choose card types, themes, fonts, and other parameters (compact, hide).
2. **SVG Preview:** A live preview of the configured card using the `<object>` tag for correct font rendering.
3. **Markdown Generation:** Automatic generation of the Markdown code for the selected cards.
4. **Modularity:** The feature should be independent and easily toggleable.

## Technical Design

### 1. Store Update (`store/useReadmeStore.ts`)

Add state for STAT-STATS configuration:
- `statStatsCards`: Array of selected card types (e.g., `['stats', 'streak']`).
- `statStatsTheme`: Selected theme (preset).
- `statStatsFont`: Selected Google Font.
- `statStatsCompact`: Boolean for the compact layout.
- `statStatsHide`: Array of stats to hide.
- `statStatsCustomCss`: (Optional) Custom CSS code.

### 2. Components

- **`components/StatStatsConfig.tsx`**:
  - Multi-select for card types.
  - Dropdown for themes and fonts.
  - Toggle for compact mode.
  - Multi-select for hidden stats.
- **`components/StatStatsPreview.tsx`**:
  - Displays the generated SVG using `<object type="image/svg+xml" data={url}>`.
  - Re-renders when parameters change.

### 3. Markdown Generation (`utils/generateMarkdown.ts`)

Update the generator to include a new section for STAT-STATS cards:
- Base URL: `https://github-stats-cards.matheodelaunay.studio`
- URL Construction: `https://github-stats-cards.matheodelaunay.studio/api/{cardType}?username={username}&theme={theme}&font={font}&compact={compact}&hide={hide}`.

### 4. Layout

Add `statstats` as a new section ID in `SectionId` and include it in the default layout.

## Success Criteria

- Users can successfully select and configure multiple STAT-STATS cards.
- The preview correctly displays the SVG with Google Fonts.
- The generated Markdown contains the correct URLs for STAT-STATS.
- The integration does not break existing GitHub stats functionality.
