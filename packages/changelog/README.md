# @goobits/changelog

Reusable changelog data types, formatting helpers, and a Svelte 5 timeline
component.

Part of [`@goobits/site-primitives`](https://github.com/goobits/site-primitives).

## Exports

| Subpath                                      | Purpose                                      |
| -------------------------------------------- | -------------------------------------------- |
| `@goobits/changelog`                         | Types, format helpers, and change filtering. |
| `@goobits/changelog/core`                    | Same core types and helpers without UI.      |
| `@goobits/changelog/ui`                      | `ChangelogPage` Svelte component.            |
| `@goobits/changelog/ui/ChangelogPage.svelte` | Direct component import.                     |

## Data Shape

```ts
import type { ChangelogEntry } from '@goobits/changelog'

const changes: ChangelogEntry[] = [
	{
		version: '1.2.0',
		date: '2026-01-02',
		changes: [
			{ type: 'New', content: 'Added the public changelog page.' },
			{ type: 'Fix', content: 'Corrected stale route metadata.' }
		]
	}
]
```

The default UI groups each entry by `New`, `Upgrade`, and `Fix`. Consumers can
pass a custom `changeTypes` list for other type labels.

The component uses package-scoped `gb-changelog*` classes and `--gb-changelog-*`
CSS custom properties, so it can be themed without colliding with a site's own
`.changelog` styles.

## Svelte Usage

```svelte
<script lang="ts">
  import { ChangelogPage } from '@goobits/changelog/ui'
  import { changes } from './changes.js'
</script>

<ChangelogPage
  appName="Example"
  title="Changelog"
  intro="Product updates and fixes."
  class="example-changelog"
  {changes}
/>
```

Use `embedded` when rendering inside another page shell:

```svelte
<ChangelogPage {changes} embedded />
```

`ChangelogPage` writes a document `<title>` by default from `appName` and
`title`. Pass `headTitle={null}` when the host route owns document metadata, or
pass a string to customize it.

## Helpers

```ts
import { changesOfType, formatChangelogDate, formatChangelogVersion } from '@goobits/changelog'
```

- `changesOfType(entry, type)` filters one changelog entry by item type.
- `formatChangelogDate(value, locale?)` formats `YYYY-MM-DD` style dates.
- `formatChangelogVersion(entry)` keeps `v1.0.0` labels as-is and prefixes
  other versions with `Version`.

## Development

```bash
pnpm test
pnpm typecheck
```
