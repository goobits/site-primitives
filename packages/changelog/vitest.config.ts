import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolveViteCacheDirectory } from '@goobits/site-primitives/test-storage'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	cacheDir: resolveViteCacheDirectory(import.meta.dirname),
	plugins: [svelte()],
	test: {
		...(process.env.CI ? {} : { maxWorkers: 2 }),
		environment: 'node'
	}
})
