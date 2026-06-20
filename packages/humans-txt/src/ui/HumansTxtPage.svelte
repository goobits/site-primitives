<script lang="ts">
	import './HumansTxtPage.scss'
	import { isLastItem, type HumansTxtContributorGroups, type HumansTxtLibrary, type HumansTxtPerson } from '../core.ts'

	let {
		ascii = '',
		team = [],
		contributors = {},
		libraries = [],
		terminalTitle = 'Website Terminal - zsh',
		terminalPath = 'site:~/public',
		teamDescription = "Core team members behind the site's development and design.",
		contributorDescription = 'Contributors lending expertise to design and user experience.'
	}: {
		ascii?: string
		team?: HumansTxtPerson[]
		contributors?: HumansTxtContributorGroups
		libraries?: HumansTxtLibrary[]
		terminalTitle?: string
		terminalPath?: string
		teamDescription?: string
		contributorDescription?: string
	} = $props()
</script>

<svelte:head>
	<title>Humans.txt</title>
</svelte:head>

<section class="terminal">
	<div class="terminal__container">
		<div class="terminal-window">
			<header class="terminal-window__header">
				<div class="terminal-window__buttons">
					<div class="terminal-window__button terminal-window__button--close"></div>
					<div class="terminal-window__button terminal-window__button--minimize"></div>
					<div class="terminal-window__button terminal-window__button--maximize"></div>
				</div>
				<div class="terminal-window__title">{terminalTitle}</div>
			</header>

			<div class="terminal-content">
				<div class="terminal-content__command-line">
					<span class="terminal-content__path">{terminalPath}</span>
					<span class="terminal-content__command">cat humans.txt</span>
				</div>

				<div class="terminal-content__content">
					{#if ascii}<pre class="terminal-content__ascii-art">{ascii}</pre>{/if}

					<div class="terminal-content__section">
						<span class="syntax__comment">/**
 * @class Team
 * {teamDescription}
 */</span>
						<br>
						<span class="syntax__keyword">class</span> <span class="syntax__function">Team</span> &#123;
						<div class="terminal-content__indent">
							<span class="syntax__keyword">constructor</span>() &#123;
							{#each team as member, i (member.email || member.url || member.name)}
								<div class="terminal-content__indent">
									{#if member.description}
										<span class="syntax__comment" style="white-space: pre-line">
											// {member.description}
											{#if member.url}
												<span class="syntax__path">(<a href={member.url}>{member.url}</a>)</span>
											{/if}
											{#if member.email}
												<span class="syntax__operator">&#60;<a href={`mailto:${ member.email }`}>{member.email}</a>&#62;</span>
											{/if}
										</span>
										<br>
									{/if}
									<span class="syntax__keyword">this</span><span class="syntax__variable">.{member.role || 'member'}</span> =
									<span class="syntax__string">"{member.name}"</span>;
								</div>
								{#if !isLastItem(team, i)}<br>{/if}
							{/each}
							&#125;
						</div>
						&#125;
					</div>

					{#if Object.keys(contributors).length > 0}
						<div class="terminal-content__section">
							<span class="syntax__comment">/**
 * @class Contributors
 * {contributorDescription}
 */</span>
							<br>
							<span class="syntax__keyword">class</span> <span class="syntax__function">Contributors</span> &#123;
							<div class="terminal-content__indent">
								<span class="syntax__keyword">constructor</span>() &#123;
								{#each Object.entries(contributors) as [ type, members ], i (type)}
									<div class="terminal-content__indent">
										<span class="syntax__keyword">this</span><span class="syntax__variable">.{type}</span> = [
										{#each members as member, j (member.handle || member.email || member.url || member.name)}
											<div class="terminal-content__indent">
												{#if member.description}
													<span class="syntax__comment">
														// {member.description}
														{#if member.url}
															<span class="syntax__path">(<a href={member.url}>{member.url}</a>)</span>
														{/if}
													</span>
													<br>
												{/if}
												<span class="syntax__string">"{member.name}"</span>{#if !isLastItem(members, j)},{/if}
												{#if member.handle}
													<span class="syntax__path"><a href={member.handleUrl || member.url}>({member.handle})</a></span>
												{/if}
												{#if member.url && !member.description}
													<span class="syntax__path"><a href={member.url}>({member.url})</a></span>
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
						<div class="terminal-content__section">
							<span class="syntax__comment">/**
 * Libraries used in this site
 */</span>
							<br>
							<span class="syntax__keyword">const</span> <span class="syntax__variable">libraries</span> = [
							{#each libraries as lib, i (lib.name)}
								<div class="terminal-content__indent">&#123;
									<div class="terminal-content__indent">
										<span class="syntax__variable">name:</span> <span class="syntax__string">"{lib.name}"</span>,<br>
										{#if lib.author}<span class="syntax__variable">author:</span> <span class="syntax__string">"{lib.author}"</span>,<br>{/if}
										{#if lib.url}<span class="syntax__variable">url:</span> <span class="syntax__path">"{lib.url}"</span>,<br>{/if}
										{#if lib.license}<span class="syntax__variable">license:</span> <span class="syntax__string">"{lib.license}"</span>{/if}
									</div>
									&#125;{#if !isLastItem(libraries, i)},{/if}
								</div>
							{/each}
							]
						</div>
					{/if}

					<div class="terminal-content__section">
						<span class="syntax__comment">/**
 * Special thanks to all contributors and the community.
 */</span>
					</div>
					<div class="cursor"></div>
				</div>
			</div>
		</div>
	</div>
</section>
