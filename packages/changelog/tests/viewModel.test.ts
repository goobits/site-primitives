import { describe, expect, it } from 'vitest'

import { ChangeType } from '../src/formatter.ts'
import { parseChangelog } from '../src/markdown.ts'
import { createChangelogViewModel, findChangelogVersion } from '../src/viewModel.ts'

describe('changelog view model', () => {
	it('creates a view model for unreleased changelog entries', () => {
		const parsed = parseChangelog(`# Changelog

## [Unreleased]

### Highlights

- Public changelog pages can render structured release notes.

### Performance

- Changelog parsing avoids site-specific post-processing.

### Internal

- Shared parser package owns changelog vocabulary.
`)

		if (!parsed.success) {
			throw new Error(parsed.error)
		}

		const model = createChangelogViewModel(parsed.data)
		const unreleased = findChangelogVersion(model, 'unreleased')

		expect(model.title).toBe('Changelog')
		expect(model.versionCount).toBe(1)
		expect(model.changeCount).toBe(3)
		expect(unreleased).toBeDefined()
		expect(unreleased?.released).toBe(false)
		expect(unreleased?.sections[0]?.type).toBe(ChangeType.Highlights)
		expect(unreleased?.sections[1]?.type).toBe(ChangeType.Performance)
		expect(unreleased?.sections[2]?.type).toBe(ChangeType.Internal)
	})
})
