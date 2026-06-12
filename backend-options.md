# Backend & Admin Panel Options for CultureCafe

## Current setup

- **Frontend:** React 18 + Vite + Tailwind, deployed on Cloudflare Pages
- **Data:** Google Sheets CSV fetched on page load
- **Data model:** Categories > Dishes (name, proteins, fats, carbs, kcal)

The data model is simple and flat — this is a strong point because it means almost any backend will work well. The key decision is how much infrastructure you want to manage.

---

## Option 1: Supabase (Recommended)

**What it is:** Hosted Postgres database with auto-generated REST/GraphQL API, auth, and a built-in table editor that works as a basic admin panel out of the box.

**Why it fits:**

- Free tier is more than enough (500 MB database, 50K monthly active users)
- You get a Postgres database with a web UI — you can manage categories and dishes directly in the Supabase dashboard without building a custom admin panel at first
- Auto-generated REST API means your React app just switches from fetching CSV to fetching from `https://your-project.supabase.co/rest/v1/dishes`
- Row-level security lets you lock down writes to authenticated admin users
- If you later want a custom admin panel, the JS client (`@supabase/supabase-js`) makes it trivial

**Database schema (2 tables):**

```sql
CREATE TABLE categories (
  id         SERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE dishes (
  id          SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  proteins    NUMERIC(5,1) NOT NULL,
  fats        NUMERIC(5,1) NOT NULL,
  carbs       NUMERIC(5,1) NOT NULL,
  kcal        INT NOT NULL,
  sort_order  INT DEFAULT 0,
  visible     BOOLEAN DEFAULT TRUE
);
```

**Migration effort:** Low. Replace the CSV fetch with a Supabase query. ~1-2 hours.

**Cost:** Free for this scale. Paid starts at $25/mo if you outgrow limits.

---

## Option 2: Cloudflare D1 + Workers

**What it is:** SQLite database running on Cloudflare's edge, managed via Cloudflare Workers (serverless functions). You'd build a small API and admin panel yourself.

**Why it fits:**

- You're already on Cloudflare Pages, so everything stays in one ecosystem
- D1 free tier: 5 GB storage, 5M reads/day — way more than you need
- Ultra-fast reads because the DB is at the edge, close to users
- Workers free tier: 100K requests/day

**What you'd need to build:**

- A small Workers API (CRUD for categories and dishes) — ~100-150 lines
- An admin page in your React app (or a separate mini-app) for managing menu items
- Simple auth (even a hardcoded password behind Cloudflare Access would work)

**Migration effort:** Medium. You need to write the API layer and admin UI. ~1-2 days.

**Cost:** Free for this scale. Paid Workers is $5/mo.

---

## Option 3: Firebase (Firestore + Auth)

**What it is:** Google's NoSQL document database with real-time sync, auth, and hosting.

**Why it fits:**

- Very generous free tier (1 GB storage, 50K reads/day)
- Firestore's document model maps directly to your data: a `categories` collection, each containing a `dishes` subcollection
- Firebase Auth gives you login with email/password or Google account for the admin
- Real-time updates — if you edit a dish in the admin panel, the public app sees it instantly

**Downsides:**

- NoSQL means no relational integrity (no foreign keys) — you manage consistency in code
- Vendor lock-in to Google ecosystem
- Firestore query syntax is more limited than SQL
- No built-in admin UI for data — you'd need to build one or use a third-party tool

**Migration effort:** Medium. Learn Firestore SDK, build admin UI. ~1-2 days.

**Cost:** Free for this scale.

---

## Option 4: Directus (self-hosted headless CMS)

**What it is:** Open-source headless CMS that wraps any SQL database and auto-generates a REST/GraphQL API plus a polished admin panel.

**Why it fits:**

- Beautiful, ready-made admin panel — no frontend work needed for CRUD
- Supports Postgres, MySQL, SQLite
- Role-based access control built in
- Can host free on Railway, Render, or Fly.io (free tiers)

**Downsides:**

- Another service to maintain (updates, uptime)
- Overkill if you only have 2 tables
- Free hosting tiers may sleep after inactivity (cold starts)

**Migration effort:** Medium. Set up Directus instance, define collections, point React app at its API. ~half a day for setup, plus switching the frontend fetch.

**Cost:** Free if self-hosted on a free tier. Directus Cloud starts at $15/mo.

---

## Comparison

| Criteria                  | Supabase       | Cloudflare D1   | Firebase        | Directus        |
|---------------------------|----------------|-----------------|-----------------|-----------------|
| Admin panel included      | Basic (table editor) | No (build it) | No (build it)   | Full CMS        |
| Custom admin effort       | Optional       | Required        | Required        | Not needed      |
| Database type             | Postgres (SQL) | SQLite (SQL)    | NoSQL (Firestore)| SQL (any)      |
| Stays in Cloudflare       | No             | Yes             | No              | No              |
| Free tier sufficient      | Yes            | Yes             | Yes             | Yes (self-host) |
| Migration effort          | ~2 hours       | ~1-2 days       | ~1-2 days       | ~4-6 hours      |
| Real-time updates         | Yes            | No              | Yes             | Yes (websocket) |
| Auth built in             | Yes            | No (use CF Access) | Yes          | Yes             |

---

## My recommendation

**Start with Supabase.** Here's why:

1. **Fastest path from Google Sheets to a real database.** Your CSV columns map 1:1 to SQL columns. The Supabase dashboard table editor is essentially a better version of what you're already doing in Google Sheets — but with proper types, relations, and an API.

2. **No admin panel to build on day one.** The Supabase dashboard itself is your admin panel. When you want something more polished or want to give access to staff who shouldn't see the full dashboard, you can build a simple admin page in your existing React app.

3. **Postgres is the most portable choice.** If you ever outgrow Supabase, you can take your Postgres database anywhere. No vendor lock-in on the data layer.

4. **The migration is minimal:**
   - Create 2 tables in Supabase
   - Import your current menu data (paste from the JSON/CSV)
   - Replace the CSV fetch in React with `supabase.from('dishes').select('*, categories(*)')`
   - Done

If staying 100% within Cloudflare is a priority, go with **Option 2 (D1 + Workers)** — but expect to build more yourself.
