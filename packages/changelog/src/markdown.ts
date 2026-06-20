import { type Changelog, ChangeType, type ChangeEntry, type VersionEntry } from './formatter.ts'

export type ParseResult<T> =
	| { readonly success: true; readonly data: T }
	| { readonly success: false; readonly error: string }

const VERSION_HEADER_REGEX = /^##\s*\[([^\]]+)\](?:\s*-\s*(.+))?$/
const SECTION_HEADER_REGEX = /^###\s*(.+)$/
const CHANGE_ENTRY_REGEX = /^-\s*(.+)$/
const ISSUE_REF_REGEX = /\(([#\w-]+)\)/
const AUTHOR_REGEX = /@(\w+)$/

function parseChangeType(label: string): ChangeType | undefined {
	const normalized = label
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
	const aliases: Readonly<Record<string, ChangeType>> = {
		highlight: ChangeType.Highlights,
		highlights: ChangeType.Highlights,
		added: ChangeType.Added,
		changed: ChangeType.Changed,
		deprecated: ChangeType.Deprecated,
		removed: ChangeType.Removed,
		fixed: ChangeType.Fixed,
		performance: ChangeType.Performance,
		perf: ChangeType.Performance,
		security: ChangeType.Security,
		internal: ChangeType.Internal
	}
	const aliased = aliases[normalized]
	if (aliased !== undefined) {
		return aliased
	}

	const values = Object.values(ChangeType) as string[]
	return values.includes(normalized) ? (normalized as ChangeType) : undefined
}

function parseDate(dateStr: string): Date | undefined {
	const trimmed = dateStr.trim()
	const parsed = new Date(trimmed)

	if (isNaN(parsed.getTime())) {
		return undefined
	}

	return parsed
}

function parseChangeEntry(line: string): ChangeEntry | undefined {
	const match = CHANGE_ENTRY_REGEX.exec(line)

	if (match === null) {
		return undefined
	}

	const content = match[1]
	if (content === undefined) {
		return undefined
	}

	let description = content
	let issueRef: string | undefined
	let author: string | undefined

	const authorMatch = AUTHOR_REGEX.exec(description)
	if (authorMatch !== null) {
		author = authorMatch[1]
		description = description.replace(AUTHOR_REGEX, '').trim()
		if (description.endsWith('-')) {
			description = description.slice(0, -1).trim()
		}
	}

	const issueMatch = ISSUE_REF_REGEX.exec(description)
	if (issueMatch !== null) {
		issueRef = issueMatch[1]
		description = description.replace(ISSUE_REF_REGEX, '').trim()
	}

	const base = {
		type: ChangeType.Added as const,
		description
	}

	if (issueRef !== undefined && author !== undefined) {
		return { ...base, issueRef, author }
	}
	if (issueRef !== undefined) {
		return { ...base, issueRef }
	}
	if (author !== undefined) {
		return { ...base, author }
	}

	return base
}

interface ParserState {
	title: string
	description: string | undefined
	versions: VersionEntry[]
	currentVersion: VersionEntry | undefined
	currentType: ChangeType
	currentChanges: ChangeEntry[]
}

function createInitialState(): ParserState {
	return {
		title: 'Changelog',
		description: undefined,
		versions: [],
		currentVersion: undefined,
		currentType: ChangeType.Added,
		currentChanges: []
	}
}

function finalizeCurrentVersion(state: ParserState): void {
	if (state.currentVersion !== undefined) {
		const updatedVersion: VersionEntry = {
			...state.currentVersion,
			changes: [...state.currentChanges]
		}
		state.versions.push(updatedVersion)
		state.currentChanges = []
		state.currentVersion = undefined
	}
}

export function parseChangelog(content: string): ParseResult<Changelog> {
	const lines = content.split('\n')
	const state = createInitialState()

	for (const line of lines) {
		const trimmedLine = line.trim()

		if (trimmedLine === '') {
			continue
		}

		if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
			state.title = trimmedLine.slice(2).trim()
			continue
		}

		const versionMatch = VERSION_HEADER_REGEX.exec(trimmedLine)
		if (versionMatch !== null) {
			finalizeCurrentVersion(state)

			const versionStr = versionMatch[1]
			const dateStr = versionMatch[2]

			if (versionStr === undefined) {
				return {
					success: false,
					error: `Invalid version header format: ${trimmedLine}`
				}
			}

			const date = dateStr === undefined ? undefined : parseDate(dateStr)
			if (dateStr !== undefined && date === undefined) {
				return {
					success: false,
					error: `Invalid date format in version header: ${dateStr}`
				}
			}

			state.currentVersion =
				date === undefined
					? {
							version: versionStr,
							changes: []
						}
					: {
							version: versionStr,
							date,
							changes: []
						}
			continue
		}

		const sectionMatch = SECTION_HEADER_REGEX.exec(trimmedLine)
		if (sectionMatch !== null) {
			const typeLabel = sectionMatch[1]
			if (typeLabel !== undefined) {
				const changeType = parseChangeType(typeLabel)
				if (changeType !== undefined) {
					state.currentType = changeType
				}
			}
			continue
		}

		if (trimmedLine.startsWith('-') && state.currentVersion !== undefined) {
			const entry = parseChangeEntry(trimmedLine)
			if (entry !== undefined) {
				const typedEntry: ChangeEntry = {
					...entry,
					type: state.currentType
				}
				state.currentChanges.push(typedEntry)
			}
		}
	}

	finalizeCurrentVersion(state)

	const changelog: Changelog =
		state.description !== undefined
			? {
					title: state.title,
					description: state.description,
					versions: state.versions
				}
			: {
					title: state.title,
					versions: state.versions
				}

	return {
		success: true,
		data: changelog
	}
}

export function validateChangelog(changelog: Changelog): string[] {
	const errors: string[] = []

	if (changelog.title.trim() === '') {
		errors.push('Changelog title cannot be empty')
	}

	const seenVersions = new Set<string>()
	for (const version of changelog.versions) {
		if (seenVersions.has(version.version)) {
			errors.push(`Duplicate version: ${version.version}`)
		}
		seenVersions.add(version.version)

		if (version.changes.length === 0) {
			errors.push(`Version ${version.version} has no changes`)
		}
	}

	return errors
}
