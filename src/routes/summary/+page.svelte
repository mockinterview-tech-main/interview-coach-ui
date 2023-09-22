<script lang="ts">
	import ListItem from '$lib/components/listItem.svelte';

    export let data;
    const summaries = data.summaries;
    $: summaries
</script>

<div>
    <h1>Past Sessions</h1>
    {#if summaries}
        {#each summaries as summary}
        <a data-sveltekit-preload-data="hover" href={`/summary/${summary.id}`}>
            <ListItem
                title={summary.question_text} 
                subtitle={`${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`}
            />
        </a>
        {/each}
    {/if}
</div>

<style lang="scss">
    div {
        padding: 40px 20px;
        a:link {
            text-decoration: inherit;
            color: inherit;
            cursor: auto;
        }

        a:visited {
            text-decoration: inherit;
            color: inherit;
            cursor: auto;
        }
        justify-items: center;
        h1 {
            margin: 40px 20px;
        }
    }
    
</style>