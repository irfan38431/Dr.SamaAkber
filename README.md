# Dr. Sama Akber — Profile Website

A single-page, static profile website. **Everything you might want to change — images,
links, text, and colors — lives in one file: `replacement.json`.** You never need to touch
the HTML, CSS, or JavaScript.

```
/
├── index.html          structure (don't edit for content changes)
├── styles.css          styling
├── config.js           reads replacement.json and fills the page
├── replacement.json    ← EDIT THIS to change content/links/images/colors
├── README.md           this file
└── assets/             images (logo, photo, building) — placeholders included
```

---

## How to run it locally

Because the page loads `replacement.json` with `fetch()`, it must be **served over HTTP** —
opening `index.html` directly (a `file://` path) will make the browser block the fetch and the
page will show the built-in fallback text instead of your edits.

From this folder, run **one** of:

```bash
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser. (Node alternative: `npx serve`.)

When deployed to any static host — **Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages** —
it is already served over HTTP, so it just works. Upload the whole folder.

---

## How to edit the site

Open `replacement.json` in any text editor (Notepad, VS Code, etc.), make your change, **save**,
then **refresh** the browser.

### Change a link (LinkedIn, publication PDF, socials, email)

Find the matching entry under `"links"` and replace the `#` (or old value) with the real URL:

```json
"links": {
  "email": "dr.samaakber@gmail.com",
  "instagram": "https://instagram.com/your-handle",
  "linkedin": "https://linkedin.com/in/your-handle",
  "x": "https://x.com/your-handle",
  "facebook": "https://facebook.com/your-page",
  "researchPublication": "https://example.com/your-paper.pdf",
  "linkedinArticles": "https://linkedin.com/in/your-handle/recent-activity/articles"
}
```

- `researchPublication` is the **View & Download** button on the Research card.
- `linkedinArticles` is the **Visit LinkedIn** button on the LinkedIn card.
- The email automatically becomes a working `mailto:` link and updates the visible address.

### Change an image

Two options:

1. **Easiest:** drop your new file into the `assets/` folder using the **same filename**
   (`oxymed-logo.png`, `doctor-photo.jpg`, `hospital-building.jpg`) — overwriting the
   placeholder. Nothing else to do.
2. Or add a file with a new name and point the path to it under `"assets"`:

```json
"assets": {
  "logo": "assets/oxymed-logo.png",
  "doctorPhoto": "assets/my-new-headshot.jpg",
  "hospitalBuilding": "assets/hospital-building.jpg"
}
```

> The doctor photo is cropped into a circle, so a **square** image looks best.

The hero **ECG line** and the four **value icons** are also swappable images now. Replace the
files in `assets/` (same filenames) or repoint these paths under `"assets"`:

```json
"ecgLine": "assets/ecg-line.png",
"valueIcons": {
  "patientFirst": "assets/icon-patient-first.png",
  "excellence": "assets/icon-excellence.png",
  "researchDriven": "assets/icon-research-driven.png",
  "communityFocused": "assets/icon-community-focused.png"
}
```

> Use transparent PNGs for these. The ECG line looks best wide (~7:1); each value icon is square.

### Change any text

Edit the matching string under `"content"` — for example the bio, a card body, the footer
tagline, or a value item. Whatever you type appears verbatim on the page.

### Change colors

Edit the hex values under `"theme"`. For example, to use a different accent green:

```json
"theme": {
  "greenAccent": "#5fb84a"
}
```

These drive the whole palette (background, cards, accents, text) instantly on refresh.

---

## Placeholder images note

The three files in `assets/` are **neutral placeholders** generated at the correct sizes and
aspect ratios so the layout looks right out of the box. Replace them with the real Oxymed logo,
Dr. Sama Akber's headshot, and the hospital building photo whenever you have them (see
"Change an image" above).

---

## Important: editing JSON safely

`replacement.json` is in **JSON** format, which is strict:

- Every text value must be wrapped in **double quotes** `"like this"` (not single quotes).
- Items in a list are separated by **commas** — but there is **no comma after the last item**.
- If you break the JSON (a missing quote, an extra comma), the page can't load it and will fall
  back to the built-in text — so if the page suddenly looks like it ignored your edits, that's
  the likely cause.

If that happens, paste the file contents into any free **JSON validator / linter** (search
"JSON lint" online), which will point to the exact line with the mistake. Fix it, save, refresh.

---

## Optional: zero-server mode

`config.js` will also use a global `window.REPLACEMENT` object if one exists. If you ever want
to open the page directly from disk without a server, create a `replacement.js` file containing
`window.REPLACEMENT = { ...same content as replacement.json... };` and add
`<script src="replacement.js"></script>` before `config.js` in `index.html`. The HTTP method
above is recommended and matches how real hosts serve the site.
