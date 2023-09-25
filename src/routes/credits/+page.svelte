<script lang="ts">
    export let data;
    const offerings = data.offerings;
    let selectedOffering = offerings[0];
    $: selectedOffering
 
</script>

<div>
    {#each offerings as offering}
        <form action="?/purchase" method="POST">
            <input type="hidden" name="chosenOffering" value={JSON.stringify(offering)} />
            <button type="submit" id="checkout-button">{offering.label} ${offering.price}.00</button>
        </form>
    {/each}
</div>

<style lang="scss">
    div {
        padding: 60px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>