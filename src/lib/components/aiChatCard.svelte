<script lang="ts">
	import { interviewQuestion } from "$lib/stores/interviewQuestion";
    import { aiChatStore } from "$lib/stores/chatStore";
	import { afterUpdate, beforeUpdate } from "svelte";
	import { goto } from "$app/navigation";

    export let loading: boolean;
    export let endInterview: boolean;
    export let jobInfo: {job: string, company: string};
    export let handleJobInfo: (e: Event) => void;
    export let credits: number;

    const conversationSectionElement = document.querySelector('conversationSection');    
    if(conversationSectionElement){
        const conversationSectionElementObserver = new MutationObserver(() => conversationSectionElement.scrollTop = conversationSectionElement?.scrollHeight)
        conversationSectionElementObserver.observe(conversationSectionElement, {childList: true})
    }

    let autoscroll = false;
    let conversationSection: HTMLDivElement;
    beforeUpdate(() => {
		if (conversationSection) {
			const scrollableDistance = conversationSection.scrollHeight - conversationSection.offsetHeight;
			autoscroll = conversationSection.scrollTop > scrollableDistance - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) {
			conversationSection.scrollTo(0, conversationSection.scrollHeight);
		}
	});

    const buyCredits = (e: Event) => {
        e.preventDefault();
        goto('/credits')
    }

</script>

<h3>AI Chat</h3>
<div id="conversationSection" bind:this={conversationSection}>
    {#if $interviewQuestion.question_text === ""}
        <p>{$aiChatStore[0]}</p>
        {#if credits === 0}
            <p><b>Uh oh, looks like you're out of credits. Please buy more before continuing.</b></p>
        {/if}
        <form on:submit={handleJobInfo}>
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
        {#each $aiChatStore as part}
            <p>{part}</p>
        {/each}
        {#if loading && !endInterview}
            <p>Hang on, I'm taking some notes 📝...</p>
        {/if}
        {#if endInterview}
            <p>Thank you for your time. Please wait and we'll get you your feedback in a bit 🎉</p>
        {/if}
    {/if}
</div>

<style lang="scss">
    form {
        max-width: 50%;
        margin: auto;
        input {
            width: 100%;
        }
    }

    #conversationSection {
        overflow: scroll;
        margin: 20px;
        max-height: 500px;
    }
</style>