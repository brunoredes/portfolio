# donatelli-dev

Personal portfolio built with [Astro 7](https://astro.build/).

## Project structure

```text
/
├── astro.config.mjs
├── src/
│   └── pages/
│       ├── index.astro
│       └── privacy-policy.astro
└── legacy/
    └── ...previous Angular/Analog implementation kept as reference
```

Astro uses file-based routing from `src/pages/`:

- `/` renders `src/pages/index.astro`.
- `/privacy-policy` renders `src/pages/privacy-policy.astro`.

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start the Astro development server:

```bash
pnpm dev
```

Open `http://localhost:4321/` in your browser. Astro reloads pages as you edit files.

## Build

Create the production static site:

```bash
pnpm build
```

The production output is generated in `dist/`.

## Preview

Preview the production build locally:

```bash
pnpm preview
```
