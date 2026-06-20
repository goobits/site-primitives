import {
	type Changelog,
	ChangeType,
	type ChangeEntry,
	type VersionEntry,
	getChangeTypeLabel
} from './formatter.ts'

export interface ChangelogChangeViewModel {
	readonly type: ChangeType
	readonly typeLabel: string
	readonly description: string
	readonly issueRef?: string
	readonly author?: string
}

export interface ChangelogSectionViewModel {
	readonly type: ChangeType
	readonly title: string
	readonly changes: readonly ChangelogChangeViewModel[]
}

export interface ChangelogVersionViewModel {
	readonly version: string
	readonly slug: string
	readonly title: string
	readonly dateLabel?: string
	readonly dateIso?: string
	readonly released: boolean
	readonly sections: readonly ChangelogSectionViewModel[]
	readonly changeCount: number
}

export interface ChangelogViewModel {
	readonly title: string
	readonly description?: string
	readonly versions: readonly ChangelogVersionViewModel[]
	readonly latest?: ChangelogVersionViewModel
	readonly versionCount: number
	readonly changeCount: number
}

const orderedChangeTypes: readonly ChangeType[] = [
	ChangeType.Highlights,
	ChangeType.Added,
	ChangeType.Changed,
	ChangeType.Deprecated,
	ChangeType.Removed,
	ChangeType.Fixed,
	ChangeType.Performance,
	ChangeType.Security,
	ChangeType.Internal
]

export function createChangelogViewModel(changelog: Changelog): ChangelogViewModel {
	const versions = changelog.versions.map(createVersionViewModel)
	const latest = versions[0]
	const changeCount = versions.reduce((total, version) => total + version.changeCount, 0)
	const base = {
		title: changelog.title,
		versions,
		versionCount: versions.length,
		changeCount
	}

	return {
		...base,
		...(changelog.description === undefined ? {} : { description: changelog.description }),
		...(latest === undefined ? {} : { latest })
	}
}

export function createVersionSlug(version: string): string {
	return version
		.toLowerCase()
		.replace(/^\[|\]$/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function findChangelogVersion(
	changelog: ChangelogViewModel,
	slug: string
): ChangelogVersionViewModel | undefined {
	return changelog.versions.find((version) => version.slug === slug)
}

function createVersionViewModel(version: VersionEntry): ChangelogVersionViewModel {
	const sections = createSections(version.changes)
	const dateIso = version.date?.toISOString().split('T')[0]
	const base = {
		version: version.version,
		slug: createVersionSlug(version.version),
		title: version.version,
		released: version.date !== undefined,
		sections,
		changeCount: version.changes.length
	}

	return {
		...base,
		...(dateIso === undefined ? {} : { dateIso, dateLabel: dateIso })
	}
}

function createSections(changes: readonly ChangeEntry[]): readonly ChangelogSectionViewModel[] {
	const grouped = groupChanges(changes)
	return orderedChangeTypes.flatMap((type) => {
		const entries = grouped.get(type)
		if (entries === undefined || entries.length === 0) {
			return []
		}

		return [
			{
				type,
				title: getChangeTypeLabel(type),
				changes: entries.map(createChangeViewModel)
			}
		]
	})
}

function groupChanges(changes: readonly ChangeEntry[]): Map<ChangeType, ChangeEntry[]> {
	const grouped = new Map<ChangeType, ChangeEntry[]>()

	for (const change of changes) {
		const entries = grouped.get(change.type)
		if (entries !== undefined) {
			entries.push(change)
			continue
		}

		grouped.set(change.type, [change])
	}

	return grouped
}

function createChangeViewModel(change: ChangeEntry): ChangelogChangeViewModel {
	return {
		type: change.type,
		typeLabel: getChangeTypeLabel(change.type),
		description: change.description,
		...(change.issueRef === undefined ? {} : { issueRef: change.issueRef }),
		...(change.author === undefined ? {} : { author: change.author })
	}
}
