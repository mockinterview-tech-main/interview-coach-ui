<script lang="ts">
	export const prerenderer = true;

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { interviewSummaryStore } from '$lib/stores/summaryStore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getConversation, getSummary } from '$lib/serviceApi';

	// export let data;
	let conversationText = '';

	onMount(async () => {
		let summary = await getSummary($page.params.slug);
		let conversation = '';

		if (summary?.summary_text) {
			let conversationData = await getConversation(summary?.conversation_id);
			conversation = conversationData?.text || 'Converation not found';
			conversationText = conversation;
			try {
				let parts = JSON.parse(summary?.summary_text);
				interviewSummaryStore.set({ ...summary, ...parts });
			} catch (e) {
				console.log('model returned invalid json');
			}
		}
	});

	const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);
</script>

<div>
	{#if $interviewSummaryStore}
		<h1>{$interviewSummaryStore.title || 'Your Past Interview'}</h1>
		<i>{new Date($interviewSummaryStore.created_at).toLocaleDateString()}</i><br /><br />
		<Accordion multiple>
			<Panel open>
				<Header><h2>Storytelling Fundamentals: {$interviewSummaryStore.overall.grade}</h2></Header>
				<Content>
					<p>{$interviewSummaryStore.overall.summary}</p>

					<h3>Situation: {$interviewSummaryStore.situation.grade}</h3>
					<p>{$interviewSummaryStore.situation.summary}</p>

					<h3>Task: {$interviewSummaryStore.task.grade}</h3>
					<p>{$interviewSummaryStore.task.summary}</p>

					<h3>Action: {$interviewSummaryStore.action.grade}</h3>
					<p>{$interviewSummaryStore.action.summary}</p>

					<h3>Result: {$interviewSummaryStore.result.grade}</h3>
					<p>{$interviewSummaryStore.result.summary}</p>
				</Content>
			</Panel>
			{#if $interviewSummaryStore.focus}
				<Panel open>
					<Header
						><h2>
							Focus Area {capitalize($interviewSummaryStore.focus.area)}: {$interviewSummaryStore
								.focus.grade}
						</h2></Header
					>
					<Content>
						<p>{$interviewSummaryStore.focus.summary}</p>
					</Content>
				</Panel>
			{/if}
			<Panel>
				<Header><h2>Questions Asked</h2></Header>
				<Content>
					{#each $interviewSummaryStore.questions as question}
						<p>{question}</p>
					{/each}
				</Content>
			</Panel>
			<Panel>
				<Header><h2>Interview Transcript</h2></Header>
				<Content>
					{#each conversationText.split('\n') as part}
						<p>{part}</p>
					{/each}
				</Content>
			</Panel>
		</Accordion>
	{/if}
</div>

<style lang="scss">
	div {
		padding: 50px;
		h1 {
			margin-top: 80px;
			margin-left: 40px;
		}
		i {
			margin-left: 40px;
		}
		h3 {
			display: block;
			text-align: left;
			font-weight: 700;
		}
	}
</style>
