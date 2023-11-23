<script lang="ts">
	import HorizontalLoader from '$lib/components/horizontalLoader.svelte';
	import ListItem from '$lib/components/listItem.svelte';
	import { getSummary } from '$lib/serviceApi.js';
	import type { InterviewSummary } from '$lib/stores/summaryStore.js';

    export let data;
    let summaries: InterviewSummary[];
    let unfinishedSummaries: InterviewSummary[] = [];
    
    const finishUnfinishedSummaries = async (unfinishedSummaries: InterviewSummary[]) => {
        const finishedSummaries = await Promise.all(unfinishedSummaries.map(s => getSummary(s.id)));
        summaries = [...summaries.filter(s => s.summary_text), ...finishedSummaries.filter((s): s is InterviewSummary => s !== null)];
    }

    if (data.summaries){
        summaries = data.summaries?.map((summary: InterviewSummary) => {
            try {
                if (summary.summary_text){
                    let parts = JSON.parse(summary?.summary_text);
                    return {...summary, ...parts} as InterviewSummary;
                } else {
                    unfinishedSummaries = [...unfinishedSummaries, summary]
                    return {...summary} as InterviewSummary;
                }
            } catch (e) {
                console.log("model returned invalid json");
                return {...summary} as InterviewSummary;
            }
        });
    }
    finishUnfinishedSummaries(unfinishedSummaries);
    $: summaries

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
                />
            </a>
        {:else}
            <a data-sveltekit-preload-data="hover" href={`/summary/${summary.id}`}>
                <p><HorizontalLoader size="xs" position="l">Processing Interview From {`${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`}</HorizontalLoader></p>
            </a>
        {/if}
        {/each}
    {:else}
    <p>Past interview evaluations will show up here as you practice. Start a <a href="/interview">new practice session.</a></p>
    {/if}
</div>

<style lang="scss">
    div {
        padding: 40px 20px;
        h1 { margin: 40px 20px; }
    }
    a {
        color: inherit;
        display: block;
        padding: 5px 20px;
        p {
            padding: 5px 20px;
        }
    }
</style>