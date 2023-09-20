<script lang="ts">
	import { goto } from '$app/navigation';

    import { interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText } from '$lib/stores/recordingState';
    import {type Followup, interviewAnswerStore, followupsStore, currentFollowupStore } from '$lib/stores/answerStore';
    import { interviewSummaryStore } from '$lib/stores/summaryStore';
	import { aiChatStore, userChatStore } from '$lib/stores/chatStore';

	import { answerFollowup, answerQuestion, buildSummary, getQuestion, getSummary } from '$lib/serviceApi';

	import AIChatCard from '$lib/components/aiChatCard.svelte';
	import RecordAnswerButton from '$lib/components/recordAnswerButton.svelte';

	import UserChatCard from '$lib/components/userChatCard.svelte';
	import { onMount } from 'svelte';

    // Initial Values
    let jobInfo = { company: "", job: "" };
    let loading = false;
    let endInterview = false;
    
    $: jobInfo
    $: endInterview
    $: loading

    onMount(() =>{
        interviewQuestion.set({uuid: "", question_text: ""})
        aiChatStore.set(["Lucy: Hi there 👋 I'm Lucy and I'll be conducting your mock interview today! Please tell me what role and company you'd like to practice for."]);
        userChatStore.set([])
        outputText.set("")
    })
    

    // Test Stuff
    const testScript = "One of the most significant changes that we've had to adapt to at OneLogin was when we were being acquired by a company called OneIdentity. This company that was acquiring us couldn't have been any more different than OneLogin's culture, the way they worked, the things that they wanted to work on, and their ideals. I was a manager at the time, and when the acquisition was announced, we all thought it was going to be a really great day, like people were ready to celebrate, until we found out who it was. It turns out there's a couple industry veterans that did not like that company at all. Just for starters, just for a few examples, we use Slack, they use Teams, we use G Suite, they use Microsoft Office, we were Agile, they were Waterfall, it couldn't be any more different. When we were announced this acquisition was happening, the terms of the acquisition were not very favorable to the developers, a lot of them started to just leave on the spot that day. My team was in this precarious spot where we had a couple of long-term developers who were crucial to the success of the product, and they were considering leaving. What I did to try to corral these developers into sticking around for a little while, at least hearing out the acquirer, was I gave them a very clear vision and mission as to what it is that we do for this company and how we provide value. Part of the reason that they acquired us was because we had an approachable developer experience. I was running a developer experience at the time, and our job was to make it easy to integrate our product with a bunch of other products so that we could grow our addressable market and become stickier in the space. I made it very clear to my team that we had a very crisply defined mission and goals, and that nobody was going to come in and change the way that we work, because I was going to prevent that as much as I could. Ultimately, what ended up happening is our team was actually the one team that stayed pretty well put together. Other teams dissolved, disintegrated, and everybody left. My team pretty much stayed put and worked on the things that they had to work on. We found a lot of interesting work, such as we finally got AirCover to decompose the existing monolith application. We got some support to go all in on command line tooling and the Microsoft stack, which was one of the advantages of the Acquirer being a Microsoft shop. We were able to convince people to go work on C Sharp things, which was really interesting to some of my devs. They stayed put for a while, but ultimately what ended up happening, because the terms of the acquisition were so unfavorable and what the Acquirer was intending to do was to lay off a ton of the developers, people just started leaving. I eventually was one of them. For the period of time during that change, I did my best and was very successful at making sure that our team culture stayed the same and that the work that we did was still the same and still interesting to the developers, which led to a higher retention than the other teams."
    const testQid = "252d1b74-46e3-4637-92f5-742ca8497e2f" // change question
    const testJob = "Engineering Manager"
    const testFollowups: string[] = [
        "One of the specific challenges I faced during the acquisition was the integration of different company cultures. It required careful planning and communication to ensure a smooth transition.",
        "To communicate the clear vision and mission to my team, I organized regular team meetings and town halls where I shared the company's strategic goals. I also created visual presentations and used storytelling to make the vision more relatable.",
        "I prevented changes to the way my team worked by conducting detailed impact assessments before implementing any changes. This helped identify potential issues and allowed us to adjust our approach proactively.",
        "During the period of change, I organized team-building activities, both virtual and in-person, to foster camaraderie. I also emphasized our core values and ensured they were integrated into our daily work.",
        "My decision to leave the company was primarily influenced by the desire for a new challenge and growth opportunities. I felt that it was the right time to explore other career options.",
    ];
    const testSummaryId = "f235eb5d-df40-4e75-b178-4d1514b3ace9"
    const testCompany = "google"

    let isTest = false;
    const testLLM = async () => {
        isTest = true;
        loading = true
        $outputText = testScript
        jobInfo.company = testCompany
        jobInfo.job = testJob
    };

    const testFu = async () => {
        isTest = true;
        loading = true
        $outputText = testFollowups[Math.floor(Math.random() * testFollowups.length)];
    };

    const testSummary = async () => {
        endInterview = true
        loading = true
        const resp = await getSummary(testSummaryId)
        if (resp?.summary_text){
            let parts = JSON.parse(resp?.summary_text);
            interviewSummaryStore.set({...resp, ...parts})
        }
        loading = false
    }

    const handleJobInfo = async (e: Event) => {
        e.preventDefault();
        if (jobInfo.company && jobInfo.job) {
            aiChatStore.set([...$aiChatStore, `Lucy: I see you're interviewing as a ${jobInfo.job} at ${jobInfo.company}. Here is your first question 🙂!`])
            const result = await getQuestion();
            if(result){
                const {question_text} = result
                aiChatStore.set([...$aiChatStore, `Lucy: ${question_text}`]);
                interviewQuestion.set(result);
            }
        } else {
            alert("Please tell me what job and company you're preparing for")
        }
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
                        question_id: isTest? testQid : $interviewQuestion.uuid,
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
        <UserChatCard endInterview={endInterview} />
        {#if !endInterview && (jobInfo.company !== '' || jobInfo.job !== '')}
            <div><RecordAnswerButton loading={loading} testFu={testFu} testLLM={testLLM}/></div>
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