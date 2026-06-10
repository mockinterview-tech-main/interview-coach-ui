<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;

	$: stories = data.stories || [];

	let expandedId: string | null = null;

	const toggleExpand = (id: string) => {
		expandedId = expandedId === id ? null : id;
	};

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const hasTalkingPoints = (story: any) => {
		if (!story.talking_points) return false;
		return ['situation', 'task', 'action', 'result'].some(k => story.talking_points[k]?.length);
	};

	const hasSignals = (story: any) => {
		if (!story.strength_signals) return false;
		return (story.strength_signals.strong?.length > 0) || (story.strength_signals.improve?.length > 0);
	};
</script>

<div class="sb-page">
	<div class="sb-back-row">
		<a href="/dashboard" class="sb-back">&larr; Dashboard</a>
	</div>
	<div class="sb-inner">
		<div class="sb-header">
			<h1>My Story Bank</h1>
			<p class="sb-subtitle">Review your polished narratives from previous coaching sessions.</p>
		</div>

		{#if stories.length === 0}
			<div class="sb-empty">
				<p>No stories yet. Complete a coaching session and your first story will appear here.</p>
			</div>
			<div class="sb-empty-action">
				<button class="sb-cta-btn" on:click={() => goto('/storybuilder')}>Build Your First Story</button>
			</div>
		{:else}
			<div class="sb-stories">
				{#each stories as story}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="sb-story-card" class:sb-story-expanded={expandedId === story.id} on:click={() => toggleExpand(story.id)}>
						<div class="sb-story-top">
							<div class="sb-story-info">
								<h3>{story.question || 'Untitled Story'}</h3>
							</div>
							<div class="sb-story-meta">
								<span class="sb-story-date">{formatDate(story.created_at)}</span>
								<span class="sb-story-toggle">{expandedId === story.id ? '▲' : '▼'}</span>
							</div>
						</div>

						{#if expandedId === story.id}
							<div class="sb-story-body" on:click|stopPropagation>
								{#if story.full_story}
									<div class="sb-section">
										<h4>Your Polished Answer</h4>
										<p class="sb-story-text">{story.full_story}</p>
									</div>
								{/if}

								{#if hasTalkingPoints(story)}
									<div class="sb-section">
										<h4>Talking Points</h4>
										<div class="sb-tp-grid">
											{#each ['situation', 'task', 'action', 'result'] as sKey}
												{#if story.talking_points[sKey]?.length}
													<div class="sb-tp-group">
														<span class="sb-tp-label">{sKey.charAt(0).toUpperCase() + sKey.slice(1)}</span>
														<ul>
															{#each story.talking_points[sKey] as point}
																<li>{point}</li>
															{/each}
														</ul>
													</div>
												{/if}
											{/each}
										</div>
									</div>
								{/if}

								{#if hasSignals(story)}
									<div class="sb-section">
										<h4>Strength Signals</h4>
										<p class="sb-signals-hint">How interviewers evaluate your story based on the question's theme.</p>
										{#if story.strength_signals.strong?.length}
											<div class="sb-sig-group">
												<span class="sb-sig-label sb-sig-label-strong">Strong</span>
												{#each story.strength_signals.strong as item}
													<div class="sb-sig-item">
														<span class="sb-sig-icon sb-sig-icon-strong">✓</span>
														<div>
															<span class="sb-sig-name">{item.signal}</span>
															<span class="sb-sig-explain">{item.explanation}</span>
														</div>
													</div>
												{/each}
											</div>
										{/if}
										{#if story.strength_signals.improve?.length}
											<div class="sb-sig-group">
												<span class="sb-sig-label sb-sig-label-improve">Could be stronger</span>
												{#each story.strength_signals.improve as item}
													<div class="sb-sig-item">
														<span class="sb-sig-icon sb-sig-icon-improve">⚡</span>
														<div>
															<span class="sb-sig-name">{item.signal}</span>
															<span class="sb-sig-explain">{item.explanation}</span>
														</div>
													</div>
												{/each}
											</div>
										{/if}
									</div>
								{/if}

								{#if story.flags?.length}
									<div class="sb-section">
										<h4>Watch Out</h4>
										<p class="sb-signals-hint">Things to avoid saying in the real interview.</p>
										{#each story.flags as item}
											<div class="sb-flag-item">
												<span class="sb-flag-icon">⚠</span>
												<div>
													<span class="sb-flag-text">{item.flag}</span>
													<span class="sb-flag-explain">{item.suggestion}</span>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@import '$lib/styles/colors.scss';

	.sb-page {
		min-height: 100vh;
		background: $bg-warm;
	}

	.sb-back-row {
		max-width: 1200px;
		margin: 0 auto;
		padding: 68px 20px 0;
	}

	.sb-back {
		display: inline-block;
		padding: 10px 24px;
		font-size: 0.9rem;
		font-weight: 600;
		color: #c96442;
		text-decoration: none;
		border: 1px solid #c96442;
		border-radius: 24px;
		transition: all 0.2s;
		&:hover {
			background: #c96442;
			color: white;
		}
	}

	.sb-inner {
		max-width: 1000px;
		margin: 0 auto;
		padding: 32px 24px 60px;
	}

	.sb-header {
		margin-bottom: 28px;
	}
	.sb-header h1 {
		font-size: 1.8rem;
		font-weight: 700;
		color: $text-dark;
		margin: 0 0 8px;
	}
	.sb-subtitle {
		color: $text-light;
		font-size: 1rem;
		margin: 0;
	}

	/* Empty state */
	.sb-empty {
		background: white;
		border-radius: 16px;
		padding: 48px 32px;
		text-align: center;
		box-shadow: $card-shadow;
		p {
			color: $text-light;
			font-size: 0.95rem;
			margin: 0;
		}
	}
	.sb-empty-action {
		text-align: center;
		margin-top: 24px;
	}
	.sb-cta-btn {
		background: #c96442;
		color: white;
		border: none;
		padding: 12px 32px;
		border-radius: 24px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s, transform 0.1s;
		margin: 0 auto;
		display: block;
		&:hover {
			background: #b5593a;
			transform: translateY(-1px);
		}
	}

	/* Story cards */
	.sb-stories {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.sb-story-card {
		background: white;
		border-radius: 16px;
		padding: 24px 28px;
		box-shadow: $card-shadow;
		cursor: pointer;
		transition: box-shadow 0.2s, transform 0.15s;
		border: 2px solid transparent;
		&:hover {
			box-shadow: $card-shadow-hover;
			transform: translateY(-1px);
		}
	}
	.sb-story-expanded {
		border-color: #e5e5e3;
		cursor: default;
	}

	.sb-story-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
	}
	.sb-story-info {
		flex: 1;
		min-width: 0;
	}
	.sb-story-info h3 {
		font-size: 1.05rem;
		font-weight: 700;
		color: $text-dark;
		margin: 0;
		text-align: left;
	}
	.sb-story-question {
		font-size: 0.88rem;
		color: $text-light;
		font-style: italic;
		margin: 4px 0 0;
	}
	.sb-story-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
	.sb-story-date {
		font-size: 0.82rem;
		color: $text-light;
		white-space: nowrap;
	}
	.sb-story-toggle {
		font-size: 0.7rem;
		color: #ccc;
	}

	/* Expanded body */
	.sb-story-body {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #f0ece6;
		cursor: default;
	}

	.sb-section {
		margin-bottom: 24px;
		&:last-child { margin-bottom: 0; }
	}
	.sb-section h4 {
		font-size: 0.9rem;
		font-weight: 700;
		color: $text-dark;
		margin: 0 0 10px;
		text-align: left;
	}
	.sb-story-text {
		font-size: 0.9rem;
		line-height: 1.7;
		color: #444;
		white-space: pre-wrap;
		margin: 0;
	}

	/* Talking points */
	.sb-tp-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		@media (max-width: 600px) { grid-template-columns: 1fr; }
	}
	.sb-tp-group {
		background: $bg-warm;
		padding: 14px;
		border-radius: 10px;
	}
	.sb-tp-label {
		display: block;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: $text-light;
		margin-bottom: 6px;
	}
	.sb-tp-group ul {
		margin: 0;
		padding-left: 16px;
	}
	.sb-tp-group li {
		font-size: 0.84rem;
		color: #555;
		margin-bottom: 4px;
		line-height: 1.4;
		list-style-type: disc;
	}

	/* Strength signals */
	.sb-signals-hint {
		font-size: 0.82rem;
		color: $text-light;
		margin: 0 0 14px;
	}
	.sb-sig-group {
		margin-bottom: 14px;
		&:last-child { margin-bottom: 0; }
	}
	.sb-sig-label {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 8px;
	}
	.sb-sig-label-strong { color: #2e7d32; }
	.sb-sig-label-improve { color: #c96442; }

	.sb-sig-item {
		display: flex;
		gap: 10px;
		padding: 8px 0;
		border-bottom: 1px solid #f0ece6;
		&:last-child { border-bottom: none; }
	}
	.sb-sig-icon {
		flex-shrink: 0;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.72rem;
		font-weight: 700;
		margin-top: 1px;
	}
	.sb-sig-icon-strong { background: #e8f5e9; color: #2e7d32; }
	.sb-sig-icon-improve { background: #fff3e0; color: #c96442; }
	.sb-sig-name {
		font-weight: 700;
		font-size: 0.88rem;
		color: $text-dark;
		margin-right: 5px;
	}
	.sb-sig-explain {
		font-size: 0.86rem;
		color: #666;
		line-height: 1.45;
	}

	/* Flags */
	.sb-flag-item {
		display: flex;
		gap: 10px;
		padding: 8px 0;
		border-bottom: 1px solid #f0ece6;
		&:last-child { border-bottom: none; }
	}
	.sb-flag-icon {
		flex-shrink: 0;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.72rem;
		font-weight: 700;
		margin-top: 1px;
		background: #fff3e0;
		color: #e65100;
	}
	.sb-flag-text {
		font-weight: 700;
		font-size: 0.88rem;
		color: $text-dark;
		display: block;
		margin-bottom: 2px;
	}
	.sb-flag-explain {
		font-size: 0.86rem;
		color: #666;
		line-height: 1.45;
	}

	@media (max-width: 600px) {
		.sb-header h1 { font-size: 1.5rem; }
		.sb-story-top { flex-direction: column; gap: 6px; }
	}
</style>
