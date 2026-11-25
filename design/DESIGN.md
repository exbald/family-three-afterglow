# Afterglow — design kit

Design system extracted from **Afterglow**, a dark single-screen running tracker
(weekly distance, streak, live countdown). Dense, warm, numbers-first.

## Mood

Dense and dark but never cold: a near-black shell warmed by ember-brown surfaces,
with a big sunset-orange number always burning at the centre. Numbers are the
celebration — huge tabular figures, tracked-out micro-labels, nothing cute
between the runner and the data. A single lime "good news" accent and one warm
glow under the streak counter carry all the personality the app allows itself.

## Colour

| Token | Hex | Job |
|---|---|---|
| `--color-bg` | `#0e0b09` | Page background (near-black, warmed). Also the radial ember glow base. |
| `--color-surface` | `#17120f` | Card / tile / panel / chart background. |
| `--color-surface-2` | `#201915` | Raised surface: inputs, tooltip, odd list rows, hero gradient end. |
| `--color-line` | `#2e2520` | Hairline borders, row separators, chart gridlines. |
| `--color-ink` | `#f8f2eb` | Primary text and big stat values. |
| `--color-ink-2` | `#c0ae9f` | Secondary text: sub-lines, dates, times, captions. |
| `--color-ink-3` | `#8a7a6e` | Muted text: labels, axis ticks, footers, empty states. |
| `--color-accent` | `#ff8c3a` | Sunset orange — brand word, streak number, current-week bar, KM column, focus border. |
| `--color-accent-deep` | `#e8590c` | Dark end of the button gradient. |
| `--color-accent-bright` | `#ff922b` | Light end of the button gradient. |
| `--color-accent-dim` | `#4d2c17` | Dim orange borders (hero card, tooltip) and glow shadows. |
| `--color-mark` | `#a3552a` | Dimmed orange for past-week chart bars. |
| `--color-lime` | `#c9f24f` | The "good news" accent: live clock, safe state, positive deltas, focus outline. |
| `--color-warn` | `#ff6a5c` | Warnings: clock running out, error messages, delete hover. |

Page background adds a fixed radial glow:
`radial-gradient(900px 420px at 50% -80px, rgba(255,140,58,.16), transparent 70%)`.

## Type

- **Family:** `"Nunito", system-ui, -apple-system, "Segoe UI", sans-serif` — weights 500, 700, 800, 900. No serif, no italic; emphasis is weight 900 + colour.
- **No monospace family is loaded.** The "mono" feel comes from `font-variant-numeric: tabular-nums` on every number (streak, clock, tile values, chart) plus uppercase letter-spaced micro-labels (11px, `.1–.14em` tracking). Apply tabular-nums to any live or aligned figure.

Size scale (all Nunito):

| Token | Size | Use |
|---|---|---|
| `--text-hero` | 56px / 900 / -.03em / 1.05 | Streak count only. |
| `--text-stat` | 30px / 900 / -.02em / 1.1 | Stat tile values. |
| `--text-clock` | 28px / 800 / .01em | Live countdown. |
| `--text-title` | 24px / 900 / -.01em / 1.1 | Page `<h1>`. |
| `--text-lg` | 15px / 800 | Unit suffix inside the hero number (`small`). |
| `--text-body` | 14px / 700 | Base size, tile suffixes. |
| `--text-sm` | 13px / 700–900 | List rows, cheer line, buttons. |
| `--text-xs` | 12px / 600–700 | Sub-lines, captions, messages, footer. |
| `--text-label` | 11px / 800 / uppercase / .1–.14em | Section titles, tile labels, table head, form labels, axis text (10px in SVG). |

Micro-label pattern: `11px · weight 800 · uppercase · letter-spacing .12em · --color-ink-3`. Use it for every section or tile caption.

## Space and shape

Spacing steps (also exported as `--space-*`):

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | label→value inside tiles. |
| `--space-2` | 6px | caption gaps, chart note. |
| `--space-3` | 8px | grid gaps, tight row padding, section-title bottom. |
| `--space-4` | 10px | default grid gap between cards, form field gaps. |
| `--space-5` | 12px | input vertical padding, chart box sides, mobile tile padding. |
| `--space-6` | 14px | tile padding, header underline gap, list row padding, section title top. |
| `--space-7` | 16px | form padding, card side padding, wrap gutters. |
| `--space-8` | 18px | hero padding, footer margin. |
| `--space-9` | 20px | hero side padding. |
| `--space-10` | 24px | wrap top padding. |
| `--space-12` | 48px | wrap bottom padding. |

Radii and borders:

- `--radius-lg: 18px` — every card, tile, hero, panel, chart box.
- `--radius-md: 12px` — inputs and buttons.
- `--radius-sm: 10px` — tooltip.
- `--radius-pill: 999px` — the small DEL button.
- Borders: `1px solid var(--color-line)` on all cards; hero card gets `1px solid var(--color-accent-dim)` plus a `3px solid var(--color-accent)` left edge; chart bars use `rx` up to 6.

Shadows:

- `--shadow-glow: 0 14px 36px -18px rgba(255,140,58,.45)` — streak hero card only.
- `--shadow-btn: 0 8px 20px -10px rgba(232,89,12,.7)` — primary button.
- `--shadow-pop: 0 10px 30px rgba(0,0,0,.6)` — tooltip / floating layer.
- `--shadow-focus: 0 0 0 3px rgba(255,140,58,.18)` — input focus ring.
- Hero number glow: `text-shadow: 0 0 28px rgba(255,140,58,.35)`.

## Layout

- Single screen, `max-width: 980px`, centered, `padding: 24px 16px 48px`. Everything visible without scrolling far; density over whitespace.
- **Header rail:** baseline-aligned flex (title left, date right) over a `1px` bottom border.
- **Streak hero:** full-width flex banner (label + 56px number + cheer line left; live clock + caption right), gradient surface, orange left edge, glow shadow.
- **Stat row:** `grid-template-columns: repeat(3, 1fr)`, `gap: 10px` — collapses to 2 cols + full-width third under 380px.
- **Two-column form/list:** `grid-template-columns: 5fr 7fr`, `gap: 10px` — single column under 720px.
- **Data table:** CSS grid rows `82px 1fr 52px 66px 40px` (date, km, time, pace, delete), 9px/14px padding, `1px` separators, odd rows in `--color-surface-2`.
- **Chart:** inline SVG `viewBox="0 0 640 220"`, 3 horizontal gridlines, bars ~55% band width (10–28px), past weeks `--color-mark`, current week `--color-accent` with a value label above.

## Components

- **Streak hero** — full-width banner card; label 11px, number 56px/900 orange + `DAYS` 15px, cheer line 13px with lime `<b>`, live `HH:MM:SS` clock 28px/800 lime (turns `--color-warn` when today's run is missing). Tokens: gradient surface, `--radius-lg`, `--shadow-glow`, 3px accent left border.
- **Stat tile** — `--color-surface` card, 11px uppercase label, 30px/900 tabular value with 14px unit `small`, 12px sub-line (lime when positive). Hero variant: lime value + `rgba(201,242,79,.22)` border.
- **Primary button** — `linear-gradient(90deg, #e8590c, #ff922b)`, white 900 text, 13px, `12px 16px`, `--radius-md`, `--shadow-btn`; hover `brightness(1.08)`, active `scale(.98)`, focus-visible `2px solid lime, offset 2px`.
- **Input** — `--color-surface-2` fill, `1px --color-line`, `--radius-md`, `10px 12px`, 700 text, `color-scheme: dark`; focus: orange border + `--shadow-focus`.
- **Runs table** — panel with 11px uppercase head row, grid rows 700 weight, km column 900 orange, delete = pill ghost button (`1px line`, 11px 800, turns `--color-warn` on hover).
- **Bar chart + tooltip** — SVG bars as above; tooltip = `--color-surface-2` card, 11px label / 14px 900 value with lime `<em>`, `--radius-sm`, `--shadow-pop`.
- **Status message** — 12px line, `.ok` lime / `.err` warn / default muted.

## Do and don't

**Do**
- Keep one screen dense: everything above the fold, 10px gaps, no big empty bands.
- Let numbers celebrate: 30–56px weight-900 tabular figures with lime for good news.
- Use the tracked 11px uppercase micro-label for every caption and axis.
- Warm every dark surface (#0e0b09/#17120f/#201915) and pair orange with lime.
- Give exactly one element the glow (the streak hero) and keep the rest flat.

**Don't**
- Don't go light, airy, or white-space-heavy — this shell is near-black and packed.
- Don't add a monospace webfont; fake mono with tabular-nums + tracking.
- Don't bury numbers under confetti, modals, mascots, or emoji celebrations.
- Don't use cold blues/greys or pure `#000`/`#fff`; stay in the ember palette.
- Don't glow more than one element or stack decorative shadows on cards.

## Use it with a coding agent

Build this in the style of DESIGN.md: a dense dark single-screen layout on a warmed near-black background (`#0e0b09`) with ember surfaces, a sunset-orange accent (`#ff8c3a`) and a lime good-news accent (`#c9f24f`). Use Nunito 500/700/800/900 only — no monospace font, but set `font-variant-numeric: tabular-nums` on every number and caption captions as 11px uppercase 800-weight text with .12em letter-spacing. Cards are 18px-radius `#17120f` surfaces with 1px `#2e2520` borders on a 980px max-width grid with 10px gaps; stat values are 30px/900 and the one hero number is 56px/900 orange with a soft glow. Celebrate data, not decoration: no confetti, no light themes, no extra glow beyond the single hero.
