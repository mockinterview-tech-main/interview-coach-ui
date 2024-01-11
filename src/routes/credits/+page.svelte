<script lang="ts">
    export let data;
    const offerings = data.offerings;
</script>

<h2>Choose Your Package</h2>
<section class="section">
    <div class="steps">
        <div class="step">
            <h3>Looking Around $5.00</h3>
            <ul>
                <li>Best as a refresher on interviewing</li>
            </ul>
        </div>
        <div class="step">
            <h3>Passive Candidate $20.00</h3>
            <ul>
                <li>Equivalent to a 2 hour live person coaching session valued at $200.00</li>
            </ul>
        </div>
        <div class="step">
            <h3>Active Candidate $30.00</h3>
            <ul>
                <li>Best for refining answers to tricky interview questions or preparing for multiple interviews</li>
            </ul>
        </div>
    </div>
</section>
<div>
    {#each offerings as offering}
        <form action="?/purchase" method="POST">
            <h3>{offering.label}</h3>
            <input type="hidden" name="chosenOffering" value={JSON.stringify(offering)} />
            <button class="secondary-button" type="submit" id="checkout-button">{offering.label} ${offering.price}.00</button>
        </form>
    {/each}
</div>

<style lang="scss">
    @import "$lib/styles/colors.scss";
    
    h2 {
        padding: 60px 40px;
    }
    div {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .section {
        padding: 20px 0;
        text-align: center;
        &:last-of-type {
            padding-bottom: 60px;
        }
    }

    .steps {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .step {
        background-color: $light-gray;
        flex-direction: column;
        padding: 20px;
        border-radius: 8px;
        flex: 1;
        margin: 20px;
        ul {
            margin: auto;
            padding: 0;
            list-style-type: none;
            li {
                margin: 10px;
                text-align: center;
            }
        }
    }

</style>