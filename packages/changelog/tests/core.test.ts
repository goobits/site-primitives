import { describe, expect, it } from 'vitest'

import { changesOfType, formatChangelogDate, formatChangelogVersion } from '../src/core.ts'

describe('changelog core', () => {
	it('filters changes by type', () => {
		const entry = {
			version: '1.0.0',
			date: '2026-01-01',
			changes: [
				{ type: 'New', content: 'Added one' },
				{ type: 'Fix', content: 'Fixed one' }
			]
		}

		expect(changesOfType(entry, 'New')).toEqual([ { type: 'New', content: 'Added one' } ])
	})

	it('formats dates and versions', () => {
		expect(formatChangelogDate('2026-01-02')).toContain('2026')
		expect(formatChangelogVersion({ version: '1.0.0', date: '2026-01-01', changes: [] })).toBe('Version 1.0.0')
		expect(formatChangelogVersion({ version: 'v1.0.0', date: '2026-01-01', changes: [] })).toBe('v1.0.0')
	})
})
