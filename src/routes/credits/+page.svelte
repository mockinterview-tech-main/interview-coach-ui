<script lang="ts">
    import type { Choice } from '../api/payment-intent/+server';

    let offerings: Array<Choice> = [
        {SKU: "good", Price: 2, Label: "1 Interview Question"},
        {SKU: "better", Price: 5, Label: "3 Interview Questions"},
        {SKU: "best", Price: 10, Label: "5 Interview Questions"}
    ]

    let selectedOffering = offerings[0];
    $: selectedOffering
 
</script>

<div>
    <form action="?/five" method="POST">
        <button type="submit" id="checkout-button">Checkout</button>
    </form>
</div>

<style lang="scss">
    div {
        padding: 60px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>