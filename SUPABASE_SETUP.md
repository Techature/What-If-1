# Supabase cloud data (no custom API)

Use this for **Option C** shared Finders data on **http://localhost:8080/?cloud=1** (and any static host that serves this folder).

Code.org App Lab still uses its own cloud table — this Supabase setup is for the **GitHub / localhost** app only.

## 1. Create a free project

1. Go to [supabase.com](https://supabase.com) and sign up.
2. **New project** → pick a name and password (save the password somewhere safe).
3. Wait until the project finishes provisioning.

## 2. Create the table

1. In the dashboard: **SQL Editor** → **New query**.
2. Paste everything from [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.

You should see a `finders` table under **Table Editor**.

## 3. Copy API keys into the app

1. **Settings** → **API Keys** (or **General** for Project URL).
2. Copy **Project URL** (`https://xxxxxxxx.supabase.co`).
3. Copy the **Publishable key** (`sb_publishable_...`) — safe for the browser.  
   **Do not** use **Secret keys** (`sb_secret_...`).
4. Older docs mention **anon** keys starting with `eyJ`; if you only see `sb_publishable`, use that.
5. Open `config.js`:

```javascript
window.SHARK_TANK_SUPABASE_URL = "https://xxxxxxxx.supabase.co";
window.SHARK_TANK_SUPABASE_ANON_KEY = "sb_publishable_...";
```

(Or copy `config.example.js` → `config.js` first.)

## 4. Run

```bash
python -m http.server 8080
```

- **Shared data:** http://localhost:8080/?cloud=1  
- **Offline only:** http://localhost:8080/

Open the browser console on `?cloud=1` — you should see a message that Supabase is connected.

## Security note (class project)

The SQL above lets **anyone with your anon key** read/write `finders`. That is OK for a classroom demo; for a public site you would tighten Row Level Security later.

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Still uses localStorage | Check `config.js` is loaded and both URL + anon key are filled in |
| 401 / 403 on fetch | Re-run `schema.sql` policies; use **publishable** key, not secret |
| Empty Maker list | Add a row in **Table Editor** or submit as Finder in the app |