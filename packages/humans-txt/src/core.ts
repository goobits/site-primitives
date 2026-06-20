export interface HumansTxtPerson {
	role?: string
	name: string
	url?: string
	email?: string
	description?: string
	handle?: string
	handleUrl?: string
}

export interface HumansTxtLibrary {
	name: string
	author?: string
	url?: string
	license?: string
}

export type HumansTxtContributorGroups = Record<string, HumansTxtPerson[]>

export interface HumansTxtModel {
	ascii?: string
	team: HumansTxtPerson[]
	contributors?: HumansTxtContributorGroups
	libraries?: HumansTxtLibrary[]
}

export function isLastItem<T>(items: readonly T[], index: number): boolean {
	return index === items.length - 1
}
