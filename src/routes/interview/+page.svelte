<script lang="ts">
    import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

    import UserHeadsetDuo from "$lib/assets/icons/user-headset-duo.svg"
    import Loading from "$lib/assets/icons/loading.svg";

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
	import { getSummary, postConversation } from '$lib/serviceApi.js';

    const EXCHANGE_END_CODE = import.meta.env.VITE_EXCHANGE_END_CODE;


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
    let endInterview = false;
    let confirmDialogOpen = true;
    let interviewConfirmed = false;
    let summaryId = "";
    
    $: jobInfo
    $: endInterview
    $: loading
    $: interviewConfirmed
    $: summaryId
    $: credits

    const reset = () => {
        $interviewQuestion = {uuid: "", question_text: ""};
        $interviewAnswerStore = null;
        $currentFollowupStore = null;
        $outputText = "";
        $conversationStore = [];
    }

    onDestroy(reset);

    const buyCredits = () => goto('/credits');

    const confirmInterview = () => {
        reset();
        confirmDialogOpen = false;
        interviewConfirmed = true;
        fetch('/interview', {
            method: 'POST',
            credentials: 'include'
        })
        $conversationStore = [{
            participant: interviewer.name.split(" ")[0], 
            text: `Hi ${username} I'm ${interviewer.name.split(" ")[0]} and I'll be conducting your mock interview today! Please tell me what role and company you'd like to practice for.`
        }];
    }

    outputText.subscribe(async () => {
        try {
            if ($outputText !== '') {
                loading = true;

                $conversationStore = [...$conversationStore, {
                    participant: username || "You",
                    text: $outputText
                }];
                
                const response = await fetch(`/conversations/openai`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        questionCount: 1,
                        followupCount: 1,
                        context: $conversationStore.map(part => `${part.participant}: ${part.text}`).join("\n"),
                    })
                });

                if (response.ok) {
                    let { text } = await response.json();
                    if (text.endsWith(EXCHANGE_END_CODE)) {
                        text = text.slice(0, (-1 * EXCHANGE_END_CODE.length));
                        endInterview = true;
                        // sometimes the model tries to match the format of the conversation and fill in its name like "Mike: Great answer"
                        // we assume the model doesn't use semicolons in any other way so we lob off the text prior to a semicolon which 
                        // is typically the interviewer name if thats how the model responds. mid answer semicolons are simply
                        // replaced with "." which doesn't significantly change the meaning... hence the gymnastics
                        $conversationStore = [... $conversationStore, {
                            participant: interviewer.name.split(" ")[0],
                            text: text.split(": ").filter((part: string) => part != interviewer.name.split(" ")[0]).join(". ")
                        }];
                        const rawConversationText = $conversationStore.reduce((a, c) => a + `${c.participant}: ${c.text}\n`, '');
                        const completedConversation = await postConversation({text: rawConversationText});
                        if (completedConversation) {
                            const completeSummary = await getSummary(completedConversation?.summary_id);
                            loading = false;
                            summaryId = completeSummary?.id || "";
                        }
                    }
                    else {
                        $conversationStore = [... $conversationStore, {
                            participant: interviewer.name.split(" ")[0],
                            text: text.split(": ").filter((part: string) => part != interviewer.name.split(" ")[0]).join(". ")
                        }];
                    }
                } else {
                    console.error('Error uploading interview answer');
                    return null;
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            loading = false;
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
        {#if interviewConfirmed && !endInterview}<RecordAnswerButton loading={loading}/>{/if}
    </div>
    <div class="transcript">
        <Transcript loading={loading}/>
        {#if endInterview && !loading}
            <button on:click={() => goto(`/summary/${summaryId}`)} class="button">Continue{summaryId}</button>
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
            padding: 0px 40px;
            margin-bottom: 40px;
            overflow: auto;
        }
        .modal-button { display: inline; }
        button {
            max-width: 135px;
            margin: auto;
        }
    }
</style>