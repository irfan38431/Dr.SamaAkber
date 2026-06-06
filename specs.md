# Build Spec — Dr. Sama Akber Profile Website (1:1 Replica)

> **Goal:** Build a pixel-faithful, fully responsive replica of the single-page profile
> at `https://drsamaakber.my.canva.site/profile`. Same name, same text, same structure,
> same color scheme. Must look correct on any screen size (desktop, tablet, mobile).
>
> This is a single-page, static marketing/profile page (a digital "business card" for a
> cardiologist). No backend, no database, no auth. Just HTML + CSS (+ a tiny bit of JS if
> wanted for nicety). It must be deployable as static files.

---

## 0. Tech stack (recommended)

- **Plain `index.html` + `styles.css`** (single static page). This is the simplest path for a
  one-page profile and deploys anywhere (Netlify, Vercel, GitHub Pages, S3).
- Use **CSS Flexbox + CSS Grid** for layout and **CSS `clamp()` / media queries** for
  responsiveness. No build step required.
- If you prefer a framework, **React + Tailwind** is acceptable — but keep it a single page/component.
  Do **not** over-engineer. No routing needed.
- All inline SVGs for icons (no icon-font dependency required). The ECG heartbeat line is an inline SVG.
- Fonts: a clean geometric sans-serif. Use **"Poppins"** (or "Nunito Sans" / system `-apple-system, "Segoe UI", Roboto, sans-serif` fallback) loaded from Google Fonts. Headings are bold; the name uses a heavy weight (700–800).

---

## 1. Required image assets (USER MUST SUPPLY THESE)

These three are raster images that cannot be regenerated from text. Place them in `/assets/`:

| File | What it is | Where used |
|------|-----------|-----------|
| `oxymed-logo.png` | Oxymed Hospital logo: green stylized heart/leaf mark + "OXYMED HOSPITAL" wordmark + small tagline "CLOSE TO YOUR HEART". Transparent PNG. | Top of left sidebar card |
| `doctor-photo.jpg` | Headshot of Dr. Sama Akber — man with short dark hair and beard, in a white lab coat with a stethoscope, neutral background. | Circular avatar in left sidebar |
| `hospital-building.jpg` | Photo of the Oxymed Hospital exterior (multi-storey building with "OXYMED HOSPITAL" signage). Used as a very faint, low-opacity background image behind the right-hand hero area. | Right column background |

> If these are not yet available, extract them from the Canva export, or use neutral
> placeholders of the same dimensions and aspect ratio so layout is unaffected.

Everything else (icons, ECG line, buttons) is built with inline SVG / CSS — no extra files.

---

## 2. Color tokens (define as CSS variables on `:root`)

```css
:root {
  --green-bg:        #16361c;  /* page background — deep forest green */
  --green-card:      #12301a;  /* the two dark cards on the right (slightly darker than bg) */
  --green-dark:      #143818;  /* dark green text on light surfaces */
  --green-accent:    #5fb84a;  /* bright accent green: "Director" line, role subtitle, ECG, value titles */
  --offwhite:        #f6f6f2;  /* left sidebar card background */
  --white:           #ffffff;  /* white container wrapping the two right cards */
  --text-body:       #2c2c2c;  /* body/paragraph text on light surfaces */
  --text-muted:      #5a5a5a;  /* small caps subtitles, "Get in Touch" label */
  --btn-light:       #f3f3f3;  /* pill button face (top of gradient) */
  --btn-light-2:     #d9d9d9;  /* pill button face (bottom of gradient) */
  --card-radius:     22px;
  --pill-radius:     999px;
}
```

Tune `--green-bg` / `--green-accent` against the reference screenshot until they match.

---

## 3. Page-level layout & structure

Overall: a **dark green full-bleed page**. On top of it sits a **two-column layout**.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PAGE (background: --green-bg, faint hospital-building image on right)      │
│                                                                            │
│  ┌────────────────┐   ┌──────────────────────────────────────────────┐   │
│  │  LEFT SIDEBAR  │   │  RIGHT COLUMN                                  │   │
│  │  (white card)  │   │   • Hero (name, titles, ECG line)              │   │
│  │                │   │   • White container with 2 dark green cards    │   │
│  │                │   │   • Values bar (4 items) + quote + location    │   │
│  └────────────────┘   └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Desktop (≥ 992px):** two columns side by side.
  - Left sidebar: fixed-ish width, roughly **30%** (e.g. `clamp(300px, 30%, 420px)`).
  - Right column: remaining **~70%**.
  - The left white card has **large rounded corners on its right side** (top-right & bottom-right corners are heavily rounded, ~30–40px) so it reads as a soft panel floating on the green. The left edge can be flush with the page edge.
- **Tablet (576–991px):** stack to a single column. Left card on top (full width, all corners rounded), right content below.
- **Mobile (< 576px):** single column, generous vertical spacing, fonts scale down via `clamp()`. Two right-hand cards stack; value items stack 1-per-row or 2x2.

Use a container max-width if you like (e.g. `1440px`) but the design should breathe full-width on large monitors.

---

## 4. LEFT SIDEBAR (white card) — top to bottom

Background `--offwhite`, big right-side corner radius on desktop. Comfortable internal padding (`~32px`).

1. **Logo** — `oxymed-logo.png`, centered, ~180–200px wide. (Green heart mark + "OXYMED HOSPITAL" + "CLOSE TO YOUR HEART".)

2. **Profile photo** — `doctor-photo.jpg` inside a perfect circle (`border-radius: 50%`, `object-fit: cover`), ~190px diameter, centered. Add a thin **green ring** border around it (`2–3px solid var(--green-accent)` with a small gap, or `border` + `padding` trick).

3. **Name** — `Dr. Sama Akber`
   - Bold, color `--green-dark`, centered, large (~`clamp(28px, 3vw, 36px)`).

4. **Subtitle** — `DIRECTOR, OXYMED HOSPITAL`
   - All caps, letter-spaced (`letter-spacing: 1.5px`), color `--text-muted`, small (~13px), centered, bold.
   - Below it, a **short thin horizontal divider** (centered, ~60px wide, light gray) for the underline effect under the subtitle.

5. **Role line** — `PREVENTIVE & INTERVENTIONAL CARDIOLOGIST | RESEARCHER`
   - All caps, bold, color `--green-dark`, centered, ~16px, wraps to 2 lines.

6. **Bio paragraph** (centered, color `--text-body`, ~16px, line-height ~1.5):
   > Dedicated to advancing cardiovascular healthcare through clinical excellence, research, and education. Committed to evidence-based medicine and improving patient outcomes.

7. **"Get in Touch" contact box** — a rounded-rectangle outlined box (`1px` light-gray border, radius ~12px, padding ~14px), containing:
   - A small **envelope icon** (green outline SVG) on the left.
   - Stacked text on the right:
     - Label: `Get in Touch` (small, bold, `--text-muted`, ~12px).
     - Email: `dr.samaakber@gmail.com` (bold, `--green-dark`, ~16px). Wrap in an `<a href="mailto:dr.samaakber@gmail.com">`.

8. **Social icons row** — four circular/solid icons, left-aligned, ~`28–32px` each, dark green, evenly spaced:
   - **Instagram** → link `#` (placeholder; user fills real URL)
   - **LinkedIn** → link `#`
   - **X (Twitter)** → link `#`
   - **Facebook** → link `#`
   - Use inline brand SVGs in `--green-dark`. Instagram & Facebook render as filled rounded glyphs; LinkedIn as the rounded-square "in"; X as the X glyph. All are `<a>` tags, `target="_blank" rel="noopener"`.

---

## 5. RIGHT COLUMN

Sits on the green background. A **faint hospital-building image** (`hospital-building.jpg`) is layered behind the hero area at low opacity (≈ `0.12–0.18`), blended into the green (e.g. `background-blend-mode: multiply` or an overlay `linear-gradient(rgba(22,54,28,.85), rgba(22,54,28,.92))` on top of the image). It should be subtle — text must stay fully legible.

### 5a. Hero block (top of right column)

- **Name** — `Dr. Sama Akber`
  - White (`--white`), extra-bold (~800), very large (`clamp(40px, 6vw, 72px)`), tight line-height.
- **Title line** — `Director, Oxymed Hospital`
  - Color `--green-accent`, ~`clamp(18px, 2.2vw, 26px)`, medium weight.
- **Role line** — `Preventive & Interventional Cardiologist`
  - **Italic**, color `--green-accent` (slightly lighter ok), ~`clamp(18px, 2.2vw, 26px)`.
- **ECG heartbeat graphic** — an inline SVG: a thin bright-green (`--green-accent`) horizontal line that spikes into a classic ECG/QRS waveform and **ends in a small heart shape** on the right. Stroke ~3px, `fill: none`, rounded line caps. Sits to the right of / below the titles in the hero. Width responsive.

  ```
  Reference shape:  ────────╱╲╱┐ ╱╲    ♥
                            (flat → small bump → tall spike → dip → small bump → heart)
  ```
  Build it as a single `<path>` (`stroke-linejoin/linecap: round`) plus a heart `<path>` at the end, both in accent green. Optional: animate with `stroke-dasharray`/`stroke-dashoffset` for a subtle "draw" effect (nice-to-have, not required for 1:1).

### 5b. White container with two dark green cards

A **white rounded rectangle** (`--white`, radius `--card-radius`, padding ~22px) wraps **two stacked dark-green cards** with a gap (~20px) between them.

**Card 1 — Research Publications**
- Background `--green-card`, radius `--card-radius`, padding ~28px.
- Internal horizontal layout (flex): `[icon] [text block ........] [button]`.
- **Icon (left):** outline-style SVG of stacked documents/papers with a small megaphone, white strokes (~64px box).
- **Text block (middle):**
  - Title: `Research Publications` — white, bold, ~22px.
  - Body: `Akber S, et al. Combined EECP and HBOT in Ischemic Cardiomyopathy. J Card Fail. 2026.` — white, ~16px, line-height 1.4.
- **Button (right):** `View & Download`
  - Pill shape (`--pill-radius`), light gradient face (`linear-gradient(180deg, var(--btn-light), var(--btn-light-2))`), text `--green-dark` bold ~17px, **underlined**, subtle drop shadow, padding ~`14px 28px`. Hover: slight lift / brighten. `<a href="#">` (user supplies the real PDF/publication link).

**Card 2 — LinkedIn Articles**
- Same card styling as Card 1.
- **Icon (left):** large white **LinkedIn "in"** glyph (~64–72px). (Plain white "in", not the blue box, to match the reference.)
- **Text block (middle):**
  - Title: `LinkedIn Articles` — white, bold, ~22px.
  - Body: `Read my latest articles and professional insights on LinkedIn.` — white, ~16px.
- **Button (right):** `Visit LinkedIn` — identical pill button style as Card 1, **underlined**, `<a href="#">` (user supplies real LinkedIn URL), `target="_blank"`.

> **Responsive note for cards:** on narrow screens, switch the inner flex to `flex-direction: column`, center the icon and text, and make the button full-width (or auto-width centered) below the text.

### 5c. Values bar + footer (bottom of right column)

A row of **four value items**, evenly spaced (CSS Grid `repeat(4, 1fr)` on desktop → `repeat(2, 1fr)` on tablet → `1fr` on mobile). Each item = an **outline white icon (~44px)** on the left, with a two-line text block on the right:

| Icon (white outline SVG) | Title (accent green, bold ~16px) | Subtext (white, ~13px) |
|---|---|---|
| Two hands cradling a heart | `Patient First` | `Compassionate care is our priority.` |
| Award/seal ribbon with a check | `Excellence` | `Committed to clinical excellence.` |
| Document with a small bar chart | `Research Driven` | `Advancing knowledge through research.` |
| Group of people (heads) in a hand/arc | `Community Focused` | `Building a healthier community together.` |

Below the values row:
- **Centered tagline** (italic, white, with literal quotation marks):
  > "Excellence in Cardiac Care. Commitment to Life."
- **Bottom-right location line** (bold, white, ~14px): `Oxymed Hospital, Chennai, India`

On mobile, center the location line too.

---

## 6. Exact text content (copy verbatim — do not alter)

```
LEFT SIDEBAR
  Logo wordmark:     OXYMED HOSPITAL
  Logo tagline:      CLOSE TO YOUR HEART
  Name:              Dr. Sama Akber
  Subtitle:          DIRECTOR, OXYMED HOSPITAL
  Role:              PREVENTIVE & INTERVENTIONAL CARDIOLOGIST | RESEARCHER
  Bio:               Dedicated to advancing cardiovascular healthcare through clinical
                     excellence, research, and education. Committed to evidence-based
                     medicine and improving patient outcomes.
  Contact label:     Get in Touch
  Email:             dr.samaakber@gmail.com
  Socials:           Instagram, LinkedIn, X, Facebook

HERO
  Name:              Dr. Sama Akber
  Title:             Director, Oxymed Hospital
  Role (italic):     Preventive & Interventional Cardiologist

CARD 1
  Title:             Research Publications
  Body:              Akber S, et al. Combined EECP and HBOT in Ischemic Cardiomyopathy. J Card Fail. 2026.
  Button:            View & Download

CARD 2
  Title:             LinkedIn Articles
  Body:              Read my latest articles and professional insights on LinkedIn.
  Button:            Visit LinkedIn

VALUES
  Patient First       — Compassionate care is our priority.
  Excellence          — Committed to clinical excellence.
  Research Driven     — Advancing knowledge through research.
  Community Focused   — Building a healthier community together.

FOOTER
  Tagline:           "Excellence in Cardiac Care. Commitment to Life."
  Location:          Oxymed Hospital, Chennai, India
```

---

## 7. Responsive behavior (must support any screen size)

- Use `clamp()` for every major font size and key paddings so type scales smoothly.
- Breakpoints:
  - **≥ 992px** — two-column (sidebar + content side by side); 4-up values grid.
  - **576–991px** — single column; sidebar full-width on top with all corners rounded; values grid 2x2; right cards keep horizontal layout if space allows, else stack.
  - **< 576px** — single column; right cards switch to vertical (icon/text/button stacked); buttons full-width; values stack 1-per-row; reduce paddings.
- Images: `max-width: 100%`, circular photo keeps aspect via `object-fit: cover`.
- No horizontal scroll at any width. Test at 320px, 375px, 768px, 1024px, 1440px, 1920px.
- The faint building background should not overpower text on small screens — consider lowering its opacity further or hiding it under ~576px.

---

## 8. Interactions / polish

- All buttons and social icons are real `<a>` links with `:hover` and `:focus-visible` states (slight scale/lift, shadow change, brightness). Keyboard-focusable.
- `mailto:` on the email.
- External links (`Visit LinkedIn`, socials, publication): `target="_blank" rel="noopener noreferrer"`.
- Add sensible `alt` text on all images (logo, photo, building).
- Add `<title>Preventive & Interventional Cardiologist | Researcher</title>` and basic meta (description, viewport `width=device-width, initial-scale=1`, og:title).
- Accessibility: semantic landmarks (`<header>`, `<main>`, `<footer>`), `aria-label` on icon-only links, sufficient contrast (the accent green on dark green meets contrast for large text only — keep body text white).

---

## 9. File structure

```
/
├── index.html
├── styles.css
└── assets/
    ├── oxymed-logo.png        (user-supplied)
    ├── doctor-photo.jpg       (user-supplied)
    └── hospital-building.jpg  (user-supplied)
```

(SVG icons + ECG line are inline in `index.html`, so no separate icon files needed.)

---

## 10. Acceptance criteria (definition of "1:1")

- [ ] Layout matches the reference: white rounded sidebar on the left, green content area on the right.
- [ ] All text matches §6 exactly (spelling, capitalization, punctuation, the `|` in the role line, the quotes around the tagline).
- [ ] Color scheme matches: deep forest-green background, darker green cards, off-white sidebar, white card wrapper, bright-green accents.
- [ ] Logo, circular photo, and faint hospital building present in the correct positions.
- [ ] ECG heartbeat line with a heart at the end appears in the hero, in accent green.
- [ ] Two dark-green cards (Research Publications, LinkedIn Articles) each with icon + text + underlined pill button.
- [ ] Four value items with white outline icons and green titles.
- [ ] Social row: Instagram, LinkedIn, X, Facebook.
- [ ] Fully responsive with no horizontal scroll from 320px → 1920px.
- [ ] Links functional (mailto, placeholders for socials/publication/LinkedIn that the user can fill in).
```