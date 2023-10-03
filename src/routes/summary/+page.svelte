<script lang="ts">
	import ListItem from '$lib/components/listItem.svelte';

    export let data;
    const summaries = data.summaries;
    $: summaries
    console.log(summaries)
</script>

<div>
    <h1>Past Interviews</h1>
    {#if summaries && summaries.length > 0}
        {#each summaries as summary}
        <a data-sveltekit-preload-data="hover" href={`/summary/${summary.id}`}>
            <ListItem
                title={summary.question_text} 
                subtitle={`${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`}
            />
        </a>
        {/each}
    {:else}
    <p>Past interview evaluations will show up here as you practice. Start a <a href="/interview">new practice session.</a></p>
    {/if}
</div>

<style lang="scss">
    div {
        padding: 40px 20px;
        a:visited {
            color: inherit;
        }
        h1 {
            margin: 40px 20px;
        }
    }
    
</style>