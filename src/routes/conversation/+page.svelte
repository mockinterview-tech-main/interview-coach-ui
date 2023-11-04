<script lang="ts">
    let conversation: any;
    const get = async() => {
        let response = await fetch('/conversation')
        conversation = await response.json()
        console.log(conversation)
    };

    const post = async() => {
        const response = await fetch('/conversation', {
            method: 'POST',
            body: JSON.stringify({ participant: "blake", text: "asdf" }),
            headers: { 'Content-Type': 'application/json' }
        });
    }
</script>

<h1>convo</h1>

<div>
    {conversation}
</div>
<button on:click={get}>Get</button>
<button on:click={post}>Post</button>


