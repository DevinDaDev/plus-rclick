# Right Click Plus (plus.rclick.com)

Marketing and self-service mini-site for **Right Click Plus** — a 1-year rapid-recovery
service included at no additional cost when a customer buys qualifying hardware from
Right Click. When covered hardware fails, Right Click ships a pre-configured spare fast to
keep the customer's staff up and running with minimum downtime.

Two offerings:

- **Plus for Network Equipment** — routers, switches, and access points. Spares ship
  pre-configured. Target recovery is 8 business hours (same day).
- **Plus for Business Computers** — a handful of standardized laptop/desktop models.
  Hard-drive swap first, temporary loaner for up to one month with a buy-out option.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**. No database and no auth in v1.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build   # production build (used for deploys)
npm run start   # serve the production build
npm run lint    # eslint
```

## Pages

| Route          | What it is                                                          |
| -------------- | ------------------------------------------------------------------- |
| `/`            | Home — what Plus is, the two offerings, how it works, and a CTA.    |
| `/network`     | Plus for Network Equipment + covered-device grid.                   |
| `/computers`   | Plus for Business Computers + covered-model grid.                   |
| `/request`     | "Request my spare unit" form.                                       |
| `/api/request` | Receives the form submission (validates, then emails or logs it).   |

## Editing device data and pricing

All models, descriptions, and prices live in one file: [`src/data/devices.ts`](src/data/devices.ts).

- `networkDevices` — network equipment shown on `/network`.
- `computerDevices` — computers shown on `/computers`.

Each entry has `id`, `name`, `category`, `shortDescription`, `price` (a number, USD),
`imageUrl`, and `plusItemCode`. Edit the arrays and the site updates automatically.

> **Prices and models are placeholders.** Search the file for the `TODO` comment at the top
> and confirm the final lineup and pricing before launch.

Product images use a neutral placeholder (`public/placeholder-device.svg`). Replace with real
photos by adding images to `public/` and pointing each device's `imageUrl` at them. Do not
hotlink manufacturer marketing images.

## The request form

The form posts to `/api/request`. Delivery is handled by a single function
(`deliverRequest` in [`src/app/api/request/route.ts`](src/app/api/request/route.ts)) so a
ticketing integration can be swapped in later without touching the rest of the route.

- **With `RESEND_API_KEY` set:** the request is emailed via [Resend](https://resend.com).
- **Without it:** the request is logged to the server console and the form still succeeds.

The form always shows a confirmation screen on success.

## Environment variables

All are optional — the site builds and the form works without any of them.

| Variable            | Purpose                                                        | Default                                    |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------ |
| `RESEND_API_KEY`    | Enables emailing request notifications via Resend.             | _(unset — requests are logged instead)_    |
| `REQUEST_TO_EMAIL`  | Where request notifications are sent.                          | `support@rclick.com`                       |
| `REQUEST_FROM_EMAIL`| The "from" address for notification emails (verified in Resend).| `Right Click Plus <onboarding@resend.dev>` |

Set these in **Vercel → Project → Settings → Environment Variables**, then redeploy.

## Deploying

The project deploys to **Vercel**. Pushing to the linked GitHub repo triggers an automatic
production deploy. To deploy manually from the CLI:

```bash
vercel --prod
```

### Custom domain (do this after launch)

To point **plus.rclick.com** at this project: in the Vercel dashboard, open the project →
**Settings → Domains → Add**, enter `plus.rclick.com`, and follow the DNS instructions Vercel
shows (add the CNAME/A record it provides at your DNS host).
