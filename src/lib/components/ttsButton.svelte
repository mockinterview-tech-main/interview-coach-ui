<script lang="ts">
    import Speaker from "$lib/assets/icons/speaker.svg";
    import MuteSpeaker from "$lib/assets/icons/mute-speaker.svg"
    export let ttsEnabled: boolean;
</script>

<button 
    on:click
    title={ttsEnabled ? "mute interviewer" : "hear interviewer"}
    class="tts-button">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img width="30px" height="30px" src={ttsEnabled ? Speaker : MuteSpeaker}/>
</button>

<style lang="scss">
    @import "../styles/colors.scss";

    button { 
        margin: auto;
        img {
            min-width: 30px;
            min-height: 30px;
        }
    }
        
    .tts-button {
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
    
    .tts-button:hover { background-color: $light-purple; }

    /* Style the tooltip */
    .tts-button[title]:hover::after {
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

    .tts-button[title]:hover::after {
        opacity: 1;
        visibility: visible;
    }
</style>