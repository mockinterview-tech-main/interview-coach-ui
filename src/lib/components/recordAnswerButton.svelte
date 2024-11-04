<script lang="ts">
	import { startRecording, stopRecording, compressAudioBlob } from '$lib/recorder/mediaRecorder';
	import { createEventDispatcher } from 'svelte';

	import MicFilled from '$lib/assets/icons/mic-filled.svg';
	import MuteFilled from '$lib/assets/icons/mute-filled.svg';

	let loading = false;

	type RecordingState = 'idle' | 'recording' | 'transcribing';
	let recordingState: RecordingState = 'idle';
	let isDisabled = false;

	const dispatch = createEventDispatcher();

	$: {
		isDisabled = loading || recordingState === 'transcribing';
	}

	const toggleRecording = async () => {
		if (recordingState === 'idle') {
			await startRecording();
			recordingState = 'recording';
			return;
		}
		if (recordingState === 'recording') {
			try {
				let [audioBlob, elapsedTime] = await stopRecording();
				recordingState = 'transcribing';
				// Check if the size is less than 25MB
				if (audioBlob.size > 25 * 1024 * 1024) {
					audioBlob = await compressAudioBlob(audioBlob);
					if (audioBlob.size > 25 * 1024 * 1024)
						throw new Error(`[ERROR] Given answer is too long. Speaking time: ${elapsedTime}`);
				}
				dispatch('audio', { audioBlob, elapsedTime });
				return;
			} catch (error) {
				console.error('Error occurred during transcription:', error);
				dispatch('error', 'long answer error');
			} finally {
				recordingState = 'idle';
			}
		}
	};
</script>

<button
	disabled={isDisabled}
	on:click={toggleRecording}
	title={recordingState === 'idle'
		? isDisabled
			? 'please wait'
			: 'turn on microphone'
		: 'mute microphone'}
	class={`record-button ${recordingState === 'recording' ? 'flash' : ''}`}
>
	<!-- svelte-ignore a11y-missing-attribute -->
	<img
		width="30px"
		height="30px"
		src={recordingState === 'idle' || isDisabled ? MuteFilled : MicFilled}
	/>
</button>

<style lang="scss">
	@import '../styles/colors.scss';

	button {
		margin: 10px auto;
		img {
			min-width: 30px;
			min-height: 30px;
		}
	}

	.record-button {
		width: 80px;
		height: 80px;
		border: none;
		position: relative;
		background-color: $dark-purple;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		justify-content: center;
		transition: background-color 0.3s ease;
	}

	.record-button:disabled {
		background-color: red;
	}

	.record-button:disabled:hover {
		background-color: red;
	}

	.record-button:hover {
		background-color: $light-purple;
	}
	.flash {
		animation: flash 1s infinite;
	}

	@keyframes flash {
		0% {
			background-color: $dark-purple;
		}
		50% {
			background-color: $light-purple;
		}
		100% {
			background-color: $dark-purple;
		}
	}

	/* Style the tooltip */
	.record-button[title]:hover::after {
		content: attr(title);
		background-color: $dark-gray;
		color: $white;
		padding: 4px 8px;
		border-radius: 4px;
		position: absolute;
		top: 110%;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}

	.record-button[title]:hover::after {
		opacity: 1;
		visibility: visible;
	}
</style>
