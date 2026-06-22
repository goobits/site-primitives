import { describe, expect, it } from 'vitest'

import { isLastItem } from '@goobits/humans-txt/core'

describe('isLastItem', () => {
	it('detects the final item index', () => {
		expect(isLastItem([ 'a', 'b' ], 1)).toBe(true)
		expect(isLastItem([ 'a', 'b' ], 0)).toBe(false)
	})
})
