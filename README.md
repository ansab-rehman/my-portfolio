# Ansab Rehman — Portfolio

Soft-dark, product-spec personal site for [Ansab Rehman](https://linkedin.com/in/ansabrehman/). Built with Vite, React, and TypeScript. No UI kit, no template layout.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # serve dist locally
```

## Free deploy — Cloudflare Pages

1. Create a GitHub repository and push this project.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → connect the repo.
3. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 (or newer LTS)
4. Deploy. You get a free `*.pages.dev` URL with HTTPS.

Every push to the production branch rebuilds automatically.

## Custom domain — `ansabrehman.com`

### Buy the domain (cheapest long-term)

Check live prices the day you buy (registry fees drift):

| Priority | Registrar | Notes |
| --- | --- | --- |
| Best long-term | [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) | At-cost `.com` (~$10/yr register = renew), free WHOIS. Must use Cloudflare DNS — ideal with Pages. |
| Best UX + extras | [Porkbun](https://porkbun.com) | Near at-cost (~$11/yr flat), free privacy + email forwarding. |
| Lowest year-1 only | [Namecheap](https://www.namecheap.com) | Promo first year; renewals usually higher — fine if you transfer later. |

**Avoid** registrars that sell year-1 for $1–5 then renew near $20+.

**Suggested path:** Register on **Cloudflare Registrar** → host on **Cloudflare Pages** → attach the domain in the same account.

### Point DNS at Pages

1. Cloudflare Pages project → **Custom domains** → add `ansabrehman.com` and `www.ansabrehman.com`.
2. If the domain is on Cloudflare Registrar, DNS records are usually configured for you — wait for SSL to become **Active**.
3. If the domain is elsewhere, set nameservers to Cloudflare (or add the CNAME/A records Pages shows).

## Contact

This site uses mailto + LinkedIn only (no form backend):

- Email: ansabrehman@hotmail.com
- LinkedIn: https://linkedin.com/in/ansabrehman/

## Stack

- Vite + React 19 + TypeScript
- Plain CSS (design tokens, no Tailwind)
- Fonts: Fraunces, IBM Plex Sans, IBM Plex Mono (Google Fonts)
