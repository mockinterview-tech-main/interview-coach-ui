<script lang="ts">
    export let conversation: Array<string>;
    export let jobInfo: {job: string, company: string};
    export let handleJobInfo: (e: Event) => Promise<void>;

</script> 
 
<p>{conversation[0]}</p>
<form on:submit={handleJobInfo}>
    <label for="job">Job Title</label>
    <input id="job" type="text" bind:value={jobInfo.job}/><br/>
    <label for="company">Company</label>
    <input id="company" type="text" bind:value={jobInfo.company}/><br/><br/>
    <button type="submit">Get Started</button>
</form>