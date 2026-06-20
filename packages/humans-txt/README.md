# @goobits/humans-txt

Reusable humans.txt data types and a terminal-style Svelte 5 page component.

Part of [`@goobits/site-primitives`](https://github.com/goobits/site-primitives).

## Exports

| Subpath | Purpose |
| --- | --- |
| `@goobits/humans-txt` | Types and `isLastItem` helper. |
| `@goobits/humans-txt/core` | Same core types and helper without UI. |
| `@goobits/humans-txt/ui` | `HumansTxtPage` Svelte component. |
| `@goobits/humans-txt/ui/HumansTxtPage.svelte` | Direct component import. |

## Data Shape

```ts
import type { HumansTxtModel } from '@goobits/humans-txt'

const humans: HumansTxtModel = {
  ascii: 'SITE',
  team: [
    {
      role: 'creator',
      name: 'Example Person',
      url: 'https://example.com',
      email: 'hello@example.com'
    }
  ],
  contributors: {
    design: [
      {
        name: 'Design Contributor',
        handle: '@design',
        handleUrl: 'https://example.com/design'
      }
    ]
  },
  libraries: [
    {
      name: 'Svelte',
      url: 'https://svelte.dev',
      license: 'MIT'
    }
  ]
}
```

The consuming site owns the people, library credits, URLs, and copy. This
package owns only the shared data model and rendering component.

The component ships plain Svelte-scoped CSS with `--gb-humans-txt-*` custom
properties. Set them on `:root`, a wrapping element, or the component's `class`;
fallbacks live at each use site so inherited site tokens are not shadowed.
Consumers do not need Sass.

## Svelte Usage

```svelte
<script lang="ts">
  import { HumansTxtPage } from '@goobits/humans-txt/ui'
  import humans from './humans.js'
</script>

<HumansTxtPage
  {...humans}
  terminalTitle="Example Terminal - zsh"
  terminalPath="example:~/public"
  class="example-humans"
/>
```

`HumansTxtPage` writes `<title>Humans.txt</title>` by default for existing
drop-in usage. Pass `headTitle={null}` when the host route owns document
metadata, or pass a string to customize it.

## Development

```bash
pnpm test
pnpm typecheck
```
