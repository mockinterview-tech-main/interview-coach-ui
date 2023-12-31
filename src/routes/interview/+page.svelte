<script lang="ts">
    import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

    import UserHeadsetDuo from "$lib/assets/icons/user-headset-duo.svg"

    import Lucy from "$lib/assets/profile-pics/lucy.png"
    import Dale from "$lib/assets/profile-pics/dale.png"
    import Kelly from "$lib/assets/profile-pics/kelly.png"
    import Judy from "$lib/assets/profile-pics/judy.png"
    import Patrick from "$lib/assets/profile-pics/patrick.png"

    import { interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText } from '$lib/stores/recordingState';
    import { interviewAnswerStore, currentFollowupStore } from '$lib/stores/answerStore';
	import { conversationStore } from '$lib/stores/conversationStore';

	import RecordAnswerButton from '$lib/components/recordAnswerButton.svelte';
	import Modal from '$lib/components/modal.svelte';
	import Transcript from '$lib/components/transcript.svelte';
	import { postConversation, postSummary, putConversation } from '$lib/serviceApi.js';
	import EndInterviewButton from '$lib/components/endInterviewButton.svelte';

    export let data;
    let {credits, username} = data;

    const interviewers = [
        { name: "Lucy Interviewer", pfp: Lucy },
        { name: "Dale Interviewer", pfp: Dale },
        { name: "Kelly Interviewer", pfp: Kelly },
        { name: "Judy Interviewer", pfp: Judy },
        { name: "Patrick Interviewer", pfp: Patrick }
    ]

    const interviewer = interviewers[Math.floor(Math.random() * interviewers.length)];

    // Initial Values
    let jobInfo = { company: "", job: "" };
    let loading = false;
    let confirmDialogOpen = true;
    let interviewConfirmed = false;
    let summaryId = "";
    
    $: jobInfo
    $: loading
    $: interviewConfirmed
    $: summaryId
    $: credits

    const reset = () => {
        $interviewQuestion = {uuid: "", question_text: ""};
        $interviewAnswerStore = null;
        $currentFollowupStore = null;
        $outputText = "";
        $conversationStore = {id: null, finished: false, parts: []};
    }

    onDestroy(reset);

    const buyCredits = () => goto('/credits');

    const confirmInterview = () => {
        reset();
        confirmDialogOpen = false;
        interviewConfirmed = true;
        fetch('/interview', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({action: "deduct"})
        }); // deducts a token and starts the interview
        $conversationStore.parts = [{
            participant: interviewer.name.split(" ")[0], 
            text: `Hi ${username} I'm ${interviewer.name.split(" ")[0]} and I'll be conducting your interview today! Please tell me what role and company you'd like to practice for.`
        }];
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
                    participant: username || "You",
                    text: $outputText
                }

                $conversationStore.parts = [...$conversationStore.parts, newPart];

                loading = true;

                const conversationResponse = $conversationStore.id ? 
                    await putConversation({id: $conversationStore.id, text: `${newPart.participant}: ${newPart.text}`}) : 
                    await postConversation({text: `${newPart.text}`});

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
    <Modal bind:isOpen={confirmDialogOpen} isIgnorable={false}>
        {#if credits === 0}
            <p><b>Uh oh, looks like you're out of credits. Please buy more before continuing.</b></p>
            <button class="primary-button" on:click={buyCredits}>Buy Credits</button>
        {:else}
            <h2 style="text-align: center;">Are you ready?</h2>
            <p>Once you begin the interview session one token will be deducted.</p>
            <p>Leaving the page or refreshing will lose the session</p>
            <button on:click={confirmInterview} class="modal-button">Continue</button>
            <button on:click={() => history.back() } class="modal-button tirtiary-button">Not Now</button>
        {/if}
    </Modal>
    <div class="call">
        <h3>{interviewer.name.split(" ")[0]}</h3>
        <div class="pfp-container">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={interviewer.pfp || UserHeadsetDuo}/>
        </div>
        <br/>
        <div class="control-panel">
        {#if interviewConfirmed && summaryId == ""}
            <RecordAnswerButton loading={loading}/>
            <EndInterviewButton loading={loading} conversation_id={$conversationStore.id || ""}/>
        {/if}
        </div>
    </div>
    <div class="transcript">
        <Transcript loading={loading}/>
        {#if summaryId != "" && !loading}
            <button on:click={() => goto(`/summary/${summaryId}`)} class="button">View Scorecard</button>
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
                    width: 200px;
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
                    img {
                        width: 100px;
                    }
                }
            }
        }
        .transcript {
            padding: 0px 15%;
            margin-bottom: 40px;
        }
        .modal-button { display: inline; }
        button {
            max-width: 135px;
            margin: auto;
        }
    }
</style>