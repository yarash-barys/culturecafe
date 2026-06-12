# Culture Cafe -- Kalkulator kalorii

Calorie calculator for Culture Cafe (Poland). Guests scan a QR code or follow a link from Instagram, browse the menu by category, pick dishes, and see total macros (proteins, fats, carbs) and calories in real time.

Polish-language interface, mobile-first.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Menu data from a published Google Sheets CSV (via `VITE_SHEET_CSV_URL`)

## Local development

### Prerequisites

- Node.js >= 16
- npm

### Setup

```bash
git clone <repo-url> && cd culturecafe
npm install
```

Create a `.env` file in the project root:

```
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/<YOUR_SHEET_ID>/pub?gid=0&single=true&output=csv
```

The URL points to a Google Sheet published as CSV (**File > Share > Publish to web > CSV**).

The sheet must have these columns: `category_id`, `category_name`, `id`, `name`, `proteins`, `fats`, `carbs`, `kcal`.

### Run

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build & preview

```bash
npm run build      # outputs to dist/
npm run preview    # serves the built files locally
```

## Deployment (Cloudflare Pages)

1. Push the repo to GitHub.
2. In Cloudflare dashboard: **Pages > Create a project > Connect to Git**.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add the environment variable `VITE_SHEET_CSV_URL` in **Settings > Environment variables**.
5. Bind a custom domain in the Pages project settings.

Every `git push` to `main` triggers an automatic deploy (~30 s).

## Updating the menu

Edit the Google Sheet. The app fetches fresh CSV data on each page load -- no redeploy needed.
