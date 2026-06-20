# @goobits/site-primitives

Reusable website primitives for SvelteKit and modern Fetch-API runtimes.

## Boundaries

- Keep packages independently consumable.
- Put runtime-agnostic helpers under package `core` exports.
- Put SvelteKit route handlers under package `sveltekit` exports.
- Put Svelte components under package `ui` exports.
- Site-specific content, people, changelog entries, legal text, routes, and
  product copy stay in the consuming site.

## Verification

- Run package-level tests for the package being changed.
- For Svelte UI changes, run the package typecheck and a consuming app route
  smoke when practical.
