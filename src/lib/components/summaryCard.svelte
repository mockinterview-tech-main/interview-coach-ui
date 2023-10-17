<script lang="ts">
	import { interviewAnswerStore } from "$lib/stores/answerStore";
	import { interviewQuestion } from "$lib/stores/interviewQuestion";
	import { interviewSummaryStore } from "$lib/stores/summaryStore";

    $: interviewSummaryStore
    $: interviewAnswerStore
    $: interviewQuestion
</script>

<div>
    <div class="summaryContainer">
        <strong>Situation</strong>
        <p>{$interviewSummaryStore?.Situation}</p>

        <strong>Task</strong>
        <p>{$interviewSummaryStore?.Task}</p>

        <strong>Action</strong>
        <p>{$interviewSummaryStore?.Action}</p>

        <strong>Result</strong>
        <p>{$interviewSummaryStore?.Result}</p>

        <strong>Analysis</strong>
        <p>{$interviewSummaryStore.Summary}</p>
    </div>
    <div class="userInputContainer">
        <strong>Your Answer</strong>
        <p>{$interviewAnswerStore?.answer_text}</p>
    </div>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: space-between;
        .summaryContainer {
            margin: 10px;
            max-width: 50%;
            flex-direction: column;
            flex-grow: 2;
        }
        .userInputContainer {
            margin: 10px;
            max-width: 45%;
            flex-direction: column;
            flex-grow: 1;
        }
        strong {
            display: block;
        }
    }
    
</style>