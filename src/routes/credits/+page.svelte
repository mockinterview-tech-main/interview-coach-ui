<script lang="ts">
    export let data;
    const offerings = data.offerings;
    let selectedOffering = offerings[0];
    $: selectedOffering
 
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
            <button type="submit" id="checkout-button">{offering.label} ${offering.price}.00</button>
        </form>
    {/each}
</div>

<style lang="scss">
    h2 {
        padding: 60px 40px;
    }
    div {
        display: flex;
        align-items: center;
        justify-content: space-around;
        h3 {
            text-align: center;
        }
        form {
            button {
                display: flex;
                align-items: center;
                padding: 10px 20px;
                border: 2px solid transparent;
                cursor: pointer;
                font-weight: bold;
                border-radius: 4px;
                transition: background-color 0.3s, border-color 0.3s;
                background: none;
                outline: none;
                font-size: 16px;
                border-color: #A40080;
                color: #333;
            }

            button:hover {
                background-color: #A40080;
                color: white;
            }
        }
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
        background-color: #f5f5f5;
        flex-direction: column;
        padding: 20px;
        border-radius: 8px;
        flex: 1;
        margin: 20px;
        h3 {
            text-align: center;
        }
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