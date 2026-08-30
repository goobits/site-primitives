<h1 align="center">@goobits/site-primitives</h1>

<p align="center"><strong>Small, standards-adjacent website surfaces shared without copying route implementations.</strong></p>
<p align="center">Develop sitemap, humans.txt, and changelog data models and Svelte UI as separate source-only packages.</p>

<p align="center">
  <a href="#why-site-primitives">Why Site Primitives</a> ·
  <a href="#workspace-map">Workspace map</a> ·
  <a href="#workspace-usage">Usage</a> ·
  <a href="#identity-and-license-status">Status</a>
</p>

---

## Why Site Primitives

This private workspace is the shared home for public-site features that need a
small framework-neutral model plus optional Svelte presentation. It does not
own a consuming website's content, route files, legal text, brand, database, or
release policy.

The root package is not a publishable aggregate. Consumers depend on the child
packages directly.

## Workspace map

| Package | Responsibility |
| --- | --- |
| `@goobits/sitemap` | Sitemap inventory, XML and robots helpers, operations, SvelteKit adapters, and Svelte UI |
| `@goobits/humans-txt` | humans.txt data model and terminal-style Svelte UI |
| `@goobits/changelog` | Changelog data model, Markdown formatting, view model, and Svelte timeline UI |

Each child is source-only ESM and exports focused `core` and `ui` surfaces where
applicable. Consumers need a toolchain that compiles TypeScript package exports;
UI consumers additionally supply the declared Svelte peers.

## Workspace usage

Requires Node.js 22 and pnpm 11.18. Mount this repository in a host workspace
and include its child package directory using the actual checkout path:

```yaml
packages:
  - packages/@goobits/site-primitives/packages/*
```

Then depend on only the needed packages:

```json
{
  "dependencies": {
    "@goobits/humans-txt": "workspace:*",
    "@goobits/changelog": "workspace:*"
  }
}
```

The example path is illustrative; pnpm workspace globs resolve from the host's
root and must match where this repository is actually mounted.

## Identity and license status

This checkout contains `@goobits/sitemap` version `0.2.0` under
`packages/sitemap`. The separately maintained standalone `goobits/sitemap`
repository currently declares the same package name and version with different
source and MIT rather than FSL license terms. Do not mount both into one
workspace or publish either until maintainers choose one canonical package
owner and reconcile the collision.

The private root workspace has no root license grant. Each child package is
licensed separately under FSL-1.1-ALv2 and receives an additional Apache 2.0
license on the second anniversary of the date that version was made available;
see the `LICENSE` file in each child package directory.

## Development

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
```

Package-level commands are also available through `pnpm --dir packages/<name>`.
