<script lang="ts">
    import { interviewQuestion } from "$lib/stores/interviewQuestion";
    import { currentFollowupStore } from "$lib/stores/answerStore";
    import { recordingState } from "$lib/stores/recordingState";
	import { toggleRecording } from "$lib/recorder/toggleRecording";

    export let loading: boolean;

</script>

<button 
    disabled={loading || $recordingState === 'transcribing' || !($interviewQuestion.question_text || $currentFollowupStore)} 
    on:click={toggleRecording}
    title={$recordingState === 'idle' ? "start recording" : "finish recording"}
    class={`record-button ${$recordingState === 'recording'? 'flash': ''}`}>
        {$recordingState === 'idle' ? " ▶️" : "⏹️ "}
</button>

<style lang="scss">
    button {
        margin: 10px auto;
    }
        /* Style the circular button */
    .record-button {
        width: 50px; 
        height: 50px;
        border: none;
        position: relative;
        background-color: #007bff; 
        color: #fff; 
        border-radius: 50%; 
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px; 
        transition: background-color 0.3s ease; 
    }

    /* Style the button on hover */
    .record-button:hover {
        background-color: #0056b3; /* Change the background color on hover */
    }

    .flash {
        animation: flash 1s infinite;
    }
    @keyframes flash {
        0% {
            background-color: red; /* Change to the first background color */
        }
        50% {
            background-color: blue; /* Change to the second background color */
        }
        100% {
            background-color: red; /* Change back to the first background color */
        }
    }

    /* Style the tooltip */
    .record-button[title]:hover::after {
        content: attr(title);
        background-color: #333; 
        color: #fff; 
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