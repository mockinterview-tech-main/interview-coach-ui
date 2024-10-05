<script lang="ts">
	import { type Writable } from 'svelte/store';
	import { afterUpdate, beforeUpdate } from 'svelte';
	import HorizontalLoader from './horizontalLoader.svelte';
	import { type Conversation } from '$lib/stores/conversationStore';

	export let loading: boolean;
	export let conversationStore: Writable<Conversation>;

	const conversationSectionElement = document.querySelector('#conversationSection');
	if (conversationSectionElement) {
		const conversationSectionElementObserver = new MutationObserver(
			() => (conversationSectionElement.scrollTop = conversationSectionElement?.scrollHeight)
		);
		conversationSectionElementObserver.observe(conversationSectionElement, { childList: true });
	}

	let autoscroll = true;
	let conversationSection: HTMLDivElement;
	beforeUpdate(() => {
		if (conversationSection) {
			const scrollableDistance =
				conversationSection.scrollHeight - conversationSection.offsetHeight;
			autoscroll = conversationSection.scrollTop > scrollableDistance - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) {
			conversationSection.scrollTo(0, conversationSection.scrollHeight);
		}
	});
</script>

<div id="conversationSection" bind:this={conversationSection}>
	{#each $conversationStore.parts as part}
		{#if part.participant == 'ai'}
			<p class="ai-text">{@html part.text}</p>
		{:else}
			<p class="user-text">
				{@html part.text}
				{#if part.speakingTime}
					<br /><br />
					<span>speaking time: {@html part.speakingTime}</span>
				{/if}
			</p>
		{/if}
	{/each}
	{#if loading}
		<HorizontalLoader size="s" position="c">
			{'taking some notes...'}
		</HorizontalLoader>
	{/if}
</div>

<style lang="scss">
	@import '../styles/colors.scss';

	#conversationSection {
		padding: 0 25%;
		display: flex;
		margin-top: 1em;
		flex-direction: column;
		scroll-behavior: smooth;
		p {
			line-height: 25px;
			padding: 1em;
			margin: 1em;
			border-radius: 1em;
			display: inline-block;
			max-width: 80%;
			border: 1px solid black;
			width: fit-content;
			box-sizing: border-box;
		}
		.ai-text {
			text-align: left;
			background-color: $dark-purple;
			color: white;
			align-self: flex-start;
		}
		.user-text {
			text-align: right;
			background-color: white;
			color: black;
			align-self: flex-end;
		}
	}
</style>
