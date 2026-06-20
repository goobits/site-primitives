export type ChangelogItemType = 'New' | 'Upgrade' | 'Fix' | string

export interface ChangelogItem {
	type: ChangelogItemType
	content: string
	emoji?: string
	category?: string
}

export interface ChangelogEntry {
	version: string
	date: string
	changes: ChangelogItem[]
}

export const DEFAULT_CHANGE_TYPES = [ 'New', 'Upgrade', 'Fix' ] as const

export function changesOfType(entry: ChangelogEntry, type: ChangelogItemType): ChangelogItem[] {
	return entry.changes.filter(item => item.type === type)
}

export function formatChangelogDate(value: string, locale = 'en-US'): string {
	const date = new Date(`${ value }T00:00:00`)
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

export function formatChangelogVersion(entry: ChangelogEntry): string {
	const version = String(entry.version || '')
	return version.startsWith('v') ? version : `Version ${ version }`
}
