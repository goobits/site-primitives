# @goobits/site-primitives

Reusable public website primitives for Goobits and Sketch.IO sites.

## Packages

- `@goobits/sitemap`: sitemap inventories, XML, robots.txt helpers, and Svelte UI.
- `@goobits/humans-txt`: humans.txt data model and terminal-style Svelte UI.
- `@goobits/changelog`: changelog data model, format helpers, and Svelte timeline UI.

This repo is the canonical home for small, standards-adjacent site surfaces that
should be shared across websites without copying route implementations.

## Usage

Mount this repo in a host workspace and include the package folders in
`pnpm-workspace.yaml`. Use the actual mount path for that host checkout:

```yaml
packages:
  - packages/@goobits/site-primitives/packages/*
```

Then depend on the packages from the consuming app:

```json
{
  "dependencies": {
    "@goobits/sitemap": "workspace:*",
    "@goobits/humans-txt": "workspace:*",
    "@goobits/changelog": "workspace:*"
  }
}
```

The packages are source-only ESM. Consumers need tooling that can compile
TypeScript package exports, such as SvelteKit or another Vite-based app.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
```

Package-level commands are also available:

```bash
pnpm --dir packages/sitemap test
pnpm --dir packages/humans-txt typecheck
pnpm --dir packages/changelog typecheck
```
