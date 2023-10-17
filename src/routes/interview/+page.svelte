<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

    import UserHeadsetDuo from "$lib/assets/icons/user-headset-duo.svg"

    import { type InterviewQuestion, interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText } from '$lib/stores/recordingState';
    import {type Followup, interviewAnswerStore, followupsStore, currentFollowupStore } from '$lib/stores/answerStore';
	import { conversationStore } from '$lib/stores/chatStore';

	import { answerFollowup, answerQuestion, buildSummary, getAIQuestion, getQuestions } from '$lib/serviceApi';

	import RecordAnswerButton from '$lib/components/recordAnswerButton.svelte';
	import QuestionList from '$lib/components/questionList.svelte';
	import Modal from '$lib/components/modal.svelte';
	import Transcript from '$lib/components/transcript.svelte';

    export let data;
    const {credits, username} = data;

    // Initial Values
    let jobInfo = { company: "", job: "" };
    let questions: Array<InterviewQuestion>;
    let selectedQuestion = {title: "Ask Me Anything", data: {uuid: "", question_text: "Ask Me Anything"}}
    let loading = false;
    let endInterview = false;
    let confirmDialogOpen = false;
    
    $: jobInfo
    $: endInterview
    $: loading
    $: selectedQuestion

    const reset = () => {
        $interviewQuestion = {uuid: "", question_text: ""};
        $interviewAnswerStore = null;
        $currentFollowupStore = null;
        $outputText = "";
        $conversationStore = [];
    }

    onMount( async () =>{
        reset();
        $conversationStore = [`Lucy: Hi ${username} I'm Lucy and I'll be conducting your mock interview today! Please tell me what role and company you'd like to practice for.`];
        const result = await getQuestions();
        if (result) {
            questions = [selectedQuestion.data].concat(result);
        }
    });

    onDestroy(reset);

    const prepareInterview = async (e: Event) => {
        e.preventDefault();
        if (jobInfo.company && jobInfo.job) {
            confirmDialogOpen = true;
        } else {
            alert("Please tell me what role you're preparing for at which company.")
        }
    }

    const startInterview = async () => {
        confirmDialogOpen = false;
        if (selectedQuestion.data.uuid === '') {
            loading = true;
            let aiQuestion = await getAIQuestion({
                company: jobInfo.company,
                job: jobInfo.job,
            })
            loading = false;
            if (aiQuestion){
                $interviewQuestion = {...aiQuestion, uuid: 'ephemeral'}
            } else {
                let actualQuestions = questions.filter(q => q.uuid !== '')
                $interviewQuestion = actualQuestions[Math.floor(Math.random() * actualQuestions.length)];
            }                
        } else {
            $interviewQuestion = selectedQuestion.data
        }
        $conversationStore = [...$conversationStore, `${username || "You"}: I'm interviewing as a ${jobInfo.job} at ${jobInfo.company}.`];
        $conversationStore = [
            ...$conversationStore, `Lucy: Great! I'll evaluate this session as if I was someone hiring a ${jobInfo.job} at ${jobInfo.company}.<br/>
            Before we get started, here's how this will work:<br/>
            Click the microphone button to un-mute and give your answer. Please mute yourself when you're done speaking so I know you're ready to move on.`
        ];
        $conversationStore = [...$conversationStore, `Lucy: Here is your first question: ${$interviewQuestion.question_text}`];

        fetch('/interview', {
            method: 'POST',
            credentials: 'include'
        })
    };

    const followupGenerator = function* (followups: Array<Followup>) {
        for (const item of followups) {
            yield item;
        }
    };
    let nextFollowup: Generator<Followup, void, unknown>;
    followupsStore.subscribe((followupList) => nextFollowup = followupGenerator(followupList))

    outputText.subscribe(async (answerText) => {
        if (answerText !== ''){
            try {
                if($outputText !== ''){
                    $conversationStore = [...$conversationStore, `${username || "You"}: ${answerText}`];
                    loading = true;
                    if(!$interviewAnswerStore){
                        const result = await answerQuestion({
                            question_text: $interviewQuestion.question_text,
                            company: jobInfo.company,
                            job: jobInfo.job,
                            answer_text: answerText,
                        });
                        if(result){
                            if (result.errors) {
                                    $conversationStore = [...$conversationStore, `Lucy: ${result.errors}`];
                            } else {
                                const {answer, followups} = result
                                $interviewAnswerStore = answer;
                                $followupsStore = followups;
                                const fu = nextFollowup.next();
                                if (!fu.done) {
                                    $conversationStore = [...$conversationStore, `Lucy: ${fu.value.followup_question_text}`];
                                    $currentFollowupStore = fu.value;
                                }
                            }
                        }
                    } else {
                        if ($currentFollowupStore){
                            answerFollowup(answerText, $currentFollowupStore.id)
                            const fu = nextFollowup.next();
                            if (!fu.done) {
                                $conversationStore = [...$conversationStore, `Lucy: ${fu.value.followup_question_text}`];
                                $currentFollowupStore = fu.value;
                            } else {
                                endInterview = true;
                                if ($interviewAnswerStore) {
                                    const resp = await buildSummary($interviewAnswerStore.id);
                                    $interviewAnswerStore = null;
                                    if (resp?.summary_text) {
                                        goto(`/summary/${resp.id}`)
                                    } else {
                                        console.log(resp)
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
            } finally {
                loading = false;
            }
        }
    });

    const buyCredits = (e: Event) => {
        e.preventDefault();
        goto('/credits')
    }

</script>

<div>
    <Modal bind:isOpen={confirmDialogOpen}>
        <h2 style="text-align: center;">Are you ready?</h2>
        <p>Once the session starts you will have spent 1 token.</p>
        <p>Leaving the page or refreshing will lose your session</p>
        <button on:click={startInterview} class="modal-button">Continue</button>
        <button on:click={() => confirmDialogOpen = !confirmDialogOpen} class="modal-button tirtiary-button">Not Now</button>
    </Modal>
    <div class="call">
        <h3>Lucy (Interviewer)</h3>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={UserHeadsetDuo} alt="interviewer profile picture"/>
        <br/>
        {#if $interviewQuestion.uuid}
            <div><RecordAnswerButton loading={loading}/></div>
        {/if}
    </div>
    <div class="transcript">
            {#if credits === 0}
                <p><b>Uh oh, looks like you're out of credits. Please buy more before continuing.</b></p>
                <button class="tirtiary-button" on:click={buyCredits}>Buy Credits</button>
            {:else}
                <Transcript loading={loading} endInterview={endInterview}/>
                {#if !$interviewQuestion.uuid}
                    <div class="setup-form">
                        <form on:submit={prepareInterview}>
                            <label for="job">Job Title</label>
                            <input disabled={credits === 0} id="job" type="text" bind:value={jobInfo.job} placeholder="e.g. Technical Program Manager"/><br/>
                            <label for="company">Company</label>
                            <input disabled={credits === 0} id="company" type="text" bind:value={jobInfo.company} placeholder="e.g. Google"/><br/><br/>
                            <button class="tirtiary-button" type="submit" disabled={!jobInfo.job || !jobInfo.company || loading}>Get Started</button>
                        </form>
                        {#if questions && !$interviewQuestion.question_text}
                            <div>
                            <QuestionList
                                bind:selectedItem={selectedQuestion}
                                options={questions.map( question => ({title: question.question_text, data: question}))} 
                            />
                            </div>
                        {/if}
                    </div>
                {/if}
            {/if}
    </div>
</div>

<style lang="scss">
    @import "../../lib/styles/colors.scss";

    div {
        display: flex;
        flex-direction: column;
        .call {
            width: 100%;
            background-color: #6e6e6e;
            padding: 20px 0px;
            position: sticky;
            top: 0;
            h3 {
                margin: auto;
                padding-top: 10px;
                margin-top: 40px;
                text-align: center;
                color: $dark-purple;
                background-color: white;
                width: 500px;
                border-top: 1px solid black;
                border-left: 1px solid black;
                border-right: 1px solid black;
            }
            img {
                width: 100px;
                background-color: white;
                border-left: 1px solid black;
                border-right: 1px solid black;
                border-bottom: 1px solid black;
                padding: 75px 200px;
                margin: auto;
            }
            @media only screen and (max-width: 1000px) {
                    img {
                        height: 50px;
                        padding: 50px 100px; 
                    }
                    h3 {
                        font-size: 14px;
                        width: 300px;
                    }
            }
        }
        .transcript {
            padding: 0px 40px;
            margin-bottom: 40px;
            overflow: auto;
            max-height: 300px;
            .setup-form {
                display: flex;
                flex-direction: row;

                form {
                    max-width: 25%;
                    margin: auto;
                    margin-top: 30px;
                    height: 100vh;
                    input { width: 100%; }
                }
                div {
                    margin: 0px auto;
                    max-width: 75%;
                }

                @media only screen and (max-width: 1600px) {
                    form { max-width: 40%; }
                    div {  max-width: 60%; }
                }
                @media only screen and (max-width: 1000px) {
                    * { font-size: 14px; }
                    form { max-width: 50%; }
                    div {  max-width: 50%; }
                }
            }
        }
        .modal-button { display: inline; }
        button {
            max-width: 135px;
            margin: auto;
        }
    }
</style>