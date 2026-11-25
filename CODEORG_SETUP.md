# Running on Code.org (cloud data)

**Step-by-step paste for your project:** see [CODEORG_APPLY.md](CODEORG_APPLY.md).

This app is an **App Lab** project, not a Web Lab project.  
**`readRecords` / `createRecord` / `updateRecord` only work inside App Lab on Code Studio.**  
`runtime.js` is for **local preview only** — it fakes those APIs with `localStorage`.

## Use App Lab (for Shark Tank / shared Finders table)

1. Sign in at [Code Studio](https://studio.code.org/).
2. **Projects** → open your original **App Lab** project (the one you exported from), or create a new **App Lab** project.
3. **Do not** rebuild the app in **Web Lab** if you need cloud data.
4. In App Lab **Code** tab, replace the code with your local `code.js` (copy-paste the whole file).
5. In **Design** tab, keep your screens/buttons as they are. If you changed `index.html` or `style.css` only on your computer, redo those changes in Design / the CSS pane in App Lab (there is no reliable “import zip back” into App Lab).
6. Open the **Data** tab (View data). Ensure a table named **`Finders`** exists with columns such as:
   - `Name`, `Image`, `Kind`, `Address`, `Status`
7. Click **Run** in App Lab (not “Open in Web Lab”). Test Finder submit → Maker sees the row in the cloud table.
8. **Share** → send the project link so judges/classmates use the same cloud project.

### Syncing edits from your computer

```bash
node sync-code.js   # only if you re-export a zip from App Lab tooling
```

For day-to-day updates on Code.org: edit `code.js` locally → paste into App Lab **Code** tab.

---

## Why Web Lab shows those console errors

If you copied files into **Web Lab**, the host is different from App Lab:

| Message | Cause | Fix (Web Lab only — still no cloud) |
|--------|--------|-------------------------------------|
| `Stylesheet not found: applab.css` | File path is `applab/applab.css` | Create folder **`applab`** and upload `applab.css` (and fonts) there |
| `Link resource not found: fa-solid-900.woff2` | Fonts live under `applab/` | Upload all `applab/*.woff2` files from your export |
| `Image not found: Screenshot-....png` | Screenshots live under `assets/` | Create folder **`assets`** and upload the three PNG files |
| `Image not found: EtL64AAA...` (random base64) | Web Lab mishandles very long `data:image/png;base64,...` URLs in `index.html` | Prefer **App Lab**; in Web Lab, avoid huge inline images (use `assets/` files only) |
| App works but data doesn’t sync across devices | `index.html` loads **`runtime.js`** | Remove `runtime.js` on Code.org — but Web Lab still won’t provide real `readRecords`; use **App Lab** for cloud |

Required file tree if you insist on Web Lab preview (localStorage only):

```text
index.html
code.js
style.css
runtime.js          ← localStorage only, not cloud
applab/
  applab.css
  fa-solid-900.woff2
  fa-regular-400.woff2
  fa-brands-400.woff2
  fa-v4compatibility.woff2
assets/
  Screenshot-2026-11-17-220052.png
  Screenshot-2026-11-19-095606.png
  Screenshot-2026-11-19-101602.png
```

---

## Local vs Code.org (quick reference)

| | Local (`RUN.bat`) | App Lab on Code.org |
|--|-------------------|---------------------|
| Runtime | `runtime.js` | Built-in App Lab |
| Finders data | Browser `localStorage` | Cloud table **Finders** |
| Best for | Coding / UI tweaks offline | Class demo & pitch |

Official note: [Exporting from App Lab](https://support.code.org/hc/en-us/articles/13211665878157-Exporting-Projects-from-App-Lab) — exports are meant for local editing; database APIs work in Code Studio, not in an exported zip on Web Lab.