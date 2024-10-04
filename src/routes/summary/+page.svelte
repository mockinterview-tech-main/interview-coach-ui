<script lang="ts">
	export const prerenderer = true;

	import HorizontalLoader from '$lib/components/horizontalLoader.svelte';
	import ListItem from '$lib/components/listItem.svelte';

	export let data;

	const summaries = data.summaries;
</script>

<div>
	<h1>Past Interviews</h1>
	{#if summaries && summaries.length > 0}
		{#each summaries as summary}
			{#if summary.title}
				<a data-sveltekit-preload-data="hover" href={`/summary/${summary.id}`}>
					<ListItem
						title={summary.title}
						subtitle={`${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`}
					>
						<!-- <p>Overall: {summary.overall.grade}</p>
						<p>Focus on {summary.focus.area}: {summary.focus.grade}</p> -->
					</ListItem>
				</a>
			{:else}
				<a data-sveltekit-preload-data="hover" href={`/summary/${summary.id}`}>
					<p>
						<HorizontalLoader size="xs" position="l"
							>Processing Interview From {`${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`}</HorizontalLoader
						>
					</p>
				</a>
			{/if}
		{/each}
	{:else if summaries && summaries.length == 0}
		<p class="no-sessions">
			Past interview evaluations will show up here as you practice. <a href="/interview"
				>Start a new practice session.</a
			>
		</p>
	{:else}
		<div>LOADING...</div>
	{/if}
</div>

<style lang="scss">
	@import '../../lib/styles/colors.scss';
	div {
		padding: 40px 20px;
		h1 {
			margin: 40px 20px;
		}
	}
	a {
		color: inherit;
		display: block;
		padding: 5px 20px;
		p {
			padding: 5px 20px;
		}
	}
	.no-sessions {
		margin-left: 20px;
		a {
			display: inline;
			padding: 0;
			font-weight: 700;
			text-decoration: underline;
		}
	}
</style>
