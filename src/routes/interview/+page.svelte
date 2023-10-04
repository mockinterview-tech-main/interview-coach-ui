<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

    import { type InterviewQuestion, interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText } from '$lib/stores/recordingState';
    import {type Followup, interviewAnswerStore, followupsStore, currentFollowupStore } from '$lib/stores/answerStore';
	import { aiChatStore, userChatStore } from '$lib/stores/chatStore';

	import { answerFollowup, answerQuestion, buildSummary, getAIQuestion, getQuestions } from '$lib/serviceApi';

	import AIChatCard from '$lib/components/aiChatCard.svelte';
	import RecordAnswerButton from '$lib/components/recordAnswerButton.svelte';
	import UserChatCard from '$lib/components/userChatCard.svelte';
	import QuestionList from '$lib/components/questionList.svelte';
	import Modal from '$lib/components/modal.svelte';

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

    onMount( async () =>{
        interviewQuestion.set({uuid: "", question_text: ""})
        aiChatStore.set([`Lucy: Hi ${username} I'm Lucy and I'll be conducting your mock interview today! Please tell me what role and company you'd like to practice for.`]);
        userChatStore.set([])
        outputText.set("")
        const result = await getQuestions();
        if (result) {
            questions = [selectedQuestion.data].concat(result)
        }
    })

    const prepareInterview = async (e: Event) => {
        e.preventDefault();
        if (jobInfo.company && jobInfo.job) {
            confirmDialogOpen = true;
            await startInterview();
            confirmDialogOpen = false;
        } else {
            alert("Please tell me what role you're preparing for at which company.")
        }
    }

    const startInterview = async () => {
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
        aiChatStore.set([...$aiChatStore, `Lucy: I see you're interviewing as a ${jobInfo.job} at ${jobInfo.company}. Here is your first question 🙂!`])
        aiChatStore.set([...$aiChatStore, $interviewQuestion.question_text])
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
        try {
            if($outputText !== ''){
                userChatStore.set([...$userChatStore, `You: ${answerText}`])
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
                                aiChatStore.set([...$aiChatStore, `Lucy: ${result.errors}`])
                        } else {
                            const {answer, followups} = result
                            interviewAnswerStore.set(answer);
                            followupsStore.set(followups);
                            const fu = nextFollowup.next();
                            if (!fu.done) {
                                aiChatStore.set([...$aiChatStore, `Lucy: ${fu.value.followup_question_text}`])
                                currentFollowupStore.set(fu.value);
                            }
                        }
                    }
                } else {
                    answerFollowup(answerText, $currentFollowupStore.id)
                    const fu = nextFollowup.next();
                    if (!fu.done) {
                        aiChatStore.set([...$aiChatStore, `Lucy: ${fu.value.followup_question_text}`])
                        currentFollowupStore.set(fu.value);
                    } else {
                        endInterview = true;
                        if ($interviewAnswerStore) {
                            const resp = await buildSummary($interviewAnswerStore.id);
                            if (resp?.summary_text) {
                                goto(`/summary/${resp.id}`)
                            } else {
                                console.log(resp)
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
    <div class="ai-chat {credits === 0 ? 'solo' : ''}">
        <h3>AI Chat</h3>
        {#if $interviewQuestion.question_text === ""}
            <p>{$aiChatStore[0]}</p>
            {#if credits === 0}
                <p><b>Uh oh, looks like you're out of credits. Please buy more before continuing.</b></p>
            {/if}
            <form on:submit={prepareInterview}>
                {#if credits !== 0}
                    <label for="job">Job Title</label>
                    <input disabled={credits === 0} id="job" type="text" bind:value={jobInfo.job} placeholder="e.g. Technical Program Manager"/><br/>
                    <label for="company">Company</label>
                    <input disabled={credits === 0} id="company" type="text" bind:value={jobInfo.company} placeholder="e.g. Google"/><br/><br/>
                    <button class="tirtiary-button" type="submit" disabled={!jobInfo.job || !jobInfo.company || loading}>Get Started</button>
                {/if}
                {#if credits === 0}
                    <div style="display: flex; justify-content: center;"><button class="tirtiary-button" on:click={buyCredits}>Buy Credits</button></div>
                {/if}
            </form>
        {:else}
            <AIChatCard loading={loading} endInterview={endInterview}/>
        {/if}
    </div>
    {#if credits !== 0}
        <div class="user-chat">
            {#if !$interviewQuestion.uuid}
                {#if questions && !$interviewQuestion.question_text}
                    <QuestionList
                        bind:selectedItem={selectedQuestion}
                        options={questions.map( question => ({title: question.question_text, data: question}))} 
                    />
                {/if}
            {:else}
                <UserChatCard endInterview={endInterview} />
                {#if !endInterview && (jobInfo.company !== '' || jobInfo.job !== '')}
                    <div><RecordAnswerButton loading={loading}/></div>
                {/if}
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    div {
        padding: 40px 20px;
        display: flex;
        .ai-chat {
            h3 {
                margin-top: 25px;
                margin-bottom: 35px;
            }
            form {
                max-width: 50%;
                margin: auto;
                margin-top: 30px;
                input {
                    width: 100%;
                }
            }
            display: flex;
            flex-direction: column;
            justify-items: center;
            width: 50%;
            max-height: 100vh;
        }
        .ai-chat.solo {
            width: 100%;
            text-align: center;
        }
        .user-chat {
            display: flex;
            flex-direction: column;
            justify-items: center;
            width: 50%;
            max-height: 100vh;
            div {
                justify-content: flex-end;
            }
        }
        .modal-button { display: inline; }
    }
</style>