export enum ChangeType {
	Highlights = 'highlights',
	Added = 'added',
	Changed = 'changed',
	Deprecated = 'deprecated',
	Removed = 'removed',
	Fixed = 'fixed',
	Performance = 'performance',
	Security = 'security',
	Internal = 'internal'
}

export interface ChangeEntry {
	readonly type: ChangeType
	readonly description: string
	readonly issueRef?: string
	readonly author?: string
}

export interface VersionEntry {
	readonly version: string
	readonly date?: Date
	readonly changes: readonly ChangeEntry[]
}

export interface Changelog {
	readonly title: string
	readonly description?: string
	readonly versions: readonly VersionEntry[]
}

export enum DateFormat {
	Iso = 'iso',
	Short = 'short',
	Long = 'long'
}

export interface FormatOptions {
	readonly includeAuthors: boolean
	readonly includeIssueRefs: boolean
	readonly dateFormat: DateFormat
}

const DEFAULT_OPTIONS: FormatOptions = {
	includeAuthors: true,
	includeIssueRefs: true,
	dateFormat: DateFormat.Iso
}

function formatDate(date: Date, format: DateFormat): string {
	switch (format) {
		case DateFormat.Iso:
			return date.toISOString().split('T')[0] ?? ''
		case DateFormat.Short:
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		case DateFormat.Long:
			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
	}
}

export function getChangeTypeLabel(type: ChangeType): string {
	switch (type) {
		case ChangeType.Highlights:
			return 'Highlights'
		case ChangeType.Added:
			return 'Added'
		case ChangeType.Changed:
			return 'Changed'
		case ChangeType.Deprecated:
			return 'Deprecated'
		case ChangeType.Removed:
			return 'Removed'
		case ChangeType.Fixed:
			return 'Fixed'
		case ChangeType.Performance:
			return 'Performance'
		case ChangeType.Security:
			return 'Security'
		case ChangeType.Internal:
			return 'Internal'
	}
}

function formatChangeEntry(entry: ChangeEntry, options: FormatOptions): string {
	let line = `- ${entry.description}`

	if (options.includeIssueRefs && entry.issueRef !== undefined) {
		line += ` (${entry.issueRef})`
	}

	if (options.includeAuthors && entry.author !== undefined) {
		line += ` - @${entry.author}`
	}

	return line
}

function groupChangesByType(changes: readonly ChangeEntry[]): Map<ChangeType, ChangeEntry[]> {
	const grouped = new Map<ChangeType, ChangeEntry[]>()

	for (const change of changes) {
		const existing = grouped.get(change.type)
		if (existing !== undefined) {
			existing.push(change)
		} else {
			grouped.set(change.type, [change])
		}
	}

	return grouped
}

function formatVersionEntry(version: VersionEntry, options: FormatOptions): string {
	const lines: string[] = []

	if (version.date !== undefined) {
		lines.push(`## [${version.version}] - ${formatDate(version.date, options.dateFormat)}`)
	} else {
		lines.push(`## [${version.version}]`)
	}
	lines.push('')

	const groupedChanges = groupChangesByType(version.changes)

	for (const type of Object.values(ChangeType)) {
		const changes = groupedChanges.get(type)
		if (changes !== undefined && changes.length > 0) {
			lines.push(`### ${getChangeTypeLabel(type)}`)
			lines.push('')
			for (const change of changes) {
				lines.push(formatChangeEntry(change, options))
			}
			lines.push('')
		}
	}

	return lines.join('\n')
}

export function formatChangelog(
	changelog: Changelog,
	options: Partial<FormatOptions> = {}
): string {
	const mergedOptions: FormatOptions = { ...DEFAULT_OPTIONS, ...options }
	const lines: string[] = []

	lines.push(`# ${changelog.title}`)
	lines.push('')

	if (changelog.description !== undefined) {
		lines.push(changelog.description)
		lines.push('')
	}

	for (const version of changelog.versions) {
		lines.push(formatVersionEntry(version, mergedOptions))
	}

	return `${lines.join('\n').trim()}\n`
}

export function createEmptyChangelog(title: string): Changelog {
	return {
		title,
		versions: []
	}
}

export function addVersion(changelog: Changelog, version: VersionEntry): Changelog {
	return {
		...changelog,
		versions: [version, ...changelog.versions]
	}
}
