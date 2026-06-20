<script lang="ts">
	import {
		changesOfType,
		DEFAULT_CHANGE_TYPES,
		formatChangelogDate,
		formatChangelogVersion,
		type ChangelogEntry,
		type ChangelogItem,
		type ChangelogItemType
	} from '../core.ts'

	let {
		appName = '',
		title = 'Changelog',
		intro = '',
		changes = [],
		embedded = false,
		changeTypes = DEFAULT_CHANGE_TYPES,
		formatDate = formatChangelogDate,
		formatVersion = formatChangelogVersion,
		headTitle = undefined,
		class: className = ''
	}: {
		appName?: string
		title?: string
		intro?: string
		changes?: ChangelogEntry[]
		embedded?: boolean
		changeTypes?: readonly ChangelogItemType[]
		formatDate?: (value: string) => string
		formatVersion?: (entry: ChangelogEntry) => string
		headTitle?: string | null
		class?: string
	} = $props()

	const resolvedHeadTitle = $derived(
		headTitle === undefined ? (appName ? `${ appName } | ${ title }` : title) : headTitle
	)

	function headingFor(type: ChangelogItemType): string {
		if (type === 'New') return 'New Features'
		if (type === 'Fix') return 'Fixes'
		return `${ type }s`
	}

	function badgeClass(type: ChangelogItemType): string {
		return String(type).toLowerCase().replace(/[^a-z0-9]+/g, '-')
	}

	function itemKey(change: ChangelogEntry, item: ChangelogItem): string {
		return `${ change.version }-${ item.type }-${ item.content }`
	}
</script>

<svelte:head>
	{#if resolvedHeadTitle}
		<title>{resolvedHeadTitle}</title>
	{/if}
</svelte:head>

<div class={[ 'gb-changelog', className ].filter(Boolean).join(' ')} class:gb-changelog--embedded={embedded}>
	{#if !embedded}
		<header class="gb-changelog__header">
			<h1 class="gb-changelog__title">{title}</h1>
			{#if intro}<p class="gb-changelog__intro">{intro}</p>{/if}
		</header>
	{/if}

	<div class="gb-changelog__timeline">
		{#each changes as change (change.version)}
			<section class="gb-changelog__entry">
				<h2 class="gb-changelog__version">{formatVersion(change)}</h2>
				<span class="gb-changelog__date">{formatDate(change.date)}</span>

				{#each changeTypes as type (type)}
					{@const items = changesOfType(change, type)}
					{#if items.length > 0}
						<h3 class="gb-changelog__type-header">{headingFor(type)}</h3>
						<ul class="gb-changelog__changes">
							{#each items as item (itemKey(change, item))}
								<li class="gb-changelog__item">
									<span class={`gb-changelog__badge gb-changelog__badge--${ badgeClass(type) }`}>{type}</span>
									{#if item.emoji}<span class="gb-changelog__emoji">{item.emoji}</span>{/if}
									<span class="gb-changelog__item-text">{item.content}</span>
								</li>
							{/each}
						</ul>
					{/if}
				{/each}
			</section>
		{/each}
	</div>
</div>

<style>
	.gb-changelog {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.gb-changelog--embedded {
		padding: 0;
	}

	.gb-changelog__header {
		margin-bottom: 2.5rem;
	}

	.gb-changelog__title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1.1;
		margin: 0 0 1rem;
	}

	.gb-changelog__intro {
		color: var(--gb-changelog-muted, #64748b);
		font-size: 1.125rem;
		line-height: 1.7;
		margin: 0;
		max-width: 70ch;
	}

	.gb-changelog__timeline {
		display: grid;
		gap: 2rem;
	}

	.gb-changelog__entry {
		border-left: 3px solid var(--gb-changelog-border, #e2e8f0);
		padding-left: 1.5rem;
		position: relative;
	}

	.gb-changelog__entry::before {
		background: var(--gb-changelog-accent, #2563eb);
		border-radius: 999px;
		content: '';
		height: 0.875rem;
		left: -0.53125rem;
		position: absolute;
		top: 0.35rem;
		width: 0.875rem;
	}

	.gb-changelog__version {
		font-size: 1.35rem;
		line-height: 1.2;
		margin: 0 0 0.25rem;
	}

	.gb-changelog__date {
		color: var(--gb-changelog-muted, #64748b);
		display: block;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.gb-changelog__type-header {
		font-size: 1rem;
		margin: 1.25rem 0 0.6rem;
	}

	.gb-changelog__changes {
		display: grid;
		gap: 0.55rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gb-changelog__item {
		align-items: start;
		display: grid;
		gap: 0.6rem;
		grid-template-columns: auto auto 1fr;
		line-height: 1.5;
	}

	.gb-changelog__badge {
		border-radius: 999px;
		background: var(--gb-changelog-badge-bg, #f1f5f9);
		color: var(--gb-changelog-text, #0f172a);
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
		padding: 0.35rem 0.5rem;
	}

	.gb-changelog__badge--new {
		background: var(--gb-changelog-badge-new-bg, #dcfce7);
		color: var(--gb-changelog-badge-new-text, #166534);
	}

	.gb-changelog__badge--upgrade {
		background: var(--gb-changelog-badge-upgrade-bg, #dbeafe);
		color: var(--gb-changelog-badge-upgrade-text, #1e40af);
	}

	.gb-changelog__badge--fix {
		background: var(--gb-changelog-badge-fix-bg, #fef3c7);
		color: var(--gb-changelog-badge-fix-text, #92400e);
	}

	.gb-changelog__emoji {
		line-height: 1.4;
	}

	.gb-changelog__item-text {
		min-width: 0;
	}

	@media (max-width: 640px) {
		.gb-changelog {
			padding: 1rem;
		}

		.gb-changelog--embedded {
			padding: 0;
		}

		.gb-changelog__item {
			grid-template-columns: auto 1fr;
		}

		.gb-changelog__emoji {
			display: none;
		}
	}
</style>
