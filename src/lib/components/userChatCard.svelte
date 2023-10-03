<script lang="ts">
    import { userChatStore } from "$lib/stores/chatStore";
	import { recordingState } from "$lib/stores/recordingState";
	import { afterUpdate, beforeUpdate } from "svelte";

    export let endInterview: boolean;
    
    let autoscroll = false;
    let userChatContainer: HTMLDivElement;
    beforeUpdate(() => {
		if (userChatContainer) {
			const scrollableDistance = userChatContainer.scrollHeight - userChatContainer.offsetHeight;
			autoscroll = userChatContainer.scrollTop > scrollableDistance - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) {
			userChatContainer.scrollTo(0, userChatContainer.scrollHeight);
		}
	});
</script>

<h3>User Chat</h3>
<div id="conversationSection"  bind:this={userChatContainer}>
    {#each $userChatStore as part}
        <p>{part}</p>
    {/each}
    {#if $recordingState === 'transcribing' && !endInterview}
        <p>Transcribing speech 📝...</p>
    {/if}
</div>

<style lang="scss">
    h3 {
        text-align: center;
    }
    #conversationSection {
        margin: 20px;
        flex-direction: column;
        overflow: scroll;
        scroll-behavior: smooth;
    }
</style>