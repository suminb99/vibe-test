# DESIGN.md

> **Theme: Catppuccin Mocha (dark) · Catppuccin Latte (light)**
> Two-mode design system. Mocha is the default dark canvas; Latte is the paired light counterpart.
> — [catppuccin.com](https://catppuccin.com)

---

## Overview

This document is the design system reference for a **dual-theme Catppuccin** setup.

- **Dark mode — Catppuccin Mocha:** The darkest of the four Catppuccin flavors. A near-black base (`--ctp-base` #1e1e2e) with rich, vivid pastels that pop off the deep canvas. Mocha reads as premium and immersive — high contrast without harshness.
- **Light mode — Catppuccin Latte:** The canonical light counterpart. A bright cream base (`--ctp-base` #eff1f5) with the same accent hues tuned for legibility on light surfaces.

**Key Characteristics:**

- Mocha's deep canvas (`--ctp-base` #1e1e2e) layers through Surface tiers that step up in lightness, not in hue. The system reads as monochromatic at a glance.
- Mauve is the primary brand accent and the only color used for primary CTAs — Mocha Mauve (`#cba6f7`), Latte Mauve (`#8839ef`). All other accent colors serve semantic roles.
- Border radius uses a soft scale (`--radius-md` 8px default). No fully-sharp rectangles; no fully-rounded pills on primary surfaces.
- Text hierarchy relies on color steps (Text → Subtext 1 → Subtext 0 → Overlay 2) rather than weight alone.
- Accent colors are **never** used as large background fills. They are ink on a canvas — badges, icons, underlines, syntax tokens.
- Theme is controlled via `data-theme="dark"` / `data-theme="light"` on `<html>`. CSS variables flip; component code stays unchanged.

---

## Color Palette

### Mocha (Dark) — Base Colors

| Name      | Hex       | RGB               | Usage                             |
| --------- | --------- | ----------------- | --------------------------------- |
| Crust     | `#11111b` | rgb(17, 17, 27)   | Deepest background, app shell     |
| Mantle    | `#181825` | rgb(24, 24, 37)   | Sidebar, panel backgrounds        |
| Base      | `#1e1e2e` | rgb(30, 30, 46)   | Primary content background        |
| Surface 0 | `#313244` | rgb(49, 50, 68)   | Cards, input field backgrounds    |
| Surface 1 | `#45475a` | rgb(69, 71, 90)   | Hover states, selected items      |
| Surface 2 | `#585b70` | rgb(88, 91, 112)  | Active tabs, highlighted surfaces |

### Mocha (Dark) — Overlay & Text

| Name      | Hex       | RGB               | Usage                        |
| --------- | --------- | ----------------- | ---------------------------- |
| Overlay 0 | `#6c7086` | rgb(108, 112, 134)| Inactive icons, dividers     |
| Overlay 1 | `#7f849c` | rgb(127, 132, 156)| Placeholders, subtle borders |
| Overlay 2 | `#9399b2` | rgb(147, 153, 178)| Secondary button borders     |
| Subtext 0 | `#a6adc8` | rgb(166, 173, 200)| Captions, meta information   |
| Subtext 1 | `#bac2de` | rgb(186, 194, 222)| Secondary text, descriptions |
| Text      | `#cdd6f4` | rgb(205, 214, 244)| Primary body text            |

### Accent Colors (shared across themes — values differ per flavor)

| Name      | Mocha Hex | Latte Hex | Usage                          |
| --------- | --------- | --------- | ------------------------------ |
| Rosewater | `#f5e0dc` | `#dc8a78` | Warm highlights, decorative    |
| Flamingo  | `#f2cdcd` | `#dd7878` | Soft emphasis, constants       |
| Pink      | `#f5c2e7` | `#ea76cb` | Tags, decorative accents       |
| **Mauve** | `#cba6f7` | `#8839ef` | **Primary brand accent, CTAs** |
| Red       | `#f38ba8` | `#d20f39` | Errors, destructive actions    |
| Maroon    | `#eba0ac` | `#e64553` | Warning badges                 |
| Peach     | `#fab387` | `#fe640b` | Notifications, numbers         |
| Yellow    | `#f9e2af` | `#df8e1d` | Warnings, types                |
| Green     | `#a6e3a1` | `#40a02b` | Success, strings               |
| Teal      | `#94e2d5` | `#179299` | Info states, secondary links   |
| Sky       | `#89dceb` | `#04a5e5` | New / fresh indicators         |
| Sapphire  | `#74c7ec` | `#209fb5` | Interactive elements           |
| Blue      | `#89b4fa` | `#1e66f5` | Links, functions               |
| Lavender  | `#b4befe` | `#7287fd` | Focus rings, selected states   |

### Latte (Light) — Base Colors

| Name      | Hex       | RGB               | Usage                             |
| --------- | --------- | ----------------- | --------------------------------- |
| Base      | `#eff1f5` | rgb(239, 241, 245)| Primary content background        |
| Mantle    | `#e6e9ef` | rgb(230, 233, 239)| Sidebar, panel backgrounds        |
| Crust     | `#dce0e8` | rgb(220, 224, 232)| Deepest shadow / border base      |
| Surface 0 | `#ccd0da` | rgb(204, 208, 218)| Cards, input field backgrounds    |
| Surface 1 | `#bcc0cc` | rgb(188, 192, 204)| Hover states, selected items      |
| Surface 2 | `#acb0be` | rgb(172, 176, 190)| Active tabs, highlighted surfaces |
| Overlay 0 | `#9ca0b0` | rgb(156, 160, 176)| Inactive icons, dividers          |
| Overlay 1 | `#8c8fa1` | rgb(140, 143, 161)| Placeholders, subtle borders      |
| Overlay 2 | `#7c7f93` | rgb(124, 127, 147)| Secondary button borders          |
| Subtext 0 | `#6c6f85` | rgb(108, 111, 133)| Captions, meta information        |
| Subtext 1 | `#5c5f77` | rgb(92, 95, 119)  | Secondary text, descriptions      |
| Text      | `#4c4f69` | rgb(76, 79, 105)  | Primary body text                 |

---

## CSS Variables

Two sets of CSS custom properties — Mocha for dark (default), Latte for light.

```css
/* ── Mocha: Dark default ── */
:root,
[data-theme="dark"] {
  /* Base */
  --ctp-crust:     #11111b;
  --ctp-mantle:    #181825;
  --ctp-base:      #1e1e2e;
  --ctp-surface-0: #313244;
  --ctp-surface-1: #45475a;
  --ctp-surface-2: #585b70;

  /* Overlay */
  --ctp-overlay-0: #6c7086;
  --ctp-overlay-1: #7f849c;
  --ctp-overlay-2: #9399b2;

  /* Text */
  --ctp-subtext-0: #a6adc8;
  --ctp-subtext-1: #bac2de;
  --ctp-text:      #cdd6f4;

  /* Accent */
  --ctp-rosewater: #f5e0dc;
  --ctp-flamingo:  #f2cdcd;
  --ctp-pink:      #f5c2e7;
  --ctp-mauve:     #cba6f7;
  --ctp-red:       #f38ba8;
  --ctp-maroon:    #eba0ac;
  --ctp-peach:     #fab387;
  --ctp-yellow:    #f9e2af;
  --ctp-green:     #a6e3a1;
  --ctp-teal:      #94e2d5;
  --ctp-sky:       #89dceb;
  --ctp-sapphire:  #74c7ec;
  --ctp-blue:      #89b4fa;
  --ctp-lavender:  #b4befe;
}

/* ── Latte: Light ── */
[data-theme="light"] {
  /* Base */
  --ctp-crust:     #dce0e8;
  --ctp-mantle:    #e6e9ef;
  --ctp-base:      #eff1f5;
  --ctp-surface-0: #ccd0da;
  --ctp-surface-1: #bcc0cc;
  --ctp-surface-2: #acb0be;

  /* Overlay */
  --ctp-overlay-0: #9ca0b0;
  --ctp-overlay-1: #8c8fa1;
  --ctp-overlay-2: #7c7f93;

  /* Text */
  --ctp-subtext-0: #6c6f85;
  --ctp-subtext-1: #5c5f77;
  --ctp-text:      #4c4f69;

  /* Accent — Latte variants */
  --ctp-rosewater: #dc8a78;
  --ctp-flamingo:  #dd7878;
  --ctp-pink:      #ea76cb;
  --ctp-mauve:     #8839ef;
  --ctp-red:       #d20f39;
  --ctp-maroon:    #e64553;
  --ctp-peach:     #fe640b;
  --ctp-yellow:    #df8e1d;
  --ctp-green:     #40a02b;
  --ctp-teal:      #179299;
  --ctp-sky:       #04a5e5;
  --ctp-sapphire:  #209fb5;
  --ctp-blue:      #1e66f5;
  --ctp-lavender:  #7287fd;
}
```

---

## Semantic Token Mapping

Maps palette colors to abstract roles. Always reference these tokens in component code — never inline hex values. These tokens work unchanged across both themes.

```css
:root {
  /* ── Layout ── */
  --color-bg:           var(--ctp-base);
  --color-bg-alt:       var(--ctp-mantle);
  --color-bg-raised:    var(--ctp-surface-0);
  --color-bg-overlay:   var(--ctp-surface-1);
  --color-border:       var(--ctp-surface-2);
  --color-border-muted: var(--ctp-overlay-0);

  /* ── Text ── */
  --color-text-primary:   var(--ctp-text);
  --color-text-secondary: var(--ctp-subtext-1);
  --color-text-muted:     var(--ctp-subtext-0);
  --color-text-disabled:  var(--ctp-overlay-1);

  /* ── Interactive ── */
  --color-link:         var(--ctp-blue);
  --color-link-hover:   var(--ctp-sapphire);
  --color-focus:        var(--ctp-lavender);
  --color-cta:          var(--ctp-mauve);
  --color-cta-hover:    var(--ctp-pink);

  /* ── Status ── */
  --color-success:  var(--ctp-green);
  --color-warning:  var(--ctp-yellow);
  --color-error:    var(--ctp-red);
  --color-info:     var(--ctp-teal);
  --color-new:      var(--ctp-sky);
}
```

---

## Typography

A type stack tuned to Catppuccin's calm, crafted character — identical across both themes.

### Font Stack

```css
:root {
  --font-display: 'Sora', sans-serif;            /* Headings */
  --font-body:    'DM Sans', 'Inter', sans-serif; /* Body */
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace; /* Code */
}
```

**Sora** pairs naturally with Catppuccin's soft-but-precise feel — rounded terminals without being playful. **DM Sans** keeps body text legible at small sizes on both dark and light surfaces. **JetBrains Mono** is the canonical pairing for Catppuccin syntax themes.

### Scale

| Token          | Size | Weight | Line Height | Letter Spacing | Use                        |
| -------------- | ---- | ------ | ----------- | -------------- | -------------------------- |
| `--text-3xl`   | 36px | 700    | 1.1         | –0.5px         | Hero headings (h1)         |
| `--text-2xl`   | 28px | 700    | 1.15        | –0.3px         | Page titles (h2)           |
| `--text-xl`    | 22px | 600    | 1.2         | 0              | Section headings (h3)      |
| `--text-lg`    | 18px | 500    | 1.35        | 0              | Lead / intro paragraphs    |
| `--text-md`    | 15px | 400    | 1.6         | 0              | Default body text          |
| `--text-sm`    | 13px | 400    | 1.5         | 0.1px          | Secondary labels, captions |
| `--text-xs`    | 11px | 500    | 1.4         | 0.4px          | Badges, overlines          |
| `--text-mono`  | 14px | 400    | 1.7         | 0              | Inline code, code blocks   |
| `--text-button`| 14px | 600    | 1.0         | 0.3px          | Button labels              |

### Principles

Display sizes (xl and above) use negative letter-spacing to compensate for Sora's naturally open tracking at large sizes. Body text stays at 0 tracking. Never set body text at weight 700 — the system's emphasis vocabulary uses `--ctp-text` vs `--ctp-subtext-1` color steps before reaching for bold.

---

## Spacing & Radius

```css
:root {
  /* ── Spacing (4px base grid) ── */
  --space-1:       4px;
  --space-2:       8px;
  --space-3:      12px;
  --space-4:      16px;
  --space-6:      24px;
  --space-8:      32px;
  --space-12:     48px;
  --space-16:     64px;
  --space-section: 96px;  /* Between major page sections */

  /* ── Border Radius ── */
  --radius-sm:    4px;   /* Small toggles, inline chips     */
  --radius-md:    8px;   /* Default — cards, inputs, buttons */
  --radius-lg:   12px;   /* Modals, panels, large cards      */
  --radius-xl:   16px;   /* Feature hero cards               */
  --radius-full: 9999px; /* Avatar, icon buttons, pill tags  */
}
```

**Default radius is `--radius-md` (8px).** This is non-negotiable for the Catppuccin character — sharp rectangles feel too industrial; pill shapes feel too playful. The 8px radius sits at the exact midpoint of the system's identity.

---

## Elevation & Depth

Elevation is expressed through background-color steps, not drop shadows. Shadows are used only for floating elements (dropdowns, tooltips, modals) that need to detach from the page surface.

| Level         | Treatment                                              | Used By                                       |
| ------------- | ------------------------------------------------------ | --------------------------------------------- |
| Floor         | `--ctp-base`, no border                                | Page background, empty state areas            |
| Recessed      | `--ctp-mantle`, no border                              | Sidebars, sticky headers, footers             |
| Flat card     | `--ctp-surface-0`, 1px `--ctp-surface-1` border        | Content cards, table rows, input fields       |
| Raised card   | `--ctp-surface-0` + `--shadow-sm`                      | Hovered cards, selected list items            |
| Floating      | `--ctp-surface-1` + `--shadow-md`                      | Dropdowns, tooltips, context menus            |
| Overlay       | `--ctp-surface-0` + `--shadow-lg` + backdrop blur      | Modals, drawers, command palettes             |

```css
/* Shadow tokens — Crust-based for natural harmony (Mocha Crust = #11111b) */
--shadow-xs: 0 1px 2px   rgba(17, 17, 27, 0.30);
--shadow-sm: 0 2px 8px   rgba(17, 17, 27, 0.40);
--shadow-md: 0 4px 16px  rgba(17, 17, 27, 0.50);
--shadow-lg: 0 8px 32px  rgba(17, 17, 27, 0.60);
--shadow-xl: 0 16px 48px rgba(17, 17, 27, 0.70);
```

> **Light mode shadows:** In Latte, shadows use Latte Crust `rgba(220, 224, 232, 0.50)` at the same alpha steps to produce soft, warm-gray shadows on the light canvas.

---

## Components

### `button-primary`

The default CTA. Mauve background signals the primary action in the system.

```
background:     --ctp-mauve
color:          --ctp-crust
border:         none
border-radius:  --radius-md  (8px)
padding:        10px 20px
height:         40px
font:           --text-button (14px / 600 / 0.3px tracking)

hover:          background → --ctp-pink, transition 150ms ease-out
focus:          outline 2px solid --ctp-lavender, outline-offset 2px
active:         scale(0.97), background → --ctp-mauve (restored)
disabled:       opacity 0.4, pointer-events none, cursor not-allowed
```

### `button-secondary`

Lower-emphasis action. Sits on Surface 0 without competing with primary.

```
background:     --ctp-surface-1
color:          --ctp-text
border:         1px solid --ctp-surface-2
border-radius:  --radius-md
padding:        10px 20px
height:         40px
font:           --text-button

hover:          background → --ctp-surface-2
focus:          outline 2px solid --ctp-lavender, outline-offset 2px
disabled:       opacity 0.4, pointer-events none
```

### `button-ghost`

Tertiary. Text-only presence, used in toolbars and dense UIs.

```
background:     transparent
color:          --ctp-text
border:         1px solid --ctp-overlay-0
border-radius:  --radius-md
padding:        10px 20px
height:         40px

hover:          background → --ctp-surface-0, border-color → --ctp-overlay-2
focus:          outline 2px solid --ctp-lavender, outline-offset 2px
disabled:       opacity 0.4, pointer-events none
```

### `button-danger`

Destructive actions. Red signals intent; requires explicit confirmation.

```
background:     --ctp-red
color:          --ctp-crust
border:         none
border-radius:  --radius-md
padding:        10px 20px
height:         40px

hover:          background → --ctp-maroon
focus:          outline 2px solid --ctp-red, outline-offset 2px
```

### `button-icon`

Square or circular icon-only button. Used in toolbars, carousels, close actions.

```
background:     --ctp-surface-0
color:          --ctp-text
border:         1px solid --ctp-surface-1
border-radius:  --radius-md  (square variant)
               --radius-full (circular variant)
width:          36px
height:         36px
icon-size:      16px

hover:          background → --ctp-surface-1
focus:          outline 2px solid --ctp-lavender, outline-offset 2px
```

### `theme-toggle`

Icon button in AppHeader that switches between dark (Mocha) and light (Latte).

```
background:     --ctp-surface-0
color:          --ctp-subtext-1
border:         1px solid --ctp-surface-1
border-radius:  --radius-md
width:          36px
height:         36px

icon (dark mode):  Moon icon (Lucide Moon, 16px)
icon (light mode): Sun icon  (Lucide Sun, 16px)

hover:          color → --ctp-mauve, background → --ctp-surface-1
focus:          outline 2px solid --ctp-lavender, outline-offset 2px
transition:     color 150ms ease-out, background 150ms ease-out

aria-label:     "라이트 모드로 전환" / "다크 모드로 전환" (toggle current state)
placement:      AppHeader right cluster, left of any user avatar
```

### `text-input`

Standard single-line text field.

```
background:     --ctp-surface-0
color:          --ctp-text
border:         1px solid --ctp-overlay-0
border-radius:  --radius-md
padding:        10px 14px
height:         40px
font:           --text-md (15px / 400)
placeholder:    --ctp-overlay-1

focus:          border-color → --ctp-lavender, outline none
error:          border-color → --ctp-red
                + error message in --ctp-red below field, 12px / --text-xs
disabled:       background → --ctp-mantle, color → --ctp-overlay-1,
                border-color → --ctp-surface-1
```

### `card`

Default content container. Used for feature blocks, list items, settings panels.

```
background:     --ctp-surface-0
border:         1px solid --ctp-surface-1
border-radius:  --radius-lg  (12px)
padding:        --space-6    (24px)
shadow:         none (flat by default)

hover (interactive cards):
  background  → --ctp-surface-1
  shadow      → --shadow-sm
  transition  200ms ease-out
```

### `modal`

Floating overlay. Appears centered with a dimmed backdrop.

```
background:     --ctp-surface-0
border:         1px solid --ctp-surface-2
border-radius:  --radius-xl  (16px)
padding:        --space-8    (32px)
shadow:         --shadow-lg
max-width:      560px

backdrop:       background rgba(var(--ctp-crust-rgb), 0.75), backdrop-filter blur(4px)
enter:          scale(0.95) → scale(1), opacity 0 → 1, 200ms --ease-spring
exit:           scale(1) → scale(0.96), opacity 1 → 0, 150ms ease-in
```

### `badge` / `tag`

Small status and label indicators. Always use accent colors as **text/icon color on a tinted background** — never as solid fills. RGBA values below are for Mocha; in light mode the same CSS variable references work automatically.

| Variant   | Background (15% alpha — Mocha) | Text / Border           |
| --------- | ------------------------------ | ----------------------- |
| `default` | `--ctp-surface-1`              | `--ctp-subtext-1`       |
| `mauve`   | `rgba(203, 166, 247, .15)`     | `--ctp-mauve`           |
| `blue`    | `rgba(137, 180, 250, .15)`     | `--ctp-blue`            |
| `green`   | `rgba(166, 227, 161, .15)`     | `--ctp-green`           |
| `yellow`  | `rgba(249, 226, 175, .15)`     | `--ctp-yellow`          |
| `red`     | `rgba(243, 139, 168, .15)`     | `--ctp-red`             |
| `peach`   | `rgba(250, 179, 135, .15)`     | `--ctp-peach`           |

```
border-radius:  --radius-full  (pill shape)
padding:        2px 10px
font:           --text-xs (11px / 500 / 0.4px tracking)
```

> In light mode, tint alphas may need to increase to `.25` for sufficient contrast on the lighter background — verify visually.

### `tooltip`

Contextual label. Appears on hover/focus, never on tap (mobile).

```
background:     --ctp-surface-2
color:          --ctp-text
border-radius:  --radius-sm  (4px)
padding:        6px 10px
font:           --text-sm (13px / 400)
shadow:         --shadow-md
max-width:      240px

enter:          opacity 0 → 1, translateY(4px) → (0), 120ms ease-out
exit:           opacity 1 → 0, 80ms ease-in
```

### `code-block`

Multi-line code display. Syntax highlighting follows Catppuccin Mocha spec.

```
background:     --ctp-mantle
border:         1px solid --ctp-surface-0
border-radius:  --radius-lg
padding:        --space-6 (24px)
font:           --font-mono / --text-mono (14px / 400 / lh 1.7)
overflow-x:     auto

/* Syntax token colors */
keyword:        --ctp-mauve
string:         --ctp-green
number:         --ctp-peach
comment:        --ctp-overlay-1  (italic)
function:       --ctp-blue
type:           --ctp-yellow
constant:       --ctp-flamingo
operator:       --ctp-sky
punctuation:    --ctp-overlay-2
variable:       --ctp-text

/* Line numbers (optional) */
line-number:    --ctp-overlay-0
line-highlight: background --ctp-surface-0, left border 2px --ctp-mauve
```

### `category-tab`

Horizontal filter tabs used on listing / content pages.

```
Default:
  color:          --ctp-subtext-1
  background:     transparent
  border-bottom:  2px solid transparent
  padding:        10px --space-4
  font:           --text-sm / 500

Active:
  color:          --ctp-text
  border-bottom:  2px solid --ctp-mauve

Hover:
  color:          --ctp-text
  background:     --ctp-surface-0
  border-radius:  --radius-sm (top corners only)
```

### `top-nav`

Global navigation bar pinned to the top of every page.

```
background:     --ctp-mantle
border-bottom:  1px solid --ctp-surface-0
height:         56px
padding:        0 --space-6

Logo:           left-aligned, 20px / 700 / --ctp-mauve accent on brand mark
Nav links:      --text-sm / 400, color --ctp-subtext-1
                hover → --ctp-text
                active → --ctp-text + 2px bottom border --ctp-mauve
Right cluster:  theme-toggle + icon buttons (search, settings, avatar)
```

### `sidebar`

Vertical navigation panel. Used in app / dashboard layouts.

```
background:     --ctp-mantle
border-right:   1px solid --ctp-surface-0
width:          240px (expanded) / 56px (collapsed)
padding:        --space-4

Section label:
  font:         --text-xs / 500 / 0.4px tracking
  color:        --ctp-overlay-1
  text-transform: uppercase
  margin-bottom: --space-2

Nav item:
  border-radius: --radius-md
  padding:       8px --space-3
  color:         --ctp-subtext-1
  font:          --text-sm / 400

  hover:         background --ctp-surface-0, color --ctp-text
  active:        background --ctp-surface-0, color --ctp-mauve,
                 left border 2px solid --ctp-mauve
```

---

## Theme Switching

### Architecture

Theme is set via `data-theme` attribute on `<html>`. CSS variables swap automatically — no component code changes needed.

```
dark  → [data-theme="dark"]  → Mocha palette
light → [data-theme="light"] → Latte palette
```

### Recommended: `next-themes`

For Next.js projects, use `next-themes` to avoid SSR hydration flicker:

```bash
npm install next-themes
```

```tsx
// app/providers.tsx
'use client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      themes={['dark', 'light']}
    >
      {children}
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// components/layout/ThemeToggle.tsx
'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="w-9 h-9 flex items-center justify-center rounded-[8px]
                 bg-ctp-surface-0 border border-ctp-surface-1
                 text-ctp-subtext-1 hover:text-ctp-mauve
                 hover:bg-ctp-surface-1 transition-colors duration-150"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
```

### Theme Transition

Theme switching is **instantaneous** — no crossfade. Animated transitions between themes cause visual glitching during SSR rehydration and are not recommended. If a transition is desired, limit it to `color` and `background-color` properties only:

```css
*, *::before, *::after {
  transition: color 150ms ease-out, background-color 150ms ease-out;
}
```

Do not apply this globally in production without testing — it slows every hover interaction.

### localStorage Persistence

`next-themes` handles `localStorage` persistence automatically. Key: `theme`. Default: `"dark"` (Mocha).

---

## Layout

### Spacing System

Base unit is **4px**. All spacing values are multiples.

| Token             | Value | Common Use                              |
| ----------------- | ----- | --------------------------------------- |
| `--space-1`       | 4px   | Icon gap, inline spacing                |
| `--space-2`       | 8px   | Tag padding, tight list gaps            |
| `--space-3`       | 12px  | Input padding, compact row gaps         |
| `--space-4`       | 16px  | Card inner padding (compact), grid gaps |
| `--space-6`       | 24px  | Card inner padding (default)            |
| `--space-8`       | 32px  | Modal padding, section inner padding    |
| `--space-12`      | 48px  | Between content groups                  |
| `--space-16`      | 64px  | Hero padding, footer padding            |
| `--space-section` | 96px  | Between major page sections             |

### Grid

- **Max content width:** 1280px, centered.
- **Columns:** 12-column grid at desktop; 4-column at tablet; 1-column at mobile.
- **Gutters:** `--space-6` (24px) at desktop; `--space-4` (16px) at mobile.
- **Card grids:** 3-up at desktop → 2-up at tablet → 1-up at mobile.

---

## Motion

```css
:root {
  /* ── Easing ── */
  --ease-out:    cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ── Duration ── */
  --duration-fast:   100ms;  /* Hover color shifts, icon swaps   */
  --duration-normal: 200ms;  /* Panel open/close, dropdown       */
  --duration-slow:   350ms;  /* Page transitions, modals         */
  --duration-enter:  250ms;  /* Elements entering the viewport   */
  --duration-exit:   150ms;  /* Elements leaving — always faster */
}
```

**Principles:**

- Interactive elements (buttons, links, tabs) → `--duration-fast`
- Panel open/close, dropdowns, tooltips → `--duration-normal`
- Modals, page transitions → `--duration-slow`
- Exit is always faster than enter. Leaving should never linger.
- Use `--ease-spring` only for elements that *pop* (modal appear, notification toast). Not for nav or form transitions.

---

## Iconography

- **Recommended sets:** [Lucide](https://lucide.dev) or [Phosphor Icons](https://phosphoricons.com)
- **Sizes:** `16px` (inline / button), `20px` (standalone), `24px` (emphasized / empty states)
- **Color:** `currentColor` by default — inherits text color of parent
- **Inactive:** `--ctp-overlay-0`
- **Active / accented:** apply the relevant semantic color directly (e.g., `--ctp-green` for success icons)
- **Stroke width:** 1.5px (Lucide default). Do not increase to 2px — it reads as heavy on the soft surfaces.

---

## Accessibility

### Contrast Ratios (Mocha dark)

| Pair                                   | Ratio  | WCAG    |
| -------------------------------------- | ------ | ------- |
| `--ctp-text` on `--ctp-base`           | ~8.5:1 | AAA ✅  |
| `--ctp-subtext-1` on `--ctp-base`      | ~5.8:1 | AA ✅   |
| `--ctp-subtext-0` on `--ctp-base`      | ~4.5:1 | AA ✅   |
| `--ctp-overlay-1` on `--ctp-base`      | ~3.2:1 | AA (large text only) ⚠️ |
| `--ctp-mauve` on `--ctp-base`          | ~5.2:1 | AA ✅   |
| `--ctp-crust` on `--ctp-mauve`         | ~8.0:1 | AAA ✅  |

### Contrast Ratios (Latte light)

| Pair                                   | Ratio  | WCAG    |
| -------------------------------------- | ------ | ------- |
| `--ctp-text` on `--ctp-base`           | ~7.0:1 | AAA ✅  |
| `--ctp-subtext-1` on `--ctp-base`      | ~5.0:1 | AA ✅   |
| `--ctp-mauve` on `--ctp-base`          | ~4.5:1 | AA ✅   |

> Do not use `--ctp-overlay-0` or lower as body text — use it only for decorative icons and dividers.

### Focus

- All interactive elements have a visible focus ring: `outline: 2px solid var(--ctp-lavender); outline-offset: 2px`
- Never suppress `:focus-visible` without a custom focus indicator replacement
- Lavender (`#b4befe` Mocha / `#7287fd` Latte) achieves ≥ 3:1 contrast in both themes

### Status & Error States

- Never rely on color alone — pair color with an icon or label text
- Error inputs get both a red border (`--ctp-red`) **and** an error message below
- Status badges use both color and a text label (e.g., "Error", "Success")

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
    scroll-behavior:           auto   !important;
  }
}
```

---

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                   |
| ------- | ----------- | ------------------------------------------------------------- |
| Mobile  | < 640px     | Single column; sidebar becomes bottom sheet; nav → hamburger  |
| Tablet  | 640–1024px  | 2-up card grids; sidebar collapses to icon-only (56px)        |
| Desktop | 1024–1280px | 3-up grids; full sidebar (240px); top-nav fully expanded      |
| Wide    | > 1280px    | Content capped at 1280px; extra whitespace added to margins   |

### Touch Targets

- All interactive elements have a minimum tap target of **44 × 44px**
- `button-primary`, `button-secondary`, `button-ghost` render at 40px height with 10px vertical padding — effective tap area 44px with surrounding spacing
- `button-icon` is 36px; wrap with a 44px invisible tap zone via padding when used in isolation on mobile
- `text-input` height is 40px — increase to 48px on mobile breakpoints
- `theme-toggle` (36px) follows the same `button-icon` rule

### Collapsing Strategy

- Top nav collapses to a hamburger at < 640px; the menu opens as a full-height overlay using `--ctp-mantle` background with a `--ctp-surface-0` inner panel
- Sidebar collapses to icon-only (56px wide) at tablet; hidden/bottom-sheet on mobile
- Card grids reduce columns (3 → 2 → 1) rather than shrinking card size
- Code blocks scroll horizontally on mobile — never wrap code lines
- Modal max-width becomes 100% viewport width on mobile with no border radius on bottom edge (bottom sheet pattern)

---

## Do's and Don'ts

### Do

- Use `--ctp-mauve` as the **only** primary CTA color. It's the system's one brand accent — guard it.
- Step through the surface hierarchy in order: Crust → Mantle → Base → Surface 0 → Surface 1 → Surface 2. Never skip levels.
- Pair `--radius-md` (8px) as the default. Reserve `--radius-full` for avatar, pill badges, and icon-circle buttons only.
- Use the text color steps (Text → Subtext 1 → Subtext 0) to create visual hierarchy before reaching for weight changes.
- Always pair status color (red, green, yellow) with a text label or icon — never color-only.
- Use `currentColor` for icons so they automatically inherit parent text state.
- Letter-space `--text-xs` badge labels at `0.4px` — small uppercase text needs tracking to breathe.
- Reference CSS variables (`--ctp-*`) in component code — theme switching works automatically.

### Don't

- **Don't use accent colors as large surface fills.** Mauve, Green, Peach, etc. are ink, not paint. A Mauve card background breaks the system's monochromatic depth illusion.
- **Don't introduce a new accent color.** The 14-accent palette is complete. Map any new semantic need to an existing color (`--ctp-sky` for "new", `--ctp-teal` for "info", etc.).
- **Don't place `--ctp-overlay-1` or lower as body text.** It fails AA contrast for normal-size text. Overlays are for icons and decorative dividers only.
- **Don't use `--radius-full` on buttons.** Pill buttons break the system's "crafted, not playful" character. Buttons are always `--radius-md`.
- **Don't stack two Surface 0 cards directly against each other without a border or gap.** Use `1px solid --ctp-surface-1` borders or `--space-4` gaps between adjacent cards.
- **Don't bold body text for emphasis.** Use `--ctp-text` vs `--ctp-subtext-1` color contrast instead.
- **Don't suppress focus rings.** Lavender focus rings are always visible — they're a deliberate part of the system's accessibility contract.
- **Don't use drop shadows on flat cards.** Shadows are reserved for floating elements (dropdowns, modals, tooltips). Flat cards use border + background elevation only.
- **Don't hardcode Mocha hex values.** Always use CSS variables so both themes work correctly.

---

## Iteration Guide

1. **One component at a time.** Reference its key name (e.g., `button-primary`, `card`, `modal`) from the Components section.
2. **New components default to `--radius-md` (8px).** Only use `--radius-full` if the component is explicitly circular (avatar, icon button). Only use `--radius-lg`/`--radius-xl` for large overlay containers.
3. **Variants live as separate entries.** `-hover`, `-active`, `-disabled`, `-error` are documented states, not modifier classes.
4. **Use semantic tokens everywhere** — never inline hex values. If a semantic token doesn't exist for the use case, add it to the Semantic Token Mapping section first.
5. **Accent colors for new components** — check existing semantic token mapping before assigning a new accent. If `--color-info` already maps to Teal, use `--color-info`, not `--ctp-teal` directly.
6. **Typography contrast rule** — if two adjacent text elements look too similar, step one color down (Text → Subtext 1) before increasing font size or weight.
7. **When adding a new status color**, use the badge alpha-tint pattern (`rgba` at 15% opacity) — never a solid accent background.
8. **Test both themes** — after adding a new component, toggle to Latte and verify contrast and readability before considering it done.

---

## Known Gaps

- **Animation timings for specific components** (carousel slide transitions, skeleton loader pulses, notification toast stacks) are not yet specified — treat as `--duration-normal` with `--ease-out` until defined.
- **Data visualization / chart color order** is not documented. A recommended sequence for charts: Mauve → Blue → Green → Peach → Teal → Yellow → Flamingo → Sky. Verify against real chart implementations in both themes.
- **Form validation micro-states** (inline validation as-you-type vs on-blur vs on-submit) are not specified — error state appearance is documented but trigger timing is not.
- **Configurator / picker surfaces** (color swatches, option grids, comparison panels) are not covered in this version.
- **Badge alpha-tint in Latte** — 15% alpha tints may render too faint on the light canvas. Bump to 25% as needed and document per-badge.
- **Right-to-left (RTL) layout** behavior is not documented. All spacing and directional patterns assume LTR.
- **System preference fallback** — if `next-themes` is not used, add `@media (prefers-color-scheme: light)` as a fallback that applies the same Latte variable overrides.

---

## References

- [Catppuccin Palette](https://catppuccin.com/palette)
- [Catppuccin Style Guide](https://github.com/catppuccin/catppuccin/blob/main/docs/style-guide.md)
- [catppuccin/palette (npm / tooling)](https://github.com/catppuccin/palette)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Lucide Icons](https://lucide.dev)

---

*DESIGN.md · Catppuccin Mocha (dark) + Latte (light) · 2026*
