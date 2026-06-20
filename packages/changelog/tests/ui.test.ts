import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'

import { ChangelogPage } from '@goobits/changelog/ui'

describe('ChangelogPage', () => {
	it('renders grouped changes and supports embedded mode', () => {
		const { head, html } = render(ChangelogPage, {
			props: {
				appName: 'Example',
				embedded: true,
				class: 'example-changelog',
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
		expect(html).toContain('gb-changelog--embedded')
		expect(html).toContain('example-changelog')
		expect(html).not.toContain('id="main-content"')
		expect(html).not.toContain('class="changelog')
		expect(html).toContain('Version 1.0.0')
		expect(html).toContain('New Features')
		expect(html).toContain('Fixes')
		expect(html).toContain('Added one')
		expect(html).toContain('Fixed one')
	})

	it('can leave document head ownership to the host route', () => {
		const { head, html } = render(ChangelogPage, {
			props: {
				headTitle: null,
				changes: [
					{
						version: '1.0.0',
						date: '2026-01-02',
						changes: [{ type: 'New', content: 'Added one' }]
					}
				]
			}
		})

		expect(head).not.toContain('<title>')
		expect(html).toContain('Added one')
	})
})
