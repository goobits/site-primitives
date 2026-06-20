/** Changelog item type label rendered as a section and badge. */
export type ChangelogItemType = 'New' | 'Upgrade' | 'Fix' | string

/** One bullet within a changelog entry. */
export interface ChangelogItem {
	/** Type label used for grouping and badge text. */
	type: ChangelogItemType
	/** Human-readable change summary. */
	content: string
	/** Optional emoji rendered before the text. */
	emoji?: string
	/** Optional site-defined category for consumers that need extra grouping metadata. */
	category?: string
}

/** One dated release or update entry. */
export interface ChangelogEntry {
	/** Version or build label. */
	version: string
	/** Date string, usually `YYYY-MM-DD`. */
	date: string
	/** Changes included in this entry. */
	changes: ChangelogItem[]
}

/** Default section order used by `ChangelogPage`. */
export const DEFAULT_CHANGE_TYPES = ['New', 'Upgrade', 'Fix'] as const

/** Return the changes in `entry` whose `type` matches the requested label. */
export function changesOfType(entry: ChangelogEntry, type: ChangelogItemType): ChangelogItem[] {
	return entry.changes.filter((item) => item.type === type)
}

/** Format a date string for display, returning the original value if parsing fails. */
export function formatChangelogDate(value: string, locale = 'en-US'): string {
	const date = new Date(`${value}T00:00:00`)
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

/** Format an entry version, preserving `v*` labels and prefixing other labels with `Version`. */
export function formatChangelogVersion(entry: ChangelogEntry): string {
	const version = String(entry.version || '')
	return version.startsWith('v') ? version : `Version ${version}`
}

export {
	type ChangeEntry,
	type Changelog,
	ChangeType,
	DateFormat,
	type FormatOptions,
	type VersionEntry,
	addVersion,
	createEmptyChangelog,
	formatChangelog,
	getChangeTypeLabel
} from './formatter.ts'
export { type ParseResult, parseChangelog, validateChangelog } from './markdown.ts'
export {
	type ChangelogChangeViewModel,
	type ChangelogSectionViewModel,
	type ChangelogVersionViewModel,
	type ChangelogViewModel,
	createChangelogViewModel,
	createVersionSlug,
	findChangelogVersion
} from './viewModel.ts'
