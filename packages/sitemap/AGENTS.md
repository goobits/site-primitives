# `@goobits/sitemap` Agent Guide

Reusable sitemap core, server helpers, and operations layer for SvelteKit (and any modern Fetch-API runtime). Notes here describe code that agents/contributors should follow when modifying this package.

---

## Quick reference

- **Category:** library (ESM-only, TypeScript)
- **Distribution:** source-only package consumed from the `goobits/site-primitives` repo inside a pnpm workspace. Consumer bundlers compile the `.ts` source directly — no build step, no `dist/`, no npm publish.
- **Primary stack:** TypeScript 5.9 + vitest + svelte-check (for the `/ui` subpath). No runtime dependencies. Optional peer-deps: `@sveltejs/kit ^2`, `svelte ^5` (only needed for the `/ui` subpath), `typescript ^5`.
- **Runtime targets:** Node 22 is the verified test target. `core` is runtime-agnostic TypeScript; `ops` requires a runtime with `globalThis.fetch`.
- **Engines:** Node `>=22`

## Commands

```bash
pnpm install
pnpm typecheck      # tsc --noEmit (src + tests) + svelte-check on src/ui
pnpm test           # vitest run
pnpm test:watch     # vitest
pnpm test:coverage  # vitest run --coverage
```

## Architecture

```
src/
├── core.ts          # barrel: types + viewmodel + builders
├── core/
│   ├── types.ts     # RouteInventory, SitemapEntry, SitemapAudience, etc.
│   ├── viewmodel.ts # getFilteredSitemapGroups, getRouteTags, audience mapping
│   └── builders.ts  # createPageEntry, createApiEntry, createRouteInventory, …
├── server.ts        # barrel: XML + origin resolution
├── server/
│   └── xml.ts       # buildSitemapXml, buildSitemapIndexXml, resolveSiteOrigin, escapeXml
├── ops.ts           # barrel: pings + validation
├── ops/
│   ├── http.ts      # @internal: fetchWithTimeout + retry helper
│   ├── ping.ts      # pingSearchEngines + result types
│   └── validate.ts  # validateSitemapUrls (URL HEAD-check)
├── sveltekit.ts     # barrel: handler factories + scanner
├── sveltekit/
│   ├── handlers.ts  # createSitemapXmlHandler + createRobotsTxtHandler
│   └── scanner.ts   # scanSvelteKitRoutes (import.meta.glob → SitemapEntry[])
├── ui.ts            # barrel: SitemapPage + CategoryMeta/Tone/SortOption types
├── ui/
│   ├── SitemapPage.svelte  # themable Svelte 5 component
│   └── types.ts            # CategoryTone, CategoryMeta, SortOption
├── svelte.d.ts      # package-local ambient declaration for `*.svelte` imports
└── index.ts         # barrel re-exporting core + server (NOT ops — fetch-coupled, NOT ui — Svelte-coupled)
```

`package.json#exports` points directly at `./src/*.ts`. There is no build step. Consumers' bundlers (Vite/esbuild/SvelteKit) compile the `.ts` source as part of their own pipeline.

Every public factory in `ops/*` accepts an optional `logger?` and defaults to silent.

## Code style

- Tabs, single quotes, no semicolons
- Strict TypeScript (`tsconfig.json` enables `noUncheckedIndexedAccess`, `noUnusedLocals`, etc.)
- All exports named; no default exports
- Pure functions in `core` and `server/xml` — never reach for `process`, `fetch`, or `globalThis` from those modules. Network-dependent code stays under `ops/`.

## Security rules (do not bypass)

- `escapeXml` MUST be applied to every value interpolated into a `<loc>` or `<lastmod>` element. The five replacements (`&`, `<`, `>`, `"`, `'`) are deliberate; do not narrow them.
- `pingSearchEngines` MUST treat the caller-supplied `engines[]` as authoritative — no implicit defaults. The historical Bing endpoint is exposed as `HISTORICAL_PING_ENDPOINTS` to be opted into explicitly; Google's ping endpoint was retired in 2023 and is intentionally not shipped.
- `validateSitemapUrls` MUST take URLs directly (caller controls the target list) — never accept a database handle or a route scanner. SSRF prevention is the caller's responsibility, but the surface is shaped so the caller can enforce it.
- When this package's deps change in `package.json`, verify their licenses remain permissive (MIT / Apache 2.0 / BSD). No GPL-ish copyleft deps.

## Package-vs-host boundary (the load-bearing design decision)

This package owns:

- Types describing a route inventory
- Pure filter/sort/visibility logic
- XML rendering (`sitemap.xml` and `sitemap-index.xml`)
- Origin resolution from explicit baseUrl → request → fallback
- Search-engine ping orchestration (with retry + timeout)
- URL HEAD validation (with concurrency + bounded error output)

The host application owns:

- Filesystem route scanning and SvelteKit-specific route discovery
- Category mapping (which paths belong to which group)
- Sitemap audience matchers (which paths are `public` / `internal` / `hidden`)
- `lastModified` source (git log, mtime, content store, etc.)
- Page UI, brand copy, presentation
- Change-detection logic (e.g. "did anything publish since the last cron?") — too domain-specific to live here
- Stat aggregation that requires consumer DB queries — bring the numbers in, render them yourself

If a future capability needs DB access or business-domain knowledge, it belongs in the consumer, not here.

## Where to look

- Public API barrel: `src/index.ts`
- Per-capability subpath: `src/<name>.ts` (re-exports from `src/<name>/*.ts`)
- UI component: `src/ui/SitemapPage.svelte`; its types live next to it at `src/ui/types.ts`
- Tests for each module: `tests/<name>.test.ts`
- Test config: `vitest.config.ts`
- Types-strict config: `tsconfig.json`

## Definition of Done

- `pnpm typecheck` passes with no errors (covers `src/` and `tests/`)
- `pnpm test` passes with no failing assertions
- Every entry in `package.json#exports` points at an existing `src/*.ts` file
- No `dist/`, `node_modules/`, `.DS_Store`, or `*.tsbuildinfo` tracked
- README + CHANGELOG updated for any user-facing change
- New deps reviewed for license compatibility (permissive only)
