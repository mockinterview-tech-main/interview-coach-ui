<script lang="ts">
	import Popdown from "$lib/components/popdown.svelte";
    import { interviewSummaryStore } from "$lib/stores/summaryStore";

    export let data;
    let conversationText = "";

    if(data.summary)
        interviewSummaryStore.set(data.summary);

    if(data.conversation)
        conversationText = data.conversation

    const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

</script>

<div>
    <h1><i>{$interviewSummaryStore.title || "Your Past Interview"} {new Date($interviewSummaryStore.created_at).toLocaleDateString()} {new Date($interviewSummaryStore.created_at).toLocaleTimeString()}</i></h1>
    <Popdown isActive={true}>
        <h2 class="popdown-header" slot="popdown-header"><i>S.T.A.R. Report Card</i></h2>
        <div slot="popdown-content">
            <h3>Overall: {$interviewSummaryStore.overall.grade}</h3>
            <p>{$interviewSummaryStore.overall.summary}</p>

            <h3>Situation: {$interviewSummaryStore.situation.grade}</h3>
            <p>{$interviewSummaryStore.situation.summary}</p>

            <h3>Task: {$interviewSummaryStore.task.grade}</h3>
            <p>{$interviewSummaryStore.task.summary}</p>

            <h3>Action: {$interviewSummaryStore.action.grade}</h3>
            <p>{$interviewSummaryStore.action.summary}</p>

            <h3>Result: {$interviewSummaryStore.result.grade}</h3>
            <p>{$interviewSummaryStore.result.summary}</p>
        </div>
    </Popdown>
    {#if $interviewSummaryStore.focus}
    <Popdown isActive={true}>
        <h2 class="popdown-header" slot="popdown-header"><i>Signals</i></h2>
        <div slot="popdown-content">
            <h3>Focus Area ({capitalize($interviewSummaryStore.focus.area)}): {$interviewSummaryStore.focus.grade}</h3>
            <p>{$interviewSummaryStore.focus.summary}</p>
        </div>
    </Popdown>
    {/if}
    <Popdown>
        <h2 class="popdown-header" slot="popdown-header"><i>Questions Asked</i></h2>
        <div slot="popdown-content">
            {#each $interviewSummaryStore.questions as question}
                <p>{question}</p>
            {/each}
        </div>
    </Popdown>
    <Popdown>
        <h2 class="popdown-header" slot="popdown-header"><i>Interview Transcript</i></h2>
        <div class="popdown-content" slot="popdown-content">
            {#each conversationText.split("\n") as part}
                <p>{part}</p>
            {/each}
        </div>
    </Popdown>
</div>

<style lang="scss">
    div {
        padding: 20px;
        h1 {
            margin-top: 80px;
            margin-left: 20px;
        }
        h3 {
            display: block;
            text-align: left;
            font-weight: 700;
        }
        .popdown-content {
            white-space: pre-wrap;
            text-align: left;
            overflow: visible;
        }
        .popdown-header {
            margin: 20px;
        }
    }
</style>