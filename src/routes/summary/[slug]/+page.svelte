<script>
	import SummaryCard from "$lib/components/summaryCard.svelte";
	import { interviewAnswerStore } from "$lib/stores/answerStore";
    import { interviewSummaryStore } from "$lib/stores/summaryStore";

    export let data;

    if(data.summary)
        interviewSummaryStore.set(data.summary);

    if (data.answer)
        interviewAnswerStore.set(data.answer)

</script>

<div>
    <h1><i>{$interviewAnswerStore.question_text}</i></h1>
    <h5>{new Date($interviewSummaryStore.created_at).toLocaleDateString()} {new Date($interviewSummaryStore.created_at).toLocaleTimeString()}</h5>
    <SummaryCard/>
</div>

<style lang="scss">
    div {
        margin: 60px 40px;
    }
</style>