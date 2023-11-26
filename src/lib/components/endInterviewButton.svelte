<script lang="ts">
	import { goto } from "$app/navigation";
    import HangupFilled from "$lib/assets/icons/hangup-filled.svg"
    import Hourglass from "$lib/assets/icons/hourglass.svg"
	import { postSummary } from "$lib/serviceApi";

    export let loading: boolean;
    export let conversation_id: string;

    const endInterview = async () => {
        if (conversation_id != ""){
            loading = true;
            const summary = await postSummary({conversation_id});
            if (summary?.id){
                goto(`/summary/${summary.id}`) // IDEA: don't score, let user pick up conversation later
            }
        } else {
            fetch('/interview', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({action: "add"})
            }); // add a token since interview never started
            goto(`/summary`)
        }

    }
</script>

<button 
    disabled={loading}
    on:click={endInterview}
    title={conversation_id == "" ? "Get Token Refund and Go Back" : "Score Interview Now"}
    class={`end-interview-button`}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img width="30px" height="30px" src={loading && conversation_id ? Hourglass : HangupFilled}/>
</button>

<style lang="scss">
    @import "../styles/colors.scss";

    button { margin: 10px auto; }
        
    .end-interview-button {
        width: 80px; 
        height: 80px;
        border: none;
        position: relative;
        background-color: red; 
        border-radius: 50%; 
        cursor: pointer;
        display: flex;
        justify-content: center;
        transition: background-color 0.3s ease; 
    }

    .end-interview-button:disabled { background-color: red; }

    .end-interview-button:disabled:hover {  background-color: red; }
    
    .end-interview-button:hover { background-color: $light-purple; }

    /* Style the tooltip */
    .end-interview-button[title]:hover::after {
        content: attr(title);
        background-color: $dark-gray; 
        color: $white; 
        padding: 4px 8px; 
        border-radius: 4px; 
        position: absolute;
        top: 110%; 
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap; 
        opacity: 0; 
        transition: opacity 0.2s ease-in-out; 
    }

    .end-interview-button[title]:hover::after {
        opacity: 1;
        visibility: visible;
    }
</style>