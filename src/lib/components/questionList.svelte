<script lang="ts">
	import ListItem from "./listItem.svelte";

    type ListItemData<T> = { title: string; data: T;};

    export let options: Array<ListItemData<any>>;
    export let selectedItem: ListItemData<any>;
    
    $: selectedItem;
    const selectItem = (item: ListItemData<any>) => selectedItem = item;

</script>

<p>You can choose from this list of top soft-skills interview questions to work on or select "ask me anything" for a random soft-skills question.</p>
<div>
    {#each options as option}
        <ListItem selected={option.title === selectedItem.title} title={option.title} subtitle="" on:click={() => selectItem(option)}/>
    {/each}
</div>

<style lang="scss">
    p { text-align: center; }
</style>