<script lang="ts">
	import SummaryListCard from '$lib/components/summaryListCard.svelte';

    export let data;
    const summaries = data.summaries;
    $: summaries
</script>

<div>
    <h1>Past Sessions</h1>
    {#if summaries}
        {#each summaries as summary}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <a class="summaryListCard" data-sveltekit-preload-data="hover" href={`/summary/${summary.id}`}>
            <SummaryListCard 
                question={summary.question_text} 
                date={new Date(summary.created_at)}
            />
        </a>
        {/each}
    {/if}
</div>

<style lang="scss">
    div {
        padding: 40px 0px;
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
        .summaryListCard {
            padding: 20px;
            display: block;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .summaryListCard:hover {
            background-color: #FE4BDD;
            cursor: pointer;
        }
    }
    
</style>