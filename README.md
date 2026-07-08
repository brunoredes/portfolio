# donatelli.dev

Personal portfolio of Bruno Donatelli — a static site built with [Astro](https://astro.build/).
Content is authored in MDX, styling is SCSS, and the contact form is backed by a
Cloudflare Pages Function. Language: **pt-BR**.

## Tech stack

- **Astro 7** — static output (`output: 'static'`), file-based routing
- **TypeScript** + **MDX** content collections
- **SCSS** (Sass) — organized into tokens / base / components / layout / pages / themes
- **Cloudflare Pages** — hosting + a Pages Function for the contact form
- **pnpm** — package manager (see `pnpm-lock.yaml`)
- **Biome** — formatter/linter (`biome.json`)
- Self-hosted, subset fonts (Sora, IBM Plex Mono, Inter) — no third-party font CDN

> PWA (`@vite-pwa/astro`) is installed but currently **disabled** (commented out in
> `astro.config.mjs` and `src/components/SeoHead.astro`).

## Requirements

- Node **>= 22.12.0**
- pnpm (`corepack enable` will provide it)

## Getting started

```bash
pnpm install
pnpm dev        # dev server → http://localhost:4321
```

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server (hot reload) |
| `pnpm build` | Build the static site to `dist/` |
| `pnpm watch` | Build in watch mode |
| `pnpm preview` | Serve the production build locally |
| `pnpm test` | Type-check with `astro check` |

> `pnpm dev` does **not** run the contact-form Function — see [Contact form](#contact-form).

## Project structure

```text
├── astro.config.mjs         # Astro config (@astrojs/sitemap; PWA present but disabled)
├── biome.json               # formatter / linter
├── Dockerfile               # multi-stage build → hardened nginx-http3 image (self-host)
├── docker-compose.yml       # runs the production image (read-only, non-root)
├── functions/               # Cloudflare Pages Functions (run on Cloudflare, not in `astro dev`)
│   ├── _middleware.ts        # security headers
│   └── api/contact.ts        # POST /api/contact → Discord webhook
├── infra/nginx/             # nginx config + dev certs used by the Docker image
├── public/
│   ├── fonts/               # self-hosted subset .woff2 + OFL license files
│   ├── og-image.png         # social share image (1200×630)
│   └── robots.txt
├── src/
│   ├── components/          # Header, Footer, SeoHead, CookieBanner, HomeSections
│   ├── content/             # MDX collections: projects/ experience/ blog/
│   ├── content.config.ts    # collection schemas (zod)
│   ├── pages/               # routes: index · privacy-policy · accessibility
│   └── styles/              # SCSS entry: main.scss
└── package.json
```

Routes come from `src/pages/`: `/`, `/privacy-policy`, `/accessibility`.
The home page renders the `projects`, `experience`, and `blog` collections into
sections via `src/components/HomeSections.astro` — the collections are **not**
standalone routes.

## Environment variables

Copy `.env.example` and fill what you need. All are optional for local `astro dev`.

| Variable | Scope | Purpose |
|---|---|---|
| `PUBLIC_GA_TAG` | build (client) | GA4 Measurement ID. Analytics load **only** after the visitor accepts cookies. Empty = tracking disabled. |
| `PUBLIC_CURRICULO_URL` | build (client) | URL for the résumé/CV link in the hero CTA. Empty = falls back to `#`. |
| `DISCORD_WEBHOOK_URL` | server (Function) | Where the contact form posts. Read only in the Cloudflare Function runtime — **not** during the Astro build. |

- `PUBLIC_*` vars are inlined at build time; put them in `.env` for local dev and in
  the Cloudflare Pages dashboard for production.
- `DISCORD_WEBHOOK_URL` is a server secret. For local Function testing with wrangler,
  put it in a **gitignored `.dev.vars`** file; in production set it in
  **Cloudflare Pages → Settings → Environment variables**.

## Adding content

Each collection is a folder of `.mdx` files under `src/content/`. Schemas are defined
in `src/content.config.ts` (zod) — invalid frontmatter fails the build. The filename
(without extension) becomes the entry id/slug. Copy an existing entry as a template.

### Project — `src/content/projects/<slug>.mdx`

```yaml
---
number: '03'                 # string, zero-padded ('01', '02', …) — controls ordering
title: TFT Unit Counter
description: One-line summary shown on the card
technologies:                # string[]
  - Angular
  - TypeScript
repoUrl: https://github.com/brunoredes/unity-counter   # required, valid URL
liveUrl: https://example.com # optional
previewImg: ''               # optional
featured: false              # optional (default false) — adds the "destaque" badge
---

Markdown/MDX body → rendered as the card description.
```

### Experience — `src/content/experience/<slug>.mdx`

```yaml
---
company: BTG Pactual
role: Desenvolvedor Fullstack
roleLevel: Senior
startDate: 2026-01           # string, "YYYY-MM"
endDate: 2026-06             # "YYYY-MM" — or the literal `current` for the present role
location: São Paulo, SP - Híbrido   # optional
technologies:                # optional string[]
  - React
  - C#
  - AWS
---

Markdown/MDX body → the role description in the timeline.
```

Entries are ordered by `startDate` (most recent first).

### Blog post — `src/content/blog/<slug>.mdx`

Articles are published on external platforms; the site shows a card that links out.

```yaml
---
title: 'Angular Forms Signal: O que as documentações não te falam'
date: 2026-01-07             # full ISO date (YYYY-MM-DD), coerced to a Date
excerpt: Short summary shown on the card
platforms:                   # at least 1
  - name: dev.to             # 'dev.to' | 'medium'
    url: https://dev.to/brunoredes/...
    language: pt-BR          # 'pt-BR' | 'en-US'
  - name: medium
    url: https://medium.com/@brunoredes/...
    language: en-US
---

Markdown/MDX body (currently used as the card excerpt).
```

> Note the date formats differ by collection: **blog** uses a full ISO date
> (`YYYY-MM-DD`), **experience** uses `YYYY-MM`.

## Contact form

`POST /api/contact` is a Cloudflare Pages Function (`functions/api/contact.ts`). It
validates the payload, then posts a Discord embed to `DISCORD_WEBHOOK_URL`.

- Validation: `nome` and `assunto` non-empty, `mensagem` ≥ 10 chars (enforced client- and server-side).
- Responses: `204` success · `400` invalid body/fields · `500` webhook not configured · `502` webhook rejected.
- It runs on Cloudflare Pages (or locally via `wrangler pages dev`), **not** under plain
  `astro dev` or the static Docker/nginx image.

## Accessibility & theming

`/accessibility` lets visitors control text size, theme (auto/light/dark), high
contrast, and a dyslexia-friendly font. Preferences persist in
`localStorage['dd-a11y']` (never sent to a server) and are applied before paint by an
inline script in `SeoHead.astro` to avoid a flash. They toggle classes on `<html>`
(`.dark` / `.light` / `.contraste` / `.dislexia`); the matching token overrides live in
`src/styles/themes/_default.scss`. Dark defaults to the OS `prefers-color-scheme`
until the visitor makes an explicit choice.

## Fonts & assets

Fonts are self-hosted from `public/fonts/` as latin-subset `.woff2` (with their OFL
licenses), declared in `src/styles/base/_fonts.scss`:

- **Sora** — UI / body / headings
- **IBM Plex Mono** — mono accents (kickers, badges, labels)
- **Inter** — loaded only when dyslexia mode is enabled

The `public/og-image.png` social card was generated from these fonts and the brand
palette; the generator script isn't committed.

## Deployment

### Cloudflare Pages (primary)

Push to `main`; Cloudflare Pages builds with `pnpm build`, publishes `dist/`, and runs
the `functions/`. Set env vars in the dashboard (see [Environment variables](#environment-variables)).

### Docker / nginx (self-host, alternative)

A multi-stage `Dockerfile` builds the site and serves `dist/` from a hardened
`nginx-http3` image (read-only rootfs, non-root, HTTP/3, `/healthz` healthcheck):

```bash
docker compose up --build
```

Mount real TLS certs over `infra/nginx/certs` in production (see the commented volumes
in `docker-compose.yml`). Note: the static image does **not** serve the contact-form
Function.
```
