import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'

import { HumansTxtPage } from '@goobits/humans-txt/ui'

describe('HumansTxtPage', () => {
	it('renders the supplied credits with package-scoped classes', () => {
		const { head, html } = render(HumansTxtPage, {
			props: {
				ascii: 'SITE',
				class: 'example-humans',
				team: [
					{
						role: 'creator',
						name: 'Example Person',
						email: 'hello@example.com',
						url: 'https://example.com'
					}
				],
				contributors: {
					design: [ { name: 'Designer', handle: '@design', handleUrl: 'https://example.com/design' } ]
				},
				libraries: [ { name: 'Svelte', license: 'MIT' } ],
				terminalTitle: 'Example Terminal',
				terminalPath: 'example:~/public'
			}
		})

		expect(head).toContain('<title>Humans.txt</title>')
		expect(html).toContain('class="gb-humans-txt')
		expect(html).toContain('example-humans')
		expect(html).toContain('Example Person')
		expect(html).toContain('mailto:hello@example.com')
		expect(html).toContain('@design')
		expect(html).toContain('Svelte')
		expect(html).not.toContain('class="terminal')
	})

	it('can leave document head ownership to the host route', () => {
		const { head, html } = render(HumansTxtPage, {
			props: {
				headTitle: null,
				team: [ { name: 'Example Person' } ]
			}
		})

		expect(head).not.toContain('<title>')
		expect(html).toContain('Example Person')
	})
})
