# Private Chat — everything you need

A simple private chat app for two people. Open it, type your name, and chat.
Messages are real-time and saved. Works on phones (installable to the home screen).

There are **no rooms and no passwords** — it's one shared conversation. Whoever opens
the app and knows the link is in the same chat. (Keep the link private to the two of you.)

## The files

| File | What it is |
|------|------------|
| `index.html` | The entire app — UI + chat logic. |
| `manifest.json` | Makes it installable as a phone app. |
| `sw.js` | Service worker — installability + instant load. |
| `icon.svg` | App icon. |
| `necessary.md` | This file. |

---

## Setup (≈10 minutes, one time)

### 1. Create a free Supabase project
1. Go to **https://supabase.com** → sign up (free).
2. Click **New project**, give it a name and a database password (keep it safe — you
   won't need it for this app), pick the nearest region, and wait ~2 min.

### 2. Create the messages table
Open **SQL Editor** → **New query**, paste this, click **Run**:

```sql
create table messages (
  id         bigint generated always as identity primary key,
  sender     text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

create index messages_created_idx on messages (created_at);

-- Let the browser read/write messages.
alter table messages enable row level security;
create policy "anyone can read"   on messages for select using (true);
create policy "anyone can insert" on messages for insert with check (true);
```

### 3. Turn on Realtime for the table
- Sidebar → **Database** → **Replication** (or **Realtime**), and enable the
  **`messages`** table for the `supabase_realtime` publication.

### 4. Get your API keys
- Sidebar → **Project Settings** → **API**. Copy:
  - **Project URL** (e.g. `https://abcdxyz.supabase.co`)
  - **anon public** key (the *anon/public* one — NOT `service_role`)

### 5. Paste them into the app
Open `index.html`, near the bottom find this block, replace the placeholders:

```js
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

---

## Run it

**Quick test on your computer:** double-click `index.html`.

**To use it on phones / from anywhere**, it needs an `https://` web address
(a double-clicked file can't be installed as an app). Free, drag-and-drop hosting:

- **Netlify Drop** — drag the whole `chat app` folder onto https://app.netlify.com/drop.
  You instantly get a public `https://...netlify.app` link. Easiest option.
- Or **Vercel** / **Cloudflare Pages** / **GitHub Pages**.

Upload the **whole folder** so all files go up together, then open the link.

## Install it as a phone app 📱
Open the hosted link in your phone browser, then:
- **iPhone (Safari):** Share button → **Add to Home Screen**.
- **Android (Chrome):** ⋮ menu → **Install app**.

It opens full-screen with its own icon, the message box stays above the keyboard,
and it respects notches. Your name is remembered on each device.

## Using it
Both people open the same link, each enters a name (use different names so you can
tell who said what), and start chatting. That's it.

---

## How private is it?
Anyone with the link can read/post, so **keep the link to just the two of you**.
Message text is stored in your Supabase database (not end-to-end encrypted). This is
fine for casual private chat; for anything sensitive use Signal — or ask me to add
end-to-end encryption.

## Want more?
I can add: end-to-end encryption, typing indicators, image sharing, read receipts,
or push notifications. Just ask.
