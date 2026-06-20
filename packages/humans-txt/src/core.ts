/** A person credited on a humans.txt page. */
export interface HumansTxtPerson {
	/** Optional machine-friendly role key, used as the property name in the terminal UI. */
	role?: string
	/** Display name. */
	name: string
	/** Public profile, project, or website URL. */
	url?: string
	/** Contact email rendered as a `mailto:` link. */
	email?: string
	/** Short descriptive note shown above the person. */
	description?: string
	/** Social or community handle. */
	handle?: string
	/** URL for the handle when it differs from `url`. */
	handleUrl?: string
}

/** Third-party library credit shown on a humans.txt page. */
export interface HumansTxtLibrary {
	/** Library or package name. */
	name: string
	/** Author or organization credited for the library. */
	author?: string
	/** Project URL. */
	url?: string
	/** License label, such as `MIT`. */
	license?: string
}

/** Contributor groups keyed by site-defined group names, such as `design` or `research`. */
export type HumansTxtContributorGroups = Record<string, HumansTxtPerson[]>

/** Complete data model consumed by `HumansTxtPage`. */
export interface HumansTxtModel {
	/** Optional ASCII art displayed before credits. */
	ascii?: string
	/** Core team members. */
	team: HumansTxtPerson[]
	/** Optional grouped contributors beyond the core team. */
	contributors?: HumansTxtContributorGroups
	/** Optional third-party library credits. */
	libraries?: HumansTxtLibrary[]
}

/** Return whether `index` points at the final item in `items`. */
export function isLastItem<T>(items: readonly T[], index: number): boolean {
	return index === items.length - 1
}
