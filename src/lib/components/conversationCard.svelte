<script lang="ts">
    export let conversation: Array<string>;
    export let loading: boolean;
</script>

{#each conversation as part}
    <p>{part}</p>
{/each}
{#if loading}
    <p>Hang on, I'm taking some notes 📝...</p>
{/if}