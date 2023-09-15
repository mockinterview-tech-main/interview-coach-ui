<script lang="ts">
    import { interviewQuestion } from "$lib/stores/interviewQuestion";
    import { currentFollowupStore } from "$lib/stores/answerStore";
    import { startRecording } from "$lib/recorder/mediaRecorder";
    import { recordingState } from "$lib/stores/recordingState";

    export let testFu: () => Promise<void>;
    export let testLLM: () => Promise<void>;
</script>

{#if $interviewQuestion.question_text || $currentFollowupStore}<button on:click={startRecording}>{$recordingState === 'idle' ? " ▶️ Start Answering" : "⏹️ I'm Done!"}</button>{/if}
{#if !$currentFollowupStore && $interviewQuestion.question_text}<button on:click={testLLM}>Answer Question</button>{/if}
{#if $currentFollowupStore}<button on:click={testFu}>Answer Followup</button>{/if}