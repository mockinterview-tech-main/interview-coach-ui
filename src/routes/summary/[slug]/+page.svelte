<script lang="ts">
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
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
    <i>{new Date($interviewSummaryStore.created_at).toLocaleDateString()}</i><br/><br/>
    <Accordion multiple>
        <Panel open>
            <Header><h2>Storytelling Fundamentals: {$interviewSummaryStore.overall.grade}</h2></Header>
            <Content>
                <p>{$interviewSummaryStore.overall.summary}</p>

                <h3>Situation: {$interviewSummaryStore.situation.grade}</h3>
                <p>{$interviewSummaryStore.situation.summary}</p>

                <h3>Task: {$interviewSummaryStore.task.grade}</h3>
                <p>{$interviewSummaryStore.task.summary}</p>

                <h3>Action: {$interviewSummaryStore.action.grade}</h3>
                <p>{$interviewSummaryStore.action.summary}</p>

                <h3>Result: {$interviewSummaryStore.result.grade}</h3>
                <p>{$interviewSummaryStore.result.summary}</p>
            </Content>
        </Panel>
        {#if $interviewSummaryStore.focus}
            <Panel open> 
                <Header><h2>Focus Area {capitalize($interviewSummaryStore.focus.area)}: {$interviewSummaryStore.focus.grade}</h2></Header>
                <Content>
                    <p>{$interviewSummaryStore.focus.summary}</p>
                </Content>
            </Panel>
        {/if}
        <Panel> 
            <Header><h2>Questions Asked</h2></Header>
            <Content>
                {#each $interviewSummaryStore.questions as question}
                    <p>{question}</p>
                {/each}
            </Content>
        </Panel>
        <Panel> 
            <Header><h2>Interview Transcript</h2></Header>
            <Content>
                {#each conversationText.split("\n") as part}
                    <p>{part}</p>
                {/each}
            </Content>
        </Panel>
    </Accordion>
</div>

<style lang="scss">
    
    div {
        padding: 50px;
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
    }
</style>