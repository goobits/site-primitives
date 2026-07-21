<script lang="ts">
	import { isLastItem, type HumansTxtContributorGroups, type HumansTxtLibrary, type HumansTxtPerson } from '../core.ts'

	let {
		ascii = '',
		team = [],
		contributors = {},
		libraries = [],
		terminalTitle = 'Website Terminal - zsh',
		terminalPath = 'site:~/public',
		teamDescription = "Core team members behind the site's development and design.",
		contributorDescription = 'Contributors lending expertise to design and user experience.',
		headTitle = 'Humans.txt',
		class: className = ''
	}: {
		ascii?: string
		team?: HumansTxtPerson[]
		contributors?: HumansTxtContributorGroups
		libraries?: HumansTxtLibrary[]
		terminalTitle?: string
		terminalPath?: string
		teamDescription?: string
		contributorDescription?: string
		headTitle?: string | null
		class?: string
	} = $props()
</script>

<svelte:head>
	{#if headTitle}
		<title>{headTitle}</title>
	{/if}
</svelte:head>

<section class={[ 'gb-humans-txt', className ].filter(Boolean).join(' ')}>
	<div class="gb-humans-txt__container">
		<div class="gb-humans-txt-window">
			<header class="gb-humans-txt-window__header">
				<div class="gb-humans-txt-window__buttons">
					<div class="gb-humans-txt-window__button gb-humans-txt-window__button--close"></div>
					<div class="gb-humans-txt-window__button gb-humans-txt-window__button--minimize"></div>
					<div class="gb-humans-txt-window__button gb-humans-txt-window__button--maximize"></div>
				</div>
				<div class="gb-humans-txt-window__title">{terminalTitle}</div>
			</header>

			<div class="gb-humans-txt-content">
				<div class="gb-humans-txt-content__command-line">
					<span class="gb-humans-txt-content__path">{terminalPath}</span>
					<span class="gb-humans-txt-content__command">cat humans.txt</span>
				</div>

				<div class="gb-humans-txt-content__content">
					{#if ascii}<pre class="gb-humans-txt-content__ascii-art">{ascii}</pre>{/if}

					<div class="gb-humans-txt-content__section">
						<span class="gb-humans-txt-syntax__comment">/**
 * @class Team
 * {teamDescription}
 */</span>
						<br>
						<span class="gb-humans-txt-syntax__keyword">class</span> <span class="gb-humans-txt-syntax__function">Team</span> &#123;
						<div class="gb-humans-txt-content__indent">
							<span class="gb-humans-txt-syntax__keyword">constructor</span>() &#123;
							{#each team as member, i (member.email || member.url || member.name)}
								<div class="gb-humans-txt-content__indent">
									{#if member.description}
										<span class="gb-humans-txt-syntax__comment" style="white-space: pre-line">
											// {member.description}
											{#if member.url}
												<span class="gb-humans-txt-syntax__path">(<a href={member.url}>{member.url}</a>)</span>
											{/if}
											{#if member.email}
												<span class="gb-humans-txt-syntax__operator">&#60;<a href={`mailto:${ member.email }`}>{member.email}</a>&#62;</span>
											{/if}
										</span>
										<br>
									{:else if member.url || member.email}
										<span class="gb-humans-txt-syntax__comment" style="white-space: pre-line">
											{#if member.url}
												<span class="gb-humans-txt-syntax__path">(<a href={member.url}>{member.url}</a>)</span>
											{/if}
											{#if member.email}
												<span class="gb-humans-txt-syntax__operator">&#60;<a href={`mailto:${ member.email }`}>{member.email}</a>&#62;</span>
											{/if}
										</span>
										<br>
									{/if}
									<span class="gb-humans-txt-syntax__keyword">this</span><span class="gb-humans-txt-syntax__variable">.{member.role || 'member'}</span> =
									<span class="gb-humans-txt-syntax__string">"{member.name}"</span>;
								</div>
								{#if !isLastItem(team, i)}<br>{/if}
							{/each}
							&#125;
						</div>
						&#125;
					</div>

					{#if Object.keys(contributors).length > 0}
						<div class="gb-humans-txt-content__section">
							<span class="gb-humans-txt-syntax__comment">/**
 * @class Contributors
 * {contributorDescription}
 */</span>
							<br>
							<span class="gb-humans-txt-syntax__keyword">class</span> <span class="gb-humans-txt-syntax__function">Contributors</span> &#123;
							<div class="gb-humans-txt-content__indent">
								<span class="gb-humans-txt-syntax__keyword">constructor</span>() &#123;
								{#each Object.entries(contributors) as [ type, members ], i (type)}
									<div class="gb-humans-txt-content__indent">
										<span class="gb-humans-txt-syntax__keyword">this</span><span class="gb-humans-txt-syntax__variable">.{type}</span> = [
										{#each members as member, j (member.handle || member.email || member.url || member.name)}
											<div class="gb-humans-txt-content__indent">
												{#if member.description}
													<span class="gb-humans-txt-syntax__comment">
														// {member.description}
														{#if member.url}
															<span class="gb-humans-txt-syntax__path">(<a href={member.url}>{member.url}</a>)</span>
														{/if}
													</span>
													<br>
												{/if}
												<span class="gb-humans-txt-syntax__string">"{member.name}"</span>{#if !isLastItem(members, j)},{/if}
												{#if member.handle}
													<span class="gb-humans-txt-syntax__path"><a href={member.handleUrl || member.url}>({member.handle})</a></span>
												{/if}
												{#if member.url && !member.description}
													<span class="gb-humans-txt-syntax__path"><a href={member.url}>({member.url})</a></span>
												{/if}
											</div>
										{/each}
										];
										{#if !isLastItem(Object.entries(contributors), i)}<br><br>{/if}
									</div>
								{/each}
								&#125;
							</div>
							&#125;
						</div>
					{/if}

					{#if libraries.length > 0}
						<div class="gb-humans-txt-content__section">
							<span class="gb-humans-txt-syntax__comment">/**
 * Libraries used in this site
 */</span>
							<br>
							<span class="gb-humans-txt-syntax__keyword">const</span> <span class="gb-humans-txt-syntax__variable">libraries</span> = [
							{#each libraries as lib, i (lib.name)}
								<div class="gb-humans-txt-content__indent">&#123;
									<div class="gb-humans-txt-content__indent">
										<span class="gb-humans-txt-syntax__variable">name:</span> <span class="gb-humans-txt-syntax__string">"{lib.name}"</span>,<br>
										{#if lib.author}<span class="gb-humans-txt-syntax__variable">author:</span> <span class="gb-humans-txt-syntax__string">"{lib.author}"</span>,<br>{/if}
										{#if lib.url}<span class="gb-humans-txt-syntax__variable">url:</span> <span class="gb-humans-txt-syntax__path">"{lib.url}"</span>,<br>{/if}
										{#if lib.license}<span class="gb-humans-txt-syntax__variable">license:</span> <span class="gb-humans-txt-syntax__string">"{lib.license}"</span>{/if}
									</div>
									&#125;{#if !isLastItem(libraries, i)},{/if}
								</div>
							{/each}
							]
						</div>
					{/if}

					<div class="gb-humans-txt-content__section">
						<span class="gb-humans-txt-syntax__comment">/**
 * Special thanks to all contributors and the community.
 */</span>
					</div>
					<div class="gb-humans-txt__cursor"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.gb-humans-txt__container {
		margin: 0 auto;
		max-width: 960px;
	}

	.gb-humans-txt-window {
		background: var(--gb-humans-txt-bg, #282a36);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		box-shadow:
			0 22px 60px rgba(0, 0, 0, 0.45),
			0 10px 28px rgba(0, 0, 0, 0.28),
			0 3px 14px rgba(0, 0, 0, 0.35);
		color: var(--gb-humans-txt-text, #f8f8f2);
		isolation: isolate;
		overflow: hidden;
	}

	.gb-humans-txt-window__header {
		align-items: center;
		background: var(--gb-humans-txt-header, #1d1f27);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 14px 14px 0 0;
		display: flex;
		padding: 0.5rem 1rem;
	}

	.gb-humans-txt-window__buttons {
		display: flex;
		gap: 0.5rem;
		margin-right: 1rem;
	}

	.gb-humans-txt-window__button {
		border-radius: 50%;
		height: 12px;
		width: 12px;
	}

	.gb-humans-txt-window__button--close {
		background: var(--gb-humans-txt-close, #ff5f56);
	}

	.gb-humans-txt-window__button--minimize {
		background: var(--gb-humans-txt-minimize, #ffbd2e);
	}

	.gb-humans-txt-window__button--maximize {
		background: var(--gb-humans-txt-maximize, #27c93f);
	}

	.gb-humans-txt-window__title {
		color: var(--gb-humans-txt-text, #f8f8f2);
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.gb-humans-txt-content {
		color: var(--gb-humans-txt-text, #f8f8f2);
		font-family: Monaco, Consolas, monospace;
		overflow: auto;
		padding: 1rem;
	}

	.gb-humans-txt-content__command-line {
		display: flex;
		font-size: 0.9rem;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.gb-humans-txt-content__path {
		color: var(--gb-humans-txt-blue, #8be9fd);
	}

	.gb-humans-txt-content__section {
		margin: 1.5rem 0;
	}

	.gb-humans-txt-content__indent {
		margin-left: 2rem;
	}

	.gb-humans-txt-content__ascii-art {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		color: var(--gb-humans-txt-green, #50fa7b);
		line-height: 1.2;
		margin: 1rem 0;
		padding: 0;
		white-space: pre;
	}

	.gb-humans-txt-syntax__comment {
		color: var(--gb-humans-txt-comment, #8b9acb);
		white-space: pre;
	}

	.gb-humans-txt-syntax__keyword,
	.gb-humans-txt-syntax__operator {
		color: var(--gb-humans-txt-pink, #ff79c6);
	}

	.gb-humans-txt-syntax__function {
		color: var(--gb-humans-txt-green, #50fa7b);
	}

	.gb-humans-txt-syntax__variable {
		color: var(--gb-humans-txt-blue, #8be9fd);
	}

	.gb-humans-txt-syntax__string {
		color: var(--gb-humans-txt-yellow, #f1fa8c);
	}

	.gb-humans-txt-syntax__path {
		color: var(--gb-humans-txt-purple, #bd93f9);
	}

	.gb-humans-txt-syntax__path a,
	.gb-humans-txt-syntax__operator a {
		color: inherit;
		text-decoration: underline;
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.16em;
	}

	.gb-humans-txt__cursor {
		animation: gb-humans-txt-blink 1s step-end infinite;
		background: var(--gb-humans-txt-text, #f8f8f2);
		display: inline-block;
		height: 1rem;
		margin-left: 2px;
		width: 8px;
	}

	@keyframes gb-humans-txt-blink {
		50% {
			opacity: 0;
		}
	}
</style>
