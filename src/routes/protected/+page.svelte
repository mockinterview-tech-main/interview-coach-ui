<script lang="ts">
	import { toggleRecording } from '$lib/recorder/toggleRecording';
	import { interviewQuestion } from '$lib/stores/interviewQuestion';
    import { outputText, recordingState } from '$lib/stores/recordingState';
	import { onMount } from 'svelte';

    const resumeUrl = import.meta.env["VITE_RESUME_URL"];
    let feedback: Array<{question: String, feedback: String}> = [];
    $: feedback

    onMount(() => getQuestion())
   
    const getQuestion = async () => {
        try {
            const response = await fetch(`${resumeUrl}/question`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const d = await response.json();
                interviewQuestion.set(d);
            } else {
                console.error('Error uploading file');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    outputText.subscribe(async (answer) => {
        if(answer != ""){
            try {
                const response = await fetch(`${resumeUrl}/answer`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        company: "Google",
                        job: "Project Manager",
                        qid: $interviewQuestion.qid,
                        answer,
                    })
                });
                if (response.ok) {
                    const d = await response.json();
                    feedback = [...feedback, {question: $interviewQuestion.question, feedback: d.feedback}]
                } else {
                    console.error('Error uploading file');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    })

</script>

<h1>Mock Interview Experience</h1>
<h2>Instructions</h2>
<p>Read the prompt and click the play ▶️ / stop ⏹️ button to start recording your answer</p>
<p>When you're done recording click the stop ⏹️ button again to evaluate your answer</p>
<p>Click next question to move to the next prompt</p>
<h2>Your Question</h2>
<div>{$interviewQuestion.question}</div><br/>
<button on:click={toggleRecording}>{$recordingState === 'idle' ? "▶️" : "⏹️"}</button>
<button on:click={getQuestion}>Next Question</button>&nbsp;
<h2>Your answer</h2>
<div>{$outputText || "Your transcribed answer will appear here"}</div>
<h2>Evaluation</h2>
<div>{feedback.length > 0 ? feedback.map(fb => fb.feedback + `\n`) : "An analysis of your answer will appear here including how we interpreted the Situation, Task, Action, and Result as well as tips to improve the clarity and impact of your response."}</div>
