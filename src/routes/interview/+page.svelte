<script lang="ts">
	import { goto } from '$app/navigation';

    import { type InterviewQuestion, interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText } from '$lib/stores/recordingState';
    import {type Followup, interviewAnswerStore, followupsStore, currentFollowupStore } from '$lib/stores/answerStore';
	import { aiChatStore, userChatStore } from '$lib/stores/chatStore';

	import { answerFollowup, answerQuestion, buildSummary, getQuestions } from '$lib/serviceApi';

	import AIChatCard from '$lib/components/aiChatCard.svelte';
	import RecordAnswerButton from '$lib/components/recordAnswerButton.svelte';

	import UserChatCard from '$lib/components/userChatCard.svelte';
	import { onMount } from 'svelte';
	import QuestionList from '$lib/components/questionList.svelte';

    // Initial Values
    let jobInfo = { company: "", job: "" };
    let questions: Array<InterviewQuestion>;
    let selectedQuestion = {title: "A random question", data: {uuid: "", question_text: "A random question"}}
    let loading = false;
    let endInterview = false;
    
    $: jobInfo
    $: endInterview
    $: loading
    $: selectedQuestion

    onMount(() =>{
        interviewQuestion.set({uuid: "", question_text: ""})
        aiChatStore.set(["Lucy: Hi there 👋 I'm Lucy and I'll be conducting your mock interview today! Please tell me what role and company you'd like to practice for."]);
        userChatStore.set([])
        outputText.set("")
    })

    const handleJobInfo = (e: Event) => {
        e.preventDefault();
        if (jobInfo.company && jobInfo.job) {
            if (selectedQuestion.data.uuid === '') {
                let actualQuestions = questions.filter(q => q.uuid !== '')
                $interviewQuestion = actualQuestions[Math.floor(Math.random() * actualQuestions.length)];
            } else {
                $interviewQuestion = selectedQuestion.data
            }
            aiChatStore.set([...$aiChatStore, `Lucy: I see you're interviewing as a ${jobInfo.job} at ${jobInfo.company}. Here is your first question 🙂!`])
            aiChatStore.set([...$aiChatStore, $interviewQuestion.question_text])
        } else {
            alert("Please tell me what job and company you're preparing for")
        }
    };

    onMount( async () => {
        const result = await getQuestions();
        if (result) {
            questions = [selectedQuestion.data].concat(result)
        }
    });

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
                        question_id: $interviewQuestion.uuid,
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
    })

</script>

<div>
    <div class="aiChat">
        <AIChatCard loading={loading} endInterview={endInterview} jobInfo={jobInfo} handleJobInfo={handleJobInfo}/>
    </div>
    <div class="userChat">
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
</div>

<style lang="scss">
    div {
        padding: 40px 20px;
        display: flex;
        .aiChat {
            display: flex;
            flex-direction: column;
            justify-items: center;
            width: 50%;
            max-height: 100vh;
        }
        .userChat {
            display: flex;
            flex-direction: column;
            justify-items: center;
            width: 50%;
            max-height: 100vh;
            div {
                justify-content: flex-end;
            }
        }
    }
</style>