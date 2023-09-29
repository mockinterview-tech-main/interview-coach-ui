<script lang="ts">
    export let title: string;
    export let subtitle: string;
    export let selected = false;

    $: selected;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click class={selected ? "selected summary-list-card" : "summary-list-card"}>
    <i><strong>{title}</strong></i><br/><br/>
    <i>{subtitle}</i>
</div>

<style lang="scss">
    div {
        cursor: pointer;
    }
    .selected {
        background-color: #FE4BDD;
    }
    .summary-list-card {
        padding: 10px 20px;
        display: block;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .summary-list-card:hover {
        background-color: #FE4BDD;
        cursor: pointer;
    }
</style>