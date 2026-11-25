# Apply local app to your App Lab project

**Your project:** [Open in App Lab](https://studio.code.org/projects/applab/32465489-8f17-4bb5-8e1b-8c845b1539aa/edit)

Use **`codeorg-handoff/code.codeorg.js`** (not `code.js`) — see [CODEORG_PROJECT_32465489.md](CODEORG_PROJECT_32465489.md).

I **cannot** sign into your Code.org account from Cursor. You do **three quick paste steps** below (~10 minutes). The full `index.html` is **not** pasted into Code.org — App Lab keeps the design in the **Design** tab on their servers.

---

## Important: App Lab, not Web Lab

| Do this | Don’t do this |
|--------|----------------|
| Edit **App Lab** at the link above | Upload files to **Web Lab** |
| Paste `code.js` + `style.css` | Upload `index.html` or `runtime.js` |
| **Run** inside App Lab | Expect cloud data on localhost |

---

## Step 1 — Paste JavaScript (required)

1. Open your project link (sign in if asked).
2. Click **Code** (blocks or text mode — use **text** / `</>` if you have it).
3. On your computer, open `codeorg-handoff/code.js` (or the project’s `code.js`).
4. **Select all** → **Copy** → in App Lab, **select all code** → **Paste** → save.

Cloud APIs (`readRecords`, `createRecord`, `updateRecord`) work automatically here.

---

## Step 2 — Paste CSS (required for Blue + Mint look)

1. In App Lab, open the file list (often **CSS** or `style.css` next to `code.js`).
2. If there is no `style.css`, use **Add file** → name it `style.css` (App Lab allows this on many accounts).
3. Copy **all** of `codeorg-handoff/style.css` → paste into App Lab’s `style.css` → save.

You do **not** need `applab/applab.css` or `.woff2` fonts on Code.org — those errors only happen in Web Lab.

---

## Step 3 — Check Design (screens & IDs)

Your `code.js` expects these **screen IDs** and **element IDs**. In **Design** mode, use the screen dropdown and property panel to confirm names match exactly:

| Screen ID | Purpose |
|-----------|---------|
| `screen1` | Name entry |
| `screen2` | Role pick (Maker / Finder / Both) |
| `bothScreen1` | Pick Maker or Finder when role is Both |
| `makerScreen1` | Maker dashboard |
| `finderScreen1` | Finder form |
| `screen5` | (if you use it in your flow) |

| Element ID | Where |
|------------|--------|
| `naem`, `button1`, `errorText` | screen1 |
| `roleTitle`, `choiceText`, `makerImage`, `finderImage`, `makerCard`, `finderCard`, `bothButton`, `nextStepBtn` | screen2 |
| `label9`, `image7`, `image8` | bothScreen1 |
| `image3` | maker profile (undo when Both) |
| `image2` | finder profile (undo when Both) |

### If `bothScreen1` or `bothButton` is missing (common after old export)

**A. Screen `bothScreen1`**

1. Design → **Screens** → **New screen** → rename ID to **`bothScreen1`** (not “screen3”).
2. Add **Label** → ID **`label9`** → text: `Choose Maker or Finder`.
3. Add **Image** (icon) → ID **`image7`** → icon e.g. search/paint (Maker tile — you can match maker style).
4. Add **Image** (icon) → ID **`image8`** → Finder tile.

**B. Button on `screen2`**

1. Go to **screen2**.
2. Add **Button** → ID **`bothButton`**.
3. Text: **Both — Maker & Finder** (or similar).
4. Position under Maker/Finder cards (see `Design.md` / local app).
5. In CSS you already pasted, class `st-both-role-btn` is optional; ID `bothButton` is what matters.

**C. Photos**

1. Design → **Assets** → upload:
   - `assets/Screenshot-2026-11-17-220052.png`
   - `assets/Screenshot-2026-11-19-095606.png`
   - `assets/Screenshot-2026-11-19-101602.png`
2. Assign them to `image1`, `makerImage`, `finderImage` (or your hero images) in the property panel.

---

## Step 4 — Data table (cloud)

1. **Data** tab (View data).
2. Table name must be **`Finders`** (same spelling as in `code.js`).
3. Columns: `Name`, `Image`, `Kind`, `Address`, `Status` (and `id` if App Lab adds it).

---

## Step 5 — Run & share

1. **Run** (phone preview) inside App Lab.
2. Test: Finder submits → Maker sees row in **Data** tab.
3. **Share** → use that link for your pitch (not Web Lab, not GitHub `runtime.js`).

---

## If your Design already looked right before export

If this URL is the **same project you exported from**, you may **only** need Step 1 + 2 (+ Data table). You do **not** need to recreate every screen from `index.html`.

---

## Files in `codeorg-handoff/`

| File | Use on Code.org |
|------|------------------|
| `code.js` | Paste into Code tab |
| `style.css` | Paste into CSS file |
| `bothScreen1-snippet.html` | Reference only (IDs/layout) — not uploaded |
| `README.txt` | Short reminder |

Regenerate handoff after edits:

```bash
node scripts/extract-screen-snippet.js
```