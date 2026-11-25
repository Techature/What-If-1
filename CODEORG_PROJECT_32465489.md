# Code.org remix project (use this link)

**Edit:** https://studio.code.org/projects/applab/32465489-8f17-4bb5-8e1b-8c845b1539aa/edit

Do **not** paste `code.js` from the GitHub export. Paste **`codeorg-handoff/code.codeorg.js`** instead.

## Your Design IDs (already in the project)

| Screen | Elements |
|--------|-----------|
| **Start** | `naem`, `button1`, `errorText`, `image1`, … |
| **screen2** | `roleTitle`, `makerImage`, `finderImage`, `bothButton`, `nextStepBtn`, `choiceText` |
| **bothScreen1** | `label9`, **`both_maker`**, **`both_finder`** |
| **makerScreen1** | `label5`, `image4`, `sent`, `image5`, `image6`, `label7`, **`image7`** (profile) |
| **finderScreen1** | `text_input1`, `text_input2`, `button2`, `label6`, `ring1`, **`image2`** (profile) |

## One Design fix you still need

On **finderScreen1**, add a **Text input** with id **`text_input3`** (delivery address).  
The code reads address from `text_input3`; right now that field only exists on **Start** in your app, not on the Finder form.

## Steps

1. **Code** → delete everything → paste all of `codeorg-handoff/code.codeorg.js` → save.
2. **Design** → finderScreen1 → add `text_input3` if missing.
3. **Data** → table **`Finders`** (`Name`, `Image`, `Kind`, `Address`, `Status`).
4. **Run**.

## Why the old paste failed

- Local `code.js` uses **`document`** (not allowed in App Lab).
- Local export uses **`image7` / `image8`** on bothScreen1; your remix uses **`both_maker` / `both_finder`**.
- Local export adds **`makerCard`**, **`makerBell`**, **`image3`** — your remix never had those.