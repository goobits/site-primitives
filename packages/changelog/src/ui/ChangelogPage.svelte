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
		formatVersion = formatChangelogVersion
	}: {
		appName?: string
		title?: string
		intro?: string
		changes?: ChangelogEntry[]
		embedded?: boolean
		changeTypes?: readonly ChangelogItemType[]
		formatDate?: (value: string) => string
		formatVersion?: (entry: ChangelogEntry) => string
	} = $props()

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
	<title>{appName ? `${ appName } | ${ title }` : title}</title>
</svelte:head>

<div id="main-content" class="changelog" class:changelog--embedded={embedded}>
	{#if !embedded}
		<header class="changelog__header">
			<h1 class="changelog__title">{title}</h1>
			{#if intro}<p class="changelog__intro">{intro}</p>{/if}
		</header>
	{/if}

	<div class="changelog__timeline">
		{#each changes as change (change.version)}
			<section class="changelog__entry">
				<h2 class="changelog__version">{formatVersion(change)}</h2>
				<span class="changelog__date">{formatDate(change.date)}</span>

				{#each changeTypes as type (type)}
					{@const items = changesOfType(change, type)}
					{#if items.length > 0}
						<h3 class="changelog__type-header">{headingFor(type)}</h3>
						<ul class="changelog__changes">
							{#each items as item (itemKey(change, item))}
								<li class="changelog__item">
									<span class={`changelog__badge changelog__badge--${ badgeClass(type) }`}>{type}</span>
									{#if item.emoji}<span class="changelog__emoji">{item.emoji}</span>{/if}
									<span class="changelog__item-text">{item.content}</span>
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
	.changelog {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.changelog--embedded {
		padding: 0;
	}

	.changelog__header {
		margin-bottom: 2.5rem;
	}

	.changelog__title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1.1;
		margin: 0 0 1rem;
	}

	.changelog__intro {
		color: var(--color-text-muted, #64748b);
		font-size: 1.125rem;
		line-height: 1.7;
		margin: 0;
		max-width: 70ch;
	}

	.changelog__timeline {
		display: grid;
		gap: 2rem;
	}

	.changelog__entry {
		border-left: 3px solid var(--color-border, #e2e8f0);
		padding-left: 1.5rem;
		position: relative;
	}

	.changelog__entry::before {
		background: var(--color-accent, #2563eb);
		border-radius: 999px;
		content: '';
		height: 0.875rem;
		left: -0.53125rem;
		position: absolute;
		top: 0.35rem;
		width: 0.875rem;
	}

	.changelog__version {
		font-size: 1.35rem;
		line-height: 1.2;
		margin: 0 0 0.25rem;
	}

	.changelog__date {
		color: var(--color-text-muted, #64748b);
		display: block;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.changelog__type-header {
		font-size: 1rem;
		margin: 1.25rem 0 0.6rem;
	}

	.changelog__changes {
		display: grid;
		gap: 0.55rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.changelog__item {
		align-items: start;
		display: grid;
		gap: 0.6rem;
		grid-template-columns: auto auto 1fr;
		line-height: 1.5;
	}

	.changelog__badge {
		border-radius: 999px;
		background: var(--color-surface-muted, #f1f5f9);
		color: var(--color-text, #0f172a);
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
		padding: 0.35rem 0.5rem;
	}

	.changelog__badge--new {
		background: #dcfce7;
		color: #166534;
	}

	.changelog__badge--upgrade {
		background: #dbeafe;
		color: #1e40af;
	}

	.changelog__badge--fix {
		background: #fef3c7;
		color: #92400e;
	}

	.changelog__emoji {
		line-height: 1.4;
	}

	.changelog__item-text {
		min-width: 0;
	}

	@media (max-width: 640px) {
		.changelog {
			padding: 1rem;
		}

		.changelog--embedded {
			padding: 0;
		}

		.changelog__item {
			grid-template-columns: auto 1fr;
		}

		.changelog__emoji {
			display: none;
		}
	}
</style>
