# MAREA — Marine Aquaculture Risk & Early-warning Analytics

**MAREA** (Marine Aquaculture Risk & Early-warning Analytics) is a marine environmental intelligence platform for aquaculture operators and marine researchers. It surfaces sea-water temperature monitoring, seasonal reference baselines, and early-warning readiness with a strict data-honesty policy: real repository metrics only, and clearly labelled empty states where no live or forecast data exists yet.

This repository holds the **MAREA V1** interface — a production-grade React/TanStack Start application built and polished in Lovable.

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Build for production](#build-for-production)
- [Preview the production build](#preview-the-production-build)
- [Linting and formatting](#linting-and-formatting)
- [UI routes and how to verify them](#ui-routes-and-how-to-verify-them)
- [Design system](#design-system)
- [Data honesty policy](#data-honesty-policy)
- [Roadmap / pipeline status](#roadmap--pipeline-status)
- [License](#license)

---

## Highlights

- **Two audience views** — an *Operations* track for fast situation awareness (farmers/operators) and a *Research* track for analytical depth and dataset provenance.
- **Honest empty states** — no synthetic preview data; every missing series is stated explicitly.
- **Seasonal reference** based on audited repository data (descriptive distribution, baselines, and the documented 365-day repetition caveat).
- **Marine environmental design system** — restrained, scientific, high-contrast, OKLCH-based palette with IBM Plex typography.
- **Responsive** — desktop rail, tablet, and mobile layouts verified across all routes.
- **Accessible** — skip-to-content links, ARIA labels, semantic landmarks, and keyboard-reachable navigation.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start v1 (file-based routing, SSR/SSG, server functions) |
| UI | React 19, Tailwind CSS v4 (native CSS `@import` + `@theme`) |
| Charts | Recharts |
| Icons | lucide-react |
| Validation | Zod |
| Build | Vite 8 (Nitro / Cloudflare Worker target) |
| Language | TypeScript 5 (strict) |

## Repository layout

```text
src/
├── components/marea/      # MAREA UI components (panels, charts, shell, primitives)
├── data/marea.ts          # Ground-truth facts transcribed from the MAREA repo
├── hooks/                 # use-mobile breakpoint hook
├── lib/                   # error reporting, error page, utils
├── routes/                # File-based routes (Overview, Monitoring, Alerts, …)
│   ├── __root.tsx         # App shell, head metadata, fonts, providers
│   ├── index.tsx          # / — Overview
│   ├── monitoring.tsx     # /monitoring
│   ├── alerts.tsx         # /alerts
│   ├── sensors.tsx        # /sensors
│   ├── analytics.tsx      # /analytics
│   └── research.tsx       # /research
├── router.tsx             # Router + QueryClient configuration
├── server.ts              # SSR entry (error wrapper)
├── start.ts               # Start middleware (CSRF, error capture)
└── styles.css             # Marine design system (OKLCH tokens, IBM Plex)
```

## Prerequisites

- **Node.js 20+** (use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if needed)
- **npm** (ships with Node) — this repo's lockfile is managed with npm; Bun/Yarn work but npm is the canonical path

## Local development

```sh
git clone https://github.com/NidhalxMRR/MAREA-V1.git
cd MAREA-V1
npm install
npm run dev
```

The dev server starts on **http://localhost:8080** (Vite). Open it and navigate to any route listed below.

> The first `npm install` may take a minute because the TanStack Start + Nitro toolchain has many transitive dependencies. If you hit a peer-dependency conflict, delete `node_modules` and `package-lock.json`, then re-run `npm install`.

## Build for production

```sh
npm run build
```

This runs `vite build`, which:

1. Type-checks and bundles the client + server graphs,
2. Builds the SSR/SSG entry via Nitro for the **Cloudflare Worker** target.

The build output lands in `.output/` (Nitro) and `dist/` (client assets).

> **Note on `build:dev`:** `npm run build:dev` (`vite build --mode development`) is used internally for preview/prerender checks. It runs prerender passes that have no Supabase session, so do **not** call authenticated server functions from public-route loaders during that step.

## Preview the production build

```sh
npm run build
npm run preview
```

`vite preview` serves the production build locally so you can confirm the built output matches the dev experience before deploying.

## Linting and formatting

```sh
npm run lint     # ESLint (TS + React hooks + Prettier rules)
npm run format   # Prettier write across the project
```

Type-check only (no emit):

```sh
npx tsgo --noEmit
```

## UI routes and how to verify them

MAREA V1 exposes six content routes, grouped into **Operations** and **Research** in the navigation rail.

| Route | Path | Group | What it shows | How to verify |
| --- | --- | --- | --- | --- |
| Overview | `/` | Operations | Site context → system status → current water condition → temperature chart → attention panel → readiness roadmap | Load `/` and confirm the situation-awareness hierarchy renders top-to-bottom; the "Current water condition" hero shows an honest "Live monitoring unavailable" state. |
| Monitoring | `/monitoring` | Operations | Live observation layout: site context, system banner, temperature + rate-of-change observation panels | Navigate to `/monitoring` and confirm the empty-state banners are quiet (one global "not connected" statement, not repeated chips). |
| Alerts | `/alerts` | Operations | Early-warning status with plain, farmer-facing wording and honest empty states | Open `/alerts` and confirm no fabricated alerts are shown — only the "no active alerts" status. |
| Sensors | `/sensors` | Operations | IoT device fleet table + expected reading payload + connection roadmap | Open `/sensors` and confirm the zero-device state lists the IoT contract fields (`device_id`, `timestamp`, `water_temperature`, …). |
| Analytics | `/analytics` | Research | Temperature distribution (Mean, P90, P95) + baseline horizon metrics from real repository stats | Open `/analytics` and confirm the descriptive distribution markers are computed from `src/data/marea.ts` (not invented). |
| Data & provenance | `/research` | Research | Six evidence sections: Source, Coverage, Sampling, Validation, Known Characteristics, Research Authorization | Open `/research` and confirm the 365-day repetition caveat is stated explicitly. |

### Verification checklist

Run these after `npm run dev` (or `npm run preview`):

```sh
# 1. Confirm every route returns 200 OK
for path in / /monitoring /alerts /sensors /analytics /research; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080$path)
  echo "$path -> $code"
done

# 2. Confirm the title tag is unique per route (SEO check)
for path in / /monitoring /alerts /sensors /analytics /research; do
  title=$(curl -s http://localhost:8080$path | grep -o '<title>[^<]*</title>' | head -1)
  echo "$path -> $title"
done

# 3. Confirm no synthetic "preview" series leaks into the bundle
rg -i "preview" src/ || echo "No preview-series references — clean."
```

### Responsive checks

The interface is verified at three breakpoints:

- **Desktop** (≥1024px): fixed left rail, full-width content
- **Tablet** (768–1023px): collapsing rail, stacked panels
- **Mobile** (<768px): sticky top bar with slide-out drawer

To re-verify responsive behavior, resize the browser across 1440 / 834 / 390 px widths and confirm:

- No horizontal overflow on any route,
- Labels wrap instead of truncating (site name, chart legend, metric labels),
- The mobile status chip stacks vertically on small screens.

## Design system

The marine environmental design system lives in `src/styles.css`:

- **Typography:** IBM Plex Sans (body) + IBM Plex Mono (data), loaded via `<link>` in `src/routes/__root.tsx`.
- **Color:** OKLCH-based semantic tokens — `ink` (navigation surface), `surface`, `card`, plus data/status tokens (`actual`, `reference`, `forecast`, `caution`, `positive`, `pending`).
- **No hardcoded colors in components** — all colors flow through semantic tokens so theming and dark mode stay consistent.

## Data honesty policy

Everything in `src/data/marea.ts` is transcribed from real MAREA repository artefacts:

- `ml/reports/metrics/daily_temperature_baselines.json`
- `ml/reports/baseline_results_temperature_real.json`
- `ml/configs/temperature_series_provenance.yaml`

Rules enforced across the UI:

1. **No invented live data.** No live sensor readings, forecasts, alerts, or biological thresholds exist yet — so none are rendered. Empty states say so plainly.
2. **No synthetic preview curves.** The previous demo preview-series generator was removed; charts show honest "no data yet" states.
3. **Audited baselines only.** Baseline horizon metrics and the descriptive distribution come from the audited dataset.
4. **The 365-day repetition caveat is stated** wherever the seasonal reference is shown — the supplied series repeats exactly every 365 days, so it is not independent-year generalisation evidence.

## Roadmap / pipeline status

The pipeline status is surfaced on the Overview page and in `src/data/marea.ts`:

| Stage | State | Note |
| --- | --- | --- |
| Historical reference | Available | Researcher-supplied daily series |
| Live IoT ingestion | Planned | Hardware in development |
| Validation | Partial | Provenance + repetition audit complete |
| Forecasting | Planned | Baselines evaluated, no production model |
| Change detection | Planned | Requires live measurements |
| Risk & early warning | Planned | No thresholds defined yet |

The expected IoT reading contract (fields the future devices will emit) is declared in `src/data/marea.ts` → `IOT_CONTRACT` and surfaced on the Sensors page.

## License

This project is built and maintained by the MAREA team. See the repository for license details.
