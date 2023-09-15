<script lang="ts">
	import { interviewSummaryStore } from "$lib/stores/summaryStore";

    export let loading: boolean;

    $: interviewSummaryStore

</script>

{#if loading}<p>Alright, I'll have your results in bit... ✅</p>{/if}
<p>{$interviewSummaryStore.Situation}</p>
<p>{$interviewSummaryStore.Task}</p>
<p>{$interviewSummaryStore.Action}</p>
<p>{$interviewSummaryStore.Result}</p>
<p>{$interviewSummaryStore.Summary}</p>