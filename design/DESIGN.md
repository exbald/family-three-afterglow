# Afterglow — design kit

A dense, warm, near-black single-screen look for a personal tracking app: big numbers, hairline borders, a sunset-orange glow, one lime for good news, and a live-ticking countdown. Numbers lead; the warmth sits underneath them, never on top of them.

## Mood

A dark shell that feels warm, not cold: near-black with the heat of a sunset behind it. Everything is dense and legible first — one screen, no scrolling ceremony — with a single glowing number as the heart, a live countdown ticking beside it, and a small playful wink buried under the all-business front. Nothing cute, nothing celebrating; the numbers are the celebration.

## Colour

| Token | Hex | Job |
|---|---|---|
| `--color-bg` | `#0e0b09` | page background, near-black warmed |
| `--color-surface` | `#17120f` | tiles, panels, chart box |
| `--color-surface-2` | `#201915` | raised surface: inputs, zebra rows, tooltips |
| `--color-line` | `#2e2520` | hairline borders, dividers, chart grid lines |
| `--color-ink` | `#f8f2eb` | primary text (warm white) |
| `--color-ink-2` | `#c0ae9f` | secondary text: subs, captions, list detail |
| `--color-ink-3` | `#8a7a6e` | faint text: micro-labels, section heads, footer |
| `--color-accent` | `#ff8c3a` | sunset orange — hero number, current bar, focus |
| `--color-accent-deep` | `#e8590c` | primary-button gradient start |
| `--color-accent-hi` | `#ff922b` | primary-button gradient end |
| `--color-accent-dim` | `#4d2c17` | dim orange border framing accent surfaces |
| `--color-mark` | `#a3552a` | dimmed orange for past weeks / inactive bars |
| `--color-lime` | `#c9f24f` | lime — good news: up-ticks, "safe", success messages |
| `--color-warn` | `#ff6a5c` | danger: countdown when streak at risk, delete hover, errors |
| `--color-on-accent` | `#ffffff` | text on the orange button |

The page also carries a fixed warm glow behind everything: `radial-gradient(900px 420px at 50% -80px, rgba(255,140,58,.16), transparent 70%)` on the body, over `--color-bg`. No pure white, no pure black, no cold blues anywhere.

## Type

Family: `"Nunito", system-ui, -apple-system, "Segoe UI", sans-serif` — weights **500 / 700 / 800 / 900**. There is no separate mono face; the monospace accent is Nunito with `font-variant-numeric: tabular-nums` (plus slight tracking) on every number that counts or ticks: stats, clock, table figures, chart labels.

Scale (px), all from the app:

| Size | Use | Weight |
|---|---|---|
| 56 | streak hero count | 900, tracking −.03em, orange, `text-shadow: 0 0 28px rgba(255,140,58,.35)` |
| 30 | stat tile value | 900, tracking −.02em |
| 28 | live countdown clock | 800, lime (or warn) |
| 24 | page title | 900, tracking −.01em |
| 15 | unit after hero number | 800 |
| 14 | body default (line-height 1.45) | — |
| 13 | list rows, buttons, cheer line | 700 |
| 12 | captions, footer, today | 600–700 |
| 11 | micro-labels, section heads | 800, uppercase, tracking .10–.14em |

## Space and shape

- **Spacing steps**: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 48 px. Gaps between tiles and grid rows are 10px (8px on mobile) — tight, never airy.
- **Radii**: 18px (tiles, hero, panels), 12px (buttons, inputs), 10px (tooltip), 999px pill (delete chip).
- **Borders**: 1px solid `--color-line` everywhere; accent-framed surfaces use 1px `#4d2c17` with a 3px solid `--color-accent` left edge.
- **Shadows**: hero glow `0 14px 36px -18px rgba(255,140,58,.45)`; button `0 8px 20px -10px rgba(232,89,12,.7)`; popover `0 10px 30px rgba(0,0,0,.6)`; input focus ring `0 0 0 3px rgba(255,140,58,.18)`.

## Layout

- One column, `max-width: 980px`, centred, `24px 16px 48px` padding — a single dense screen.
- A **stat rail**: `grid-template-columns: repeat(3, 1fr)` with 10px gaps, each tile big-number-first.
- A **hero band** above the rail: gradient surface, accent left edge, big number left, ticking clock right.
- A **5:7 split grid** (`5fr 7fr`) pairing a form panel with a list panel; collapses to one column under 720px.
- **Table-as-rows**: fixed column grid (`82px 1fr 52px 66px 40px`), zebra with `--color-surface-2`, hairline row dividers, uppercase row head.
- Section heads are 11px uppercase labels with the range in normal case floated right. Content density is high: small paddings (14–16px in tiles), small gaps, no whitespace for its own sake.

## Components

- **Stat tile** — `--color-surface` box, 1px line border, 18px radius, padding `14px 16px 16px`; 11px uppercase label, 30px 900 tabular value, 12px sub that turns lime on an up-tick. A `hero` tile tints its border `rgba(201,242,79,.22)` and its value lime.
- **Streak hero** — 135° gradient `surface-2 → surface`, dim-accent border, 3px orange left edge, 18px radius, orange glow shadow; 56px glowing number + 28px lime clock that flips to warn when the streak is at risk.
- **Primary button** — full gradient `#e8590c → #ff922b`, white 900 text, 13px, `12px 16px` padding, 12px radius, orange drop shadow; hover brightens, active scales to .98, focus ring is 2px lime.
- **Text input** — `--color-surface-2` fill, 1px line border, 12px radius, `10px 12px` padding, 700 weight, `color-scheme: dark`; focus swaps border to orange plus the 3px soft ring.
- **Delete chip** — pill (999px), 1px line border, 11px 800 text in `--color-ink-3`, 36px wide; hover turns warn in text and border.
- **Run list / table** — grid rows at 13px 700, km column in orange 900, zebra rows, uppercase 11px head, last row borderless.
- **Bar chart** — SVG bars, 6px rounded tops, current week `#ff8c3a` with its total labelled above in orange 900, past weeks `#a3552a`, empty weeks a 2px `--color-ink-3` dash on the baseline; grid lines `--color-line`, axis text 10px `--color-ink-3`.
- **Tooltip** — fixed, `--color-surface-2`, dim-accent border, 10px radius, 8–11px padding, black drop shadow; label 11px uppercase, value 14px 900 with the key figure in lime.
- **Message line** — 12px 700 reserved-height line; err is warn, ok is lime.

## Do and don't

**Do**
- Lead with the number: biggest, heaviest type in the app is a data value, not a heading.
- Keep every numeric readout tabular so ticking clocks and counters don't jitter.
- Pair orange (the glow, the hero) with lime (the good news) and let warm neutrals do the rest.
- Keep it dense — 10px gaps, 14–16px tile padding, one screen.
- Put one playful line under the dark shell (a cheer line, a wink in the footer), never a mascot.
- Seed believable data so the first open already looks alive.

**Don't**
- Don't use white, light, or airy backgrounds — nothing below the warmth of `#17120f` as a surface.
- Don't introduce cold blues, greys, or pure `#000`/`#fff`.
- Don't bury numbers under confetti, badges, or celebration animations.
- Don't use cute mascots, stickers, or gimmicky illustrations.
- Don't add lots of whitespace or multi-screen scrolling ceremony for a single idea.
- Don't use light font weights in the UI — 500 is the floor, 800/900 carry the numbers.

## Use it with a coding agent

Build this in the style of DESIGN.md: a dense, warm, near-black single-screen app on `#0e0b09` with a soft sunset glow at the top. Use Nunito (500–900) with tabular-nums for every number, an 11px uppercase letter-spaced label style, tiles on `#17120f` with 1px `#2e2520` borders and 18px radii, a big glowing `#ff8c3a` hero number, `#c9f24f` for good news and `#ff6a5c` for warnings, a gradient orange button (`#e8590c → #ff922b`), and 10px grid gaps so everything fits one screen. No whites, no blues, no mascots, no celebration — the numbers are the celebration. Load tokens.css and consume its custom properties rather than re-hardcoding values.
