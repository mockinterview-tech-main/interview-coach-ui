<script lang="ts">
    export let question: string;
    export let date: Date;
</script>

<div>
    <i><strong>{question}</strong></i><br/>
    <i>{date.toLocaleDateString()} {date.toLocaleTimeString()}</i>
</div>

<style lang="scss">
    
</style>