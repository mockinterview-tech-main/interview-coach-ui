<script lang="ts">
    import Button from '@smui/button';

    import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

    import UserHeadsetDuo from "$lib/assets/icons/user-headset-duo.svg"

    import Lucy from "$lib/assets/profile-pics/lucy.png"
    import Dale from "$lib/assets/profile-pics/dale.png"
    import Kelly from "$lib/assets/profile-pics/kelly.png"
    import Judy from "$lib/assets/profile-pics/judy.png"
    import Patrick from "$lib/assets/profile-pics/patrick.png"

    import { outputText } from '$lib/stores/recordingState';
	import { conversationStore } from '$lib/stores/conversationStore';

	import RecordAnswerButton from '$lib/components/recordAnswerButton.svelte';
    import TTSButton from '$lib/components/ttsButton.svelte';
	import Transcript from '$lib/components/transcript.svelte';
	import { postConversation, postSummary, putConversation } from '$lib/serviceApi.js';
	import { userStore } from '$lib/stores/userStore.js';

    export let data;
    let { username } = data;

    const interviewers = [
        { name: "Lucy Interviewer", pfp: Lucy },
        { name: "Dale Interviewer", pfp: Dale },
        { name: "Kelly Interviewer", pfp: Kelly },
        { name: "Judy Interviewer", pfp: Judy },
        { name: "Patrick Interviewer", pfp: Patrick }
    ]

    const topics = [
        "Adaptability",
        "Collaboration",
        "Customer Focus",
        "Decision Making",
        "Influence",
        "Innovation",
        "Problem Solving"
    ];


    const interviewer = interviewers[Math.floor(Math.random() * interviewers.length)];

    // Initial Values
    let loading = false;
    let interviewConfirmed = false;
    let ttsEnabled = true
    let selectedTopic = "";
    let summaryId = "";
    
    $: loading
    $: interviewConfirmed
    $: ttsEnabled
    $: summaryId
    $: selectedTopic

    const reset = () => {
        $outputText = "";
        $conversationStore = {id: null, finished: false, parts: []};
    }

    onDestroy(reset);

    const buyCredits = () => goto('/credits');
    const toggleTTS = () => ttsEnabled = !ttsEnabled;

    const confirmInterview = async () => {
        reset();
        interviewConfirmed = true;
        let creditResponse = await fetch('/interview', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({action: "deduct"})
        }); // deducts a token and starts the interview
        let creditsBody = await creditResponse.json();

        const text = `Hi ${username} I'm ${interviewer.name.split(" ")[0]} and I'll be conducting your interview today! I see you chose ${selectedTopic} as your focus area. Please tell me what role and company you'd like to practice for.`;
        
        $userStore = {credits: creditsBody.credits, ...userStore};
        $conversationStore.parts = [{ participant: interviewer.name.split(" ")[0], text }];
        if(ttsEnabled){
            let text = $conversationStore.parts[$conversationStore.parts.length-1].text;
            const response = await fetch("/tts", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({text, interviewer: interviewer.name.split(" ")[0]})
            });
            const r = await response.blob();
            const audioUrl = URL.createObjectURL(r);
            const audioPlayer: HTMLAudioElement = document.getElementById("audioPlayer");
            if (audioPlayer){
                audioPlayer.src = audioUrl
                audioPlayer.play();
            }
        }
    }

    outputText.subscribe(async () => {
        try {
            if ($outputText !== '') {
                if ($outputText.toLocaleLowerCase() === 'long answer error') {
                    const newPart = {
                        participant: interviewer.name.split(" ")[0], 
                        text: "Great answer, but a key component of interviewing well is telling impactful stories succinctly. Please try shortening your story."
                    }
                    $conversationStore.parts = [...$conversationStore.parts, newPart];
                    return;
                }

                const newPart = {
                    participant: username || "Me",
                    text: $outputText
                }

                $conversationStore.parts = [...$conversationStore.parts, newPart];

                loading = true;

                const conversationResponse = $conversationStore.id ? 
                    await putConversation({id: $conversationStore.id, text: `${newPart.participant}: ${newPart.text}`}) : 
                    await postConversation({text: `${newPart.text} and I'd like to talk about ${selectedTopic}`});

                if (conversationResponse) {
                    $conversationStore = {
                        id: conversationResponse.id,
                        finished: conversationResponse.finished,
                        parts: [
                            ...$conversationStore.parts, 
                            {
                                participant: interviewer.name.split(" ")[0], 
                                text: conversationResponse.added_part.split(": ").filter((part: string) => part != "Interviewer" || part != interviewer.name.split(" ")[0]).join(". ")
                            }
                        ]
                    }
                    
                    if(ttsEnabled){
                        let text = $conversationStore.parts[$conversationStore.parts.length-1].text;
                        const response = await fetch("/tts", {
                            method: "POST",
                            credentials: "include",
                            body: JSON.stringify({text, interviewer: interviewer.name.split(" ")[0]})
                        });
                        const r = await response.blob();
                        const audioUrl = URL.createObjectURL(r);
                        const audioPlayer: HTMLAudioElement = document.getElementById("audioPlayer");
                        if (audioPlayer){
                            audioPlayer.src = audioUrl
                            audioPlayer.play();
                        }
                    }
                    if (conversationResponse.finished) {
                        const summary = await postSummary({conversation_id: $conversationStore.id || ""})
                        summaryId = summary?.id || "";
                    }
                }

                loading = false;
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
</script>

<div>
    <audio id="audioPlayer"></audio>
    <div class="call">
        <h3>{interviewer.name.split(" ")[0]}</h3>
        <div class="pfp-container">
            <!-- svelte-ignore a11y-missing-attribute -->
            {#if !interviewConfirmed}
                <img src={UserHeadsetDuo}/>
            {:else}
                <img src={interviewer.pfp || UserHeadsetDuo}/>
            {/if}
            
        </div>
        <br/>
        <div class="control-panel">
        {#if interviewConfirmed && summaryId == ""}
            <RecordAnswerButton loading={loading}/>
            <TTSButton on:click={toggleTTS} ttsEnabled={ttsEnabled}/>
        {/if}
        </div>
    </div>
    <div class="transcript">
        {#if !interviewConfirmed && $userStore.credits === 0}
            <p style="text-align: center;">Uh oh, looks like you're out of credits. Please buy more before continuing.</p>
            <div class="options-container" style="flex-direction: column; align-items: center;">
                <Button class="cta-button" on:click={buyCredits}>Buy Credits</Button>
            </div>
        {:else if !interviewConfirmed && !selectedTopic}
            <h2>Select a Focus Area</h2>
            <p>Most soft skill interviews focus on one of the following topics. Please choose one of the following:</p>
            <div class="options-container">
                {#each topics as topic}
                    <Button class="cta-button" on:click={() => selectedTopic = topic}>{topic}</Button>
                {/each}
            </div>
        {:else if !interviewConfirmed}
            <h2 style="text-align: center;">Let's Practice {selectedTopic}</h2>
            <p style="text-align: center;">Once you begin the interview session one token will be deducted.</p>
            <p style="text-align: center;">Leaving the page or refreshing will lose the session</p>
            <div class="options-container" style="flex-direction: column; align-items: center;">
                <Button class="cta-button" style="max-width: 135px;" on:click={confirmInterview} >Continue</Button><br/>
                <Button class="cta-button" style="max-width: 135px;" on:click={() => selectedTopic = ""}>Go Back</Button>
            </div>
        {:else}
            <Transcript loading={loading}/>
            {#if summaryId != "" && !loading}
                <Button class="cta-button" on:click={() => goto(`/summary/${summaryId}`)}>View Scorecard</Button>
            {/if}
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../../lib/styles/colors.scss";

    * :global(.cta-button) {
        border: 1px solid $dark-purple;
        background-color: $dark-purple;
        color: white;
        width: 200px;
    }

    div {
        display: flex;
        flex-direction: column;
        .call {
            z-index: 1;
            width: 100%;
            background-color: #6e6e6e;
            padding: 20px 0px;
            position: sticky;
            top: 0;
            .control-panel {
                display: flex;
                flex-direction: row;
                margin: 0px 40vw;
            }
            h3 {
                margin: auto;
                padding-top: 20px;
                margin-top: 75px;
                text-align: center;
                color: $dark-purple;
                background-color: white;
                width: 500px;
                border-top: 1px solid black;
                border-left: 1px solid black;
                border-right: 1px solid black;
            }
            .pfp-container {
                background-color: white;
                width: 500px;
                padding: 20px 0px;
                padding-bottom: 30px;
                margin: auto;
                img {
                    width: 150px;
                    border-radius: 100px;
                    margin: auto;
                }
            }
            @media only screen and (max-width: 1000px) {
                h3 {
                    font-size: 14px;
                    width: 300px;
                }
                .pfp-container {
                    width: 300px;
                    padding: 10px 0px;
                    img {
                        width: 80px;
                    }
                }
            }
        }
        .transcript {
            padding: 0px 5%;
            margin-bottom: 40px;
        }
        .options-container {
            flex-flow: row wrap;
            display: flex;
            justify-content: center;
        }
    }
</style>