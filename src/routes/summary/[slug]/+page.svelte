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
    <h1>{$interviewSummaryStore.title || "Your Past Interview"}</h1>
    <i>{new Date($interviewSummaryStore.created_at).toLocaleDateString()}</i>
    <Popdown isActive={true}>
        <h2 class="popdown-header" slot="popdown-header">Storytelling Fundamentals: {$interviewSummaryStore.overall.grade}</h2>
        <div slot="popdown-content">
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
        <h2 class="popdown-header" slot="popdown-header">Focus Area {capitalize($interviewSummaryStore.focus.area)}: {$interviewSummaryStore.focus.grade}</h2>
        <div slot="popdown-content">
            <p>{$interviewSummaryStore.focus.summary}</p>
        </div>
    </Popdown>
    {/if}
    <Popdown>
        <h2 class="popdown-header" slot="popdown-header">Questions Asked</h2>
        <div slot="popdown-content">
            {#each $interviewSummaryStore.questions as question}
                <p>{question}</p>
            {/each}
        </div>
    </Popdown>
    <Popdown>
        <h2 class="popdown-header" slot="popdown-header">Interview Transcript</h2>
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
            margin-left: 40px;
        }
        i {
            margin-left: 40px;
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