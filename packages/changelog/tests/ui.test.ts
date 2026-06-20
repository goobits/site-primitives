import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'

import { ChangelogPage } from '@goobits/changelog/ui'

describe('ChangelogPage', () => {
	it('renders grouped changes and supports embedded mode', () => {
		const { head, html } = render(ChangelogPage, {
			props: {
				appName: 'Example',
				embedded: true,
				changes: [
					{
						version: '1.0.0',
						date: '2026-01-02',
						changes: [
							{ type: 'New', content: 'Added one' },
							{ type: 'Fix', content: 'Fixed one' }
						]
					}
				]
			}
		})

		expect(head).toContain('<title>Example | Changelog</title>')
		expect(html).toContain('changelog--embedded')
		expect(html).toContain('Version 1.0.0')
		expect(html).toContain('New Features')
		expect(html).toContain('Fixes')
		expect(html).toContain('Added one')
		expect(html).toContain('Fixed one')
	})
})
