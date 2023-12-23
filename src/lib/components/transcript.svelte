<script lang="ts">
    import { conversationStore } from "$lib/stores/conversationStore";
    import { recordingState } from "$lib/stores/recordingState";

    import { afterUpdate, beforeUpdate } from "svelte";
	import HorizontalLoader from "./horizontalLoader.svelte";

    export let loading: boolean;

    const conversationSectionElement = document.querySelector('#conversationSection');    
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
    {#each $conversationStore.parts as part}
        <p><strong class="strong">{part.participant}</strong>: {@html part.text}</p>
    {/each}
    {#if loading || $recordingState === 'transcribing'}
        <HorizontalLoader size="s" position="c">
            {$recordingState === 'transcribing' ? 'transcribing speech...' : 'taking some notes...'}
        </HorizontalLoader>
    {/if}
</div>

<style lang="scss">
    #conversationSection {
        flex-direction: column;
        scroll-behavior: smooth;
        p { line-height: 25px; }
    }
    strong { font-weight: 700; }
</style>