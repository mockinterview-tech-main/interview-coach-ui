<script lang="ts">
    import { recordingState } from "$lib/stores/recordingState";
	import { toggleRecording } from "$lib/recorder/toggleRecording";

    import MicFilled from "$lib/assets/icons/mic-filled.svg"
    import MuteFilled from "$lib/assets/icons/mute-filled.svg"

    export let loading: boolean;

    let isDisabled = false;
    $: { isDisabled = loading || $recordingState === 'transcribing' }
    $: isDisabled
</script>

<button 
    disabled={isDisabled} 
    on:click={toggleRecording}
    title={$recordingState === 'idle' ? (isDisabled ? "please wait" : "turn on microphone") : "mute microphone"}
    class={`record-button ${$recordingState === 'recording'? 'flash': ''}`}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img width="30px" height="30px" src={$recordingState === 'idle' || isDisabled ? MicFilled : MuteFilled}/>
</button>

<style lang="scss">
    @import "../styles/colors.scss";

    button { 
        margin: 10px auto;
        img {
            min-width: 30px;
            min-height: 30px;
        }
    }
        
    .record-button {
        width: 80px; 
        height: 80px;
        border: none;
        position: relative;
        background-color: $dark-purple; 
        border-radius: 50%; 
        cursor: pointer;
        display: flex;
        justify-content: center;
        transition: background-color 0.3s ease; 
    }

    .record-button:disabled { background-color: red; }

    .record-button:disabled:hover {  background-color: red; }
    
    .record-button:hover { background-color: $light-purple; }
    .flash { animation: flash 1s infinite; }

    @keyframes flash {
        0% { background-color: $dark-purple; }
        50% { background-color: $light-purple; }
        100% { background-color: $dark-purple; }
    }

    /* Style the tooltip */
    .record-button[title]:hover::after {
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

    .record-button[title]:hover::after {
        opacity: 1;
        visibility: visible;
    }
</style>