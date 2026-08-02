import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'
import { resolveViteCacheDirectory } from '../../scripts/testStorage.ts'

export default defineConfig({
	cacheDir: resolveViteCacheDirectory(import.meta.dirname),
	plugins: [svelte()],
	test: {
		...(process.env.CI ? {} : { maxWorkers: 2 }),
		environment: 'node'
	}
})
