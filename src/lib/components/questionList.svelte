<script lang="ts">
	import ListItem from "./listItem.svelte";

    type ListItemData<T> = { title: string; data: T;};

    export let options: Array<ListItemData<any>>;
    export let selectedItem: ListItemData<any>;
    
    $: selectedItem

    const selectItem = (item: ListItemData<any>) => { 
        selectedItem = item;
    }
</script>

<h3>User Chat</h3>
<p>Select "Ask Me Anything" for an AI generated prompt, or select from our list of most common interview questions.</p>
<div>
    {#each options as option}
        <ListItem selected={option.title === selectedItem.title} title={option.title} subtitle="" on:click={() => selectItem(option)}/>
    {/each}
</div>

<style lang="scss">
    h3 {
        text-align: center;
        margin: 25px;
    }

    p {
        text-align: center;
        margin: 25px;
    }

    div {
        max-height: 500px;
        overflow: scroll;
    }
</style>