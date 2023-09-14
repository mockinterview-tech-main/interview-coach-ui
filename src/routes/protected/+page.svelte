<script lang="ts">
    import { toggleRecording } from '$lib/recorder/toggleRecording';
	import { interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText, recordingState } from '$lib/stores/recordingState';
    import {type Followup, interviewAnswerStore, followupsStore, currentFollowupStore } from '$lib/stores/answerStore';
	import { answerFollowup, answerQuestion, getQuestion, getSummary } from '$lib/serviceApi';

    // Initial Values
    let jobInfo = { company: "", job: "" };
    let loading = false;
    let isDone = false;
    let conversation = ["Lucy: Hi there 👋 I'm Lucy and I'll be conducting your mock interview today! Please tell me what role and company you'd like to practice for."];
    let feedback = ""

    $: jobInfo
    $: conversation
    $: isDone
    $: feedback

    // Test Stuff
    const testScript = "One of the most significant changes that we've had to adapt to at OneLogin was when we were being acquired by a company called OneIdentity. This company that was acquiring us couldn't have been any more different than OneLogin's culture, the way they worked, the things that they wanted to work on, and their ideals. I was a manager at the time, and when the acquisition was announced, we all thought it was going to be a really great day, like people were ready to celebrate, until we found out who it was. It turns out there's a couple industry veterans that did not like that company at all. Just for starters, just for a few examples, we use Slack, they use Teams, we use G Suite, they use Microsoft Office, we were Agile, they were Waterfall, it couldn't be any more different. When we were announced this acquisition was happening, the terms of the acquisition were not very favorable to the developers, a lot of them started to just leave on the spot that day. My team was in this precarious spot where we had a couple of long-term developers who were crucial to the success of the product, and they were considering leaving. What I did to try to corral these developers into sticking around for a little while, at least hearing out the acquirer, was I gave them a very clear vision and mission as to what it is that we do for this company and how we provide value. Part of the reason that they acquired us was because we had an approachable developer experience. I was running a developer experience at the time, and our job was to make it easy to integrate our product with a bunch of other products so that we could grow our addressable market and become stickier in the space. I made it very clear to my team that we had a very crisply defined mission and goals, and that nobody was going to come in and change the way that we work, because I was going to prevent that as much as I could. Ultimately, what ended up happening is our team was actually the one team that stayed pretty well put together. Other teams dissolved, disintegrated, and everybody left. My team pretty much stayed put and worked on the things that they had to work on. We found a lot of interesting work, such as we finally got AirCover to decompose the existing monolith application. We got some support to go all in on command line tooling and the Microsoft stack, which was one of the advantages of the Acquirer being a Microsoft shop. We were able to convince people to go work on C Sharp things, which was really interesting to some of my devs. They stayed put for a while, but ultimately what ended up happening, because the terms of the acquisition were so unfavorable and what the Acquirer was intending to do was to lay off a ton of the developers, people just started leaving. I eventually was one of them. For the period of time during that change, I did my best and was very successful at making sure that our team culture stayed the same and that the work that we did was still the same and still interesting to the developers, which led to a higher retention than the other teams."
    const testQid = "252d1b74-46e3-4637-92f5-742ca8497e2f"
    const testJob = "Engineering Manager"
    const testFollowups: string[] = [
        "One of the specific challenges I faced during the acquisition was the integration of different company cultures. It required careful planning and communication to ensure a smooth transition.",
        "To communicate the clear vision and mission to my team, I organized regular team meetings and town halls where I shared the company's strategic goals. I also created visual presentations and used storytelling to make the vision more relatable.",
        "I prevented changes to the way my team worked by conducting detailed impact assessments before implementing any changes. This helped identify potential issues and allowed us to adjust our approach proactively.",
        "During the period of change, I organized team-building activities, both virtual and in-person, to foster camaraderie. I also emphasized our core values and ensured they were integrated into our daily work.",
        "My decision to leave the company was primarily influenced by the desire for a new challenge and growth opportunities. I felt that it was the right time to explore other career options.",
    ];
    const testSummaryId = "15a35649-47b5-4299-b510-d7b095af8b15"
    const testCompany = "google"

    let isTest = false;
    const testLLM = async () => {
        isTest = true;
        $outputText = testScript
        jobInfo.company = testCompany
        jobInfo.job = testJob
    };

    const testFu = async () => {
        isTest = true;
        $outputText = testFollowups[Math.floor(Math.random() * testFollowups.length)];
        jobInfo.company = testCompany
        jobInfo.job = testJob
    };

    const testSummary = async () => {
        isDone = true
        loading = true
        const response = await getSummary(testSummaryId)
        feedback = response.feedback;
        loading = false
    }

    const handleJobInfo = async (e: Event) => {
        e.preventDefault();
        if (jobInfo.company && jobInfo.job) {
            conversation = [...conversation, `Lucy: I see you're interviewing as a ${jobInfo.job} at ${jobInfo.company}. Here is your first question 🙂!`]
            const result = await getQuestion();
            if(result){
                const {question_text} = result
                conversation = [...conversation, `Lucy: ${question_text}`];
                interviewQuestion.set(result);
            }
        } else {
            alert("Please tell me what job and company you're preparing for")
        }
    };

    const startRecording = () => {
        toggleRecording()
        if ($recordingState != "idle"){
            loading = true
        }
    }
   
    const followupGenerator = function* (followups: Array<Followup>) {
        for (const item of followups) {
            yield item;
        }
    };
    let nextFollowup: Generator<Followup, void, unknown>;
    followupsStore.subscribe((followupList) => nextFollowup = followupGenerator(followupList))

    outputText.subscribe(async (answerText) => {
        if(answerText != ""){
            conversation = [...conversation, `You: ${answerText}`]
            try {
                if(!$interviewAnswerStore){
                    const result = await answerQuestion({
                        question_id: isTest? testQid : $interviewQuestion.uuid,
                        company: jobInfo.company,
                        job: jobInfo.job,
                        answer_text: answerText,
                    });
                    if(result){
                        const {answer, followups} = result
                        interviewAnswerStore.set(answer);
                        followupsStore.set(followups);
                    }
                } else {
                    answerFollowup(answerText, $currentFollowupStore.id)
                }
                const fu = nextFollowup.next();
                if (!fu.done) {
                    conversation = [...conversation, `Lucy: ${fu.value.followup_question_text}`]
                    currentFollowupStore.set(fu.value);
                } else {
                    isDone = true;
                    const resp = await getSummary($interviewAnswerStore.id);
                    try {
                        let feedbackParts = JSON.parse(resp.feedback);

                    } catch (e) {
                        console.log("model returned invalid json");
                        feedback = resp.feedback;
                    }
                    
                }
                loading = false;
            } catch (error) {
                loading = false;
                console.error('An error occurred:', error);
            }
        }
    })


</script>

<h1>Mock Interview Experience</h1>
<button on:click={testSummary}>Test Summary</button>
{#if $interviewQuestion.question_text === "" && !feedback}
    <p>{conversation[0]}</p>
    <form on:submit={handleJobInfo}>
        <label for="job">Job Title</label>
        <input id="job" type="text" bind:value={jobInfo.job}/><br/>
        <label for="company">Company</label>
        <input id="company" type="text" bind:value={jobInfo.company}/><br/><br/>
        <button type="submit">Get Started</button>
    </form>
{:else}
    {#each conversation as part}
        <p>{part}</p>
    {/each}
    {#if loading}
        <p>Hang on, I'm taking some notes 📝...</p>
    {/if}
{/if}
{#if !loading && $interviewQuestion.question_text && !feedback}
    {#if $interviewQuestion.question_text || $currentFollowupStore}<button on:click={startRecording}>{$recordingState === 'idle' ? " ▶️ Start Answering" : "⏹️ I'm Done!"}</button>{/if}
    {#if !$currentFollowupStore && $interviewQuestion.question_text}<button on:click={testLLM}>Answer Question</button>{/if}
    {#if $currentFollowupStore}<button on:click={testFu}>Answer Followup</button>{/if}
{/if}
{#if isDone}
    {#if loading}<p>Alright, I'll have your results in bit... ✅</p>{/if}
    <p>{feedback}</p>
{/if}

