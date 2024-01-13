<script lang="ts">
    import Button from '@smui/button';
    import Card from '@smui/card';

    export let data;
    const offerings = data.offerings;
</script>

<h2>Buy Interview Credits</h2>
<div>
    {#each offerings as offering}
        <Card style="margin: 10px;" padded>
            <form action="?/purchase" method="POST">
                <h3>{offering.label}</h3>
                <input type="hidden" name="chosenOffering" value={JSON.stringify(offering)} />
                <Button class="buy-button" type="submit" id="checkout-button">${offering.price}.00</Button>
            </form>
        </Card>
    {/each}
</div>

<style lang="scss">
    @import "$lib/styles/colors.scss";

    * :global(.buy-button) {
        margin: auto;
        border: 1px solid $dark-purple;
        background-color: $dark-purple;
        color: white;
    }
    
    div {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        flex-wrap: wrap;
        form {
            overflow: hidden;
            min-width: 300px;
            padding: 10px;
            text-align: center;
            text-wrap: nowrap;
        }
    }
    h2 { padding: 60px 40px; }

</style>