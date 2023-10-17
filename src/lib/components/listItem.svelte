<script lang="ts">
    export let title: string;
    export let subtitle: string;
    export let selected = false;

    $: selected;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click class="list-card {selected ? 'selected' : ''}">
    <i><strong>{title}</strong></i><br/><br/>
    <i>{subtitle}</i>
</div>

<style lang="scss">
    @import "../styles/colors.scss";
    div {
        cursor: pointer;
    }
    .selected {
        background-color: $dark-purple;
        color: $white;
    }
    .list-card {
        padding: 10px 20px;
        display: block;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s ease-in-out;
    }
    .list-card:hover {
        background-color: $dark-purple;
        color: $white;
        cursor: pointer;
    }
</style>