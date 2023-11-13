<script lang="ts">
    import { conversationStore } from "$lib/stores/conversationStore";
    import { recordingState } from "$lib/stores/recordingState";

    import Loading from "$lib/assets/icons/loading.svg";
    import { afterUpdate, beforeUpdate } from "svelte";

    export let loading: boolean;
    export let endInterview: boolean;

    const conversationSectionElement = document.querySelector('conversationSection');    
    if(conversationSectionElement){
        const conversationSectionElementObserver = new MutationObserver(() => conversationSectionElement.scrollTop = conversationSectionElement?.scrollHeight)
        conversationSectionElementObserver.observe(conversationSectionElement, {childList: true})
    }

    let autoscroll = true;
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

</script>

<div id="conversationSection" bind:this={conversationSection}>
    {#each $conversationStore as part}
        <p><strong class="strong">{part.participant}</strong>: {@html part.text}</p>
    {/each}
    {#if loading || $recordingState === 'transcribing' && !endInterview}
        <img class="loading" alt="loading" src={Loading}/>
        <p class="loading">{$recordingState === 'transcribing' ? 'transcribing speech...' : 'taking some notes...'}</p>
    {/if}
    {#if endInterview}
        <p>Thank you for your time. Please wait and we'll get you your feedback in a bit 🎉</p>
    {/if}
</div>

<style lang="scss">
    #conversationSection {
        flex-direction: column;
        overflow: scroll;
        scroll-behavior: smooth;
        p { line-height: 25px; }
    }
    .loading {
        margin: auto;
        display: block;
        text-align: center;
    }

    strong { font-weight: 700; }
</style>