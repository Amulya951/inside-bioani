# Inside BioAni

The monthly internal celebration newsletter of BioAni India Pvt. Ltd.
Plain HTML, CSS and JavaScript. No framework, no server, no build step needed to
preview. Open `index.html` in a browser and it works.

This is **not** the corporate website (https://bioani.in/). It is an internal
magazine for employees.

---

## How the project is organised

Content, data, layout and styling live in separate places, so a monthly update
never touches design code.

```
index.html                 Page shell. Loads everything below, in order.
data/
  config.js                Publication settings + list of editions (archive).
  employees.js             Everyone: name, date of birth, designation, joining date, photo, flags.
  company.js               Founder, leadership, business areas, microalgae steps, quiz.
  editions/2026-09.js      Everything specific to September 2026.
scripts/
  core.js                  Helpers: dates, photos, placeholders, birthday & anniversary logic.
  components/*.js          One file per group of sections (cover, people, birthdays, …).
  app.js                   Chooses the edition and renders the sections in order.
styles/main.css            Design system: colours, type, layout, responsive rules.
assets/photos/             Real photographs. See assets/photos/README.md for exact filenames.
integrations/              Outlook / Microsoft 365 notification design (not active).
build.py                   Builds one self-contained HTML file for publishing.
dist/inside-bioani.html    The built file.
```

---

## What updates itself

- **Birthdays.** Calculated from `dob` in `data/employees.js` for the edition's
  month, sorted by date. The birth year is never shown. Today's birthday gets a
  spotlight; if there is none, the next one does ("Coming up tomorrow" when it is
  tomorrow). Several people on the same day are supported. A month with no
  birthdays shows a friendly empty state.
- **Work anniversaries.** Calculated from `joiningDate` (format `YYYY-MM-DD`):
  6 months, then every full year. Extra approved milestones can be added in the
  edition file.
- **Cover lines, counts and the joiner summary** are worked out from the data
  ("Thirteen colleagues join BioAni", "Seven September birthdays").
- **Empty sections** show a designed "coming soon" state with a way to contribute,
  never a blank or broken block.

---

## Publishing a new month (e.g. October 2026)

1. Copy `data/editions/2026-09.js` to `data/editions/2026-10.js`.
   Inside it, change `id: '2026-10'`, `month: 10`, `label: 'October 2026'`, and
   empty or replace every list.
2. Add one line in `index.html`, under the September line:
   `<script src="data/editions/2026-10.js"></script>`
3. In `data/config.js`: add `{ id: '2026-10', label: 'October 2026' }` at the
   **top** of `IB.editionIndex`, and set `currentEdition: '2026-10'`.
4. Update `data/employees.js` for new joiners (and any new birthdays or joining
   dates). Put their ids in the new edition's `newJoiners` list.
5. Add photos to `assets/photos/`.
6. Preview with `index.html?editor=1` (see below), then run `python3 build.py`
   and publish `dist/inside-bioani.html`.

September stays in the archive automatically and can still be opened.

### Adding content to an edition

Each list in the edition file has its format written above it. Summary:

| Field | Shape |
|---|---|
| `founderMessage` | `status: 'published'`, `title`, `paragraphs: ['…', '…']`, `pullQuote` (copied word for word from a paragraph) |
| `highlights` | `{ title, text, section }` — `section` is an anchor such as `'events'` |
| `promotions` | `{ employeeId, from, to, note }` |
| `achievements` | `{ employeeId or team, title, text }` |
| `milestones` | `{ employeeId, label: '10 years' }` |
| `productSpotlight` | `{ brand, name, fullName, category, description, images: ['front.jpg', …], details: [], detailsNote, whyFeatured, amazonUrl }` or `null`. Two or more `images` become a drag-to-turn 360° view; tapping it opens `amazonUrl`. |
| `innovationStories` | `{ title, text, image }` |
| `events` | `{ title, date: 'YYYY-MM-DD', text, photos: ['file.jpg'] }` |
| `recognitions` | `{ employeeId or team, award, text }` |
| `employeeVoice` | `{ employeeId, prompt, text }` — real submissions only |
| `beyond` | `{ employeeId, title, text, photo }` |
| `opportunities` | `{ title, description, deadline, ctaLabel, ctaUrl or ctaEmail }` |

Leadership goes in `data/company.js` as
`{ name, designation, area, photo }` (leader photos are named `leader-firstname-lastname.jpg`
so they never clash with an employee of the same name). The founder's name, title,
letter portrait (`founder-photo.jpg`) and round portrait (`founder-avatar.jpg`) are in `IB.founder`.

### Editorial rules built into the design

- Never paraphrase the founder. Paste their exact words, one paragraph per string.
- Quotes from employees only if they actually said them, with their name.
- Amazon button appears only when `amazonUrl` is filled in.
- No "best-selling", "number one" or similar claims unless BioAni has approved them.
- No stock, AI-generated or look-alike photos. A missing photo is fine; the page
  shows a monogram placeholder instead. Missing event photos are simply left out.

---

## Editor mode and testing

Add these to the end of the page address while previewing:

- `?editor=1` — shows data warnings for editors only (missing dates of birth,
  unconfirmed designations, unusual birth years, unverified business copy, items
  awaiting content). Employees never see these notes.
- `?date=2026-09-24` — pretend it is a particular day, to check the birthday
  spotlight.
- `?edition=2026-09` — open a specific edition.

Combine them with `&`: `index.html?editor=1&date=2026-09-24`.

### Data flags

Set in `data/employees.js` as `flags: ['…']`:

| Flag | Meaning |
|---|---|
| `dob-missing` | No date of birth supplied; person is skipped in birthdays. |
| `dob-year-check` | Birth year looks wrong. Only day and month are used, so birthdays still work. |
| `designation-unconfirmed` | Shows "Designation to be confirmed" publicly until removed. |

---

## Building and publishing

```
python3 build.py
```

Produces `dist/inside-bioani.html`: one file with all styles, scripts and every
photo in `assets/photos/` embedded. Share or host that single file. Fonts load
from Google Fonts; if blocked, the page falls back to Georgia and system sans
fonts and still reads well.

To host the folder version instead (e.g. on an intranet or SharePoint), upload the
whole project and open `index.html`. Photos then load from `assets/photos/`.

---

## Accessibility and devices

- Works from phones to large desktops; sections re-compose rather than shrink.
- Full keyboard use: menus, dropdowns, birthday wishes dialog and quiz.
- Respects "reduce motion" settings: confetti and floating animations switch off.
- Colour contrast checked for text on every background. Gold is used as
  decoration on light surfaces and as text only on dark ones.
- Prints cleanly (menus and animations are removed).

---

## Outlook / Microsoft 365 notification

See `integrations/outlook-notification.md`. It is a design for a future
"new edition is out" email, **not a working feature**. Nothing in this project
sends email.

Contact: hr@bioani.in
