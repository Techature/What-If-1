# Design — What If: Give Waste A Second Life

This document describes the look and feel of the app. Use it when updating the UI or matching colors in presentations, without digging through layout code.

---

## Mood

**Calm + hopeful.** The palette mixes cool ocean blue (trust, clarity) with fresh mint green (growth, sustainability). The layout feels like a phone app: soft gradients, rounded cards, and gentle shadows — friendly for students and families, not corporate.

---

## Color palette

| Role | Name | Hex | Usage |
|------|------|-----|--------|
| Navy | `--st-blue-900` | `#0f2744` | Headings, strong text |
| Blue | `--st-blue-700` | `#1e5a9e` | Primary buttons, links, Maker accents |
| Bright blue | `--st-blue-600` | `#2563eb` | Selected states, Maker card borders |
| Teal | `--st-mint-600` | `#0d9488` | Finder accents, success / mint CTAs |
| Mint | `--st-mint-400` | `#5eead4` | Borders, highlights, profile rings |
| Surface | `--st-surface` | `#f0f9ff` | Screen backgrounds inside the frame |
| Card | `--st-card` | `#ffffff` | Cards, inputs, notice panels |

**Page background** (outside the phone frame):  
`linear-gradient(160deg, #dbeafe 0%, #ecfdf5 45%, #f8fafc 100%)`

**Role colors**

- **Maker** — blue borders and selection (`#2563eb` / `#bfdbfe` default ring).
- **Finder** — mint/teal borders (`#0d9488` / `#99f6e4` default ring).
- **Both** — text button on screen 2 (white card, blue label); chooser uses the same Maker/Finder imagery as the main roles.

**Notifications**

- Bell icon with optional **red unread dot** on the badge.
- Notice panel: **navy text** on **white** card with soft shadow (not full-width green banners).

---

## Typography

- **Font stack:** `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`
- **Titles:** bold (700), navy or blue, often multi-line with `pre-line` for greetings.
- **Helper / hint text:** 13–15px, semibold for microcopy on role selection.
- **Form labels (Finder):** large, bold, high-contrast blue for accessibility on small screens.

Avoid heavy display fonts on dashboards; role screen may use stronger weight for “Choose your role.”

---

## Layout & frame

| Token | Value |
|--------|--------|
| App width | `320px` |
| App height | `450px` |
| Large radius | `18px` (`--st-radius-lg`) |
| Medium radius | `14px` (`--st-radius-md`) |
| Card shadow | `0 8px 24px rgba(30, 90, 158, 0.12)` |
| Button shadow | `0 8px 22px rgba(30, 90, 158, 0.35)` |

The app sits in a **rounded “device” shell** (`border-radius: 20px`) with a deep shadow so it reads as a mobile prototype on desktop. On narrow viewports the frame **scales** slightly so it still fits the screen.

---

## Components

### Buttons

- **Primary:** blue fill, white text, rounded, elevated shadow (e.g. Start reusing, Continue, Sent).
- **Secondary / role — Both:** white background, blue border/text, full width below role cards.

### Cards & images

- Role cards: white, 18px radius, 2px border that **intensifies** when selected.
- **Maker item image:** portrait items get taller slot + `object-fit: contain`; landscape uses shorter slot + `cover`.
- **Profile icon:** 44×44 circle, mint border, light shadow. In **Both** mode on Maker/Finder dashboards, profile becomes a **stroke-style undo arrow** (`icon://fa-undo`) with `contain` fitting so nothing is clipped.

### Navigation (Maker)

- Bottom bar: **back** (left), **Sent** (center CTA), **forward** (right), with fixed spacing so controls do not overlap.

### Notifications

- **Finder / Maker:** bell fixed near bottom of screen; tap opens a compact notice panel above the bell.

---

## Motion & interaction

- Short transitions on cards and chooser tiles (`~0.15–0.2s` ease).
- Active states: slight **scale down** on tap for role images and Both chooser.
- No full-page reloads when switching **Both** roles — screen changes only.

---

## Assets

- Starter marketing image on screen 1 (reuse journey).
- Maker / Finder illustrations on role selection (`assets/`).
- App Lab **icon URLs** (`icon://fa-paint-brush`, search icon, undo) where noted in code.

---

## Files that implement this design

| File | Purpose |
|------|---------|
| `style.css` | Design tokens, screen-specific layout, bells, forms |
| `index.html` | Control positions and inline structure from App Lab |
| `code.js` | Role flow, undo profile, notifications (behavior only) |

When you change colors, prefer updating **CSS variables** in `:root` first, then screen-specific overrides.

---

*Design doc for the What If: Give Waste A Second Life project (classroom partner project).*