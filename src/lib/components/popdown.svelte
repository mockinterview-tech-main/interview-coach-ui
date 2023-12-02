<script lang="ts">
    export let isActive = false;
    const togglePopdown = () => isActive = !isActive;
</script>

<div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="popdown-header" on:click={togglePopdown}>
        <slot name="popdown-header"/>
    </div>
    <div class={isActive ? "active popdown-content" : "popdown-content"}>
        <slot name="popdown-content"/>
    </div>
</div>

<style lang="scss">
    @import "../styles/colors.scss";
    div {
        margin: 20px 0px;
    }
    .popdown-header {
        cursor: pointer;
        padding: 1px 20px;
        border-bottom: 1px solid $dark-purple;
        transition: background-color 0.3s ease;
        border-radius: 4px;
    }
    .popdown-header:hover {
        background-color: $dark-purple;
        color: $white;
    }
    .popdown-content {
        max-height: 0;
        padding: 0px 20px;
        overflow: hidden;
        transition: max-height 0.4s ease-in-out;
    }

    .active {
        max-height: 1000px; /* or any other max-height that works for your content */
        overflow: scroll;
    }
</style>