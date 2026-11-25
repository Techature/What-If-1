<h1 align="center">What If: Give Waste A Second Life ✨</h1>

<p align="center">
<b>Turn old belongings into fresh starts — one reuse at a time.</b>
</p>

<p align="center">
What If is a mobile-style web app that connects people who want items remade (<b>Makers</b>) with people who have things to share (<b>Finders</b>). List what you have, browse what needs a creative touch, and get notified when a remake is on its way. You can also choose <b>Both</b> and switch between roles without leaving the app. Built for our Shark Tank–style classroom project with a classmate partner, Tvisha. 💚 Built by <a href="https://github.com/Techature">Techature</a>.
</p>

---

### 🌱 What It Does

1. Enter your name and start your reuse journey.
2. Pick **Maker**, **Finder**, or **Both** by clicking any of them. (No extra screens for Both; same dashboards for everyone).
3. **Finder** — Submit an item photo, type, and delivery address so a Maker can remake it.
4. **Maker** — Browse finder requests, view details, and tap **Sent** when the remake is ready to courier and pick up.
5. **Notifications** — Bell icon and inbox show when an item is ready for pickup (Stored in your browser).
6. **Both** — Choose Maker or Finder from the home chooser; use the **undo** profile button anytime to switch roles.

### 🌏 How It Helps

Lots of useful things end up in the trash because nobody knows how to give them a second life. This app makes reuse feel simple: Finders say what they have and where it can go, Makers see real requests instead of guessing, and both sides get clear updates when something is sent. It’s meant for students, families, and anyone learning that “waste” can become something valuable again — with less confusion and more trust.

### 🛠️ Tech Stack

- **Code.org App Lab** export (HTML + app layout)
- **JavaScript** — app logic (`code.js`)
- **Custom local runtime** (`runtime.js`) for fast offline preview
- **CSS** — mobile-first Blue + Mint design system (`style.css`)
- **Browser `localStorage`** — finder listings and notifications
- **Python** `http.server` — simple local hosting

### 🚀 Getting Started

```bash
cd "Shark Tank project"
python -m http.server 8080
```

Then open **http://localhost:8080/** in your browser.

On Windows, you can also double-click **`RUN.bat`** in the project folder — it starts the same server and prints the link.

**Option C — hybrid (same `code.js`, two runtimes)**

| URL | Runtime | Data |
|-----|---------|------|
| http://localhost:8080/ | `runtime.js` | Browser `localStorage` (offline dev) |
| http://localhost:8080/?cloud=1 | `runtime-cloud.js` | **[Supabase](https://supabase.com)** (free) — see [SUPABASE_SETUP.md](SUPABASE_SETUP.md) |

`index.html` loads `runtime-loader.js`, which picks the runtime. Fill in `config.js` with your Supabase URL + anon key; until then, `?cloud=1` falls back to `localStorage`.

> **Tip:** After you change `code.js` or styles, refresh the page. Data stays in your browser until you clear site storage.

**Pitch / classroom demo with cloud data:** run the app in **App Lab on Code.org**, not Web Lab. See [CODEORG_SETUP.md](CODEORG_SETUP.md).

### 💌 Ask me about...

Got ideas for new features? I'd love to hear them!

### 📫 How to reach me

Email me [here](mailto:sahana.aravind15@gmail.com?subject=github:%20What%20If%20Give%20Waste%20A%20Second%20Life) — add `github:` in the subject so I know it's about this repo.

---

<p align="center">As I'm just a kid, updates may come with a bit of delay. Thanks for understanding! 💞</p>
