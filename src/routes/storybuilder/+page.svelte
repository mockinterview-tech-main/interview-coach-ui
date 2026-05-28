<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/userStore';

	// ── State ──
	let phase: 'lobby' | 'coaching' | 'loading-report' | 'report' = 'lobby';
	let sessionId: string | null = null;
	let messages: Array<{ role: string; content: string; streaming?: boolean }> = [];
	let input = '';
	let loading = false;
	let report: any = null;
	let voiceMode = true;
	let remainingTime = 20 * 60 * 1000;
	let userConfirmedEnd = false;
	let starSections: Record<string, string | null> = { situation: null, task: null, action: null, result: null };
	let talkingPoints: any = null;
	let talkingPointsLoading = false;
	let sidebarWidth = 380;
	let isListening = false;
	let isSpeaking = false;
	let interimTranscript = '';
	let browserSupported = true;

	// ── Refs (using variables) ──
	let messagesEndEl: HTMLElement;
	let dragHandleEl: HTMLElement;
	let isDragging = false;
	let startTimeMs: number | null = null;
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// ── Speech Recognition state ──
	let recognition: any = null;
	let silenceTimer: ReturnType<typeof setTimeout> | null = null;
	let finalTranscriptBuf = '';
	let isActive = false;
	let shouldRestart = false;
	const SILENCE_TIMEOUT_MS = 1800;
	const MIN_WORD_COUNT = 3;

	// ── TTS state ──
	let audioQueue: Blob[] = [];
	let isPlaying = false;
	let currentAudio: HTMLAudioElement | null = null;
	let abortController: AbortController | null = null;
	let ttsFlush = false;
	let ttsStarted = false;
	let ttsFetchCount = 0;
	let ttsStopped = false;

	// ── Helpers ──
	function stripMarkdown(text: string): string {
		return text
			.replace(/\*\*\*(.+?)\*\*\*/g, '$1')
			.replace(/\*\*(.+?)\*\*/g, '$1')
			.replace(/\*(.+?)\*/g, '$1')
			.replace(/__(.+?)__/g, '$1')
			.replace(/_(.+?)_/g, '$1')
			.replace(/^#{1,6}\s+/gm, '')
			.replace(/^[\s]*[-*+•]\s+/gm, '')
			.replace(/^[\s]*\d+\.\s+/gm, '')
			.replace(/```[\s\S]*?```/g, '')
			.replace(/`(.+?)`/g, '$1')
			.replace(/\[(.+?)\]\(.+?\)/g, '$1')
			.replace(/^>\s+/gm, '')
			.replace(/~~/g, '')
			.replace(/\n{3,}/g, '\n\n')
			.trim();
	}

	// ── Speech Recognition ──
	function clearSilenceTimer() {
		if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
	}

	function finalizeTurn() {
		clearSilenceTimer();
		const transcript = finalTranscriptBuf.trim();
		finalTranscriptBuf = '';
		interimTranscript = '';
		if (transcript && transcript.split(/\s+/).length >= MIN_WORD_COUNT) {
			sendMessage(transcript);
		} else if (transcript) {
			finalTranscriptBuf = transcript;
		}
	}

	function startSilenceTimer() {
		clearSilenceTimer();
		silenceTimer = setTimeout(() => {
			if (finalTranscriptBuf.trim().split(/\s+/).length >= MIN_WORD_COUNT) {
				shouldRestart = true;
				try { recognition?.stop(); } catch {}
			}
		}, SILENCE_TIMEOUT_MS);
	}

	function createRecognition() {
		const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if (!SR) return null;
		const rec = new SR();
		rec.continuous = true;
		rec.interimResults = true;
		rec.lang = 'en-US';
		rec.maxAlternatives = 1;

		rec.onstart = () => { isListening = true; };

		rec.onresult = (event: any) => {
			let interim = '';
			let final = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				if (event.results[i].isFinal) {
					final += event.results[i][0].transcript;
				} else {
					interim += event.results[i][0].transcript;
				}
			}
			if (final) { finalTranscriptBuf += final; startSilenceTimer(); }
			if (interim) { clearSilenceTimer(); }
			const display = finalTranscriptBuf + interim;
			interimTranscript = display;
		};

		rec.onerror = (event: any) => {
			if (event.error === 'no-speech' || event.error === 'aborted') {
				if (isActive && phase === 'coaching') {
					setTimeout(() => { try { recognition?.start(); } catch {} }, 100);
				}
				return;
			}
			isListening = false;
		};

		rec.onend = () => {
			isListening = false;
			clearSilenceTimer();
			if (shouldRestart) {
				shouldRestart = false;
				finalizeTurn();
				if (isActive && phase === 'coaching') {
					setTimeout(() => { try { recognition?.start(); } catch {} }, 200);
				}
				return;
			}
			if (finalTranscriptBuf.trim()) { finalizeTurn(); }
			if (isActive && phase === 'coaching') {
				setTimeout(() => { try { recognition?.start(); } catch {} }, 200);
			}
		};

		return rec;
	}

	function startListening() {
		isActive = true;
		finalTranscriptBuf = '';
		interimTranscript = '';
		if (recognition) { try { recognition.abort(); } catch {} }
		recognition = createRecognition();
		if (recognition) { try { recognition.start(); } catch {} }
	}

	function stopListening() {
		isActive = false;
		shouldRestart = false;
		clearSilenceTimer();
		if (recognition) { try { recognition.abort(); } catch {} recognition = null; }
		isListening = false;
		if (finalTranscriptBuf.trim()) { finalizeTurn(); }
	}

	// ── TTS (ElevenLabs) ──
	function ttsPlayNext() {
		if (ttsStopped) return;
		if (audioQueue.length === 0) {
			if (ttsFlush && ttsFetchCount === 0) {
				isPlaying = false;
				isSpeaking = false;
				ttsStarted = false;
				setTimeout(() => {
					if (voiceMode && phase === 'coaching') startListening();
				}, 300);
			}
			return;
		}
		isPlaying = true;
		const blob = audioQueue.shift()!;
		const audioUrl = URL.createObjectURL(blob);
		const audio = new Audio(audioUrl);
		currentAudio = audio;
		audio.onended = () => { URL.revokeObjectURL(audioUrl); currentAudio = null; ttsPlayNext(); };
		audio.onerror = () => { URL.revokeObjectURL(audioUrl); currentAudio = null; ttsPlayNext(); };
		audio.play().catch(() => { URL.revokeObjectURL(audioUrl); currentAudio = null; ttsPlayNext(); });
	}

	async function ttsQueueSentence(sentence: string) {
		if (!sentence.trim() || ttsStopped) return;
		if (!ttsStarted) {
			ttsStarted = true;
			isSpeaking = true;
			stopListening();
		}
		ttsFetchCount++;
		try {
			const controller = new AbortController();
			abortController = controller;
			const res = await fetch('/storybuilder/api/tts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: sentence }),
				signal: controller.signal,
			});
			if (!res.ok) throw new Error(`TTS ${res.status}`);
			const blob = await res.blob();
			if (ttsStopped) return;
			audioQueue.push(blob);
			if (!isPlaying) ttsPlayNext();
		} catch (err: any) {
			if (err.name === 'AbortError') return;
			console.warn('TTS sentence failed:', err.message);
		} finally {
			ttsFetchCount--;
			if (ttsFlush && ttsFetchCount === 0 && audioQueue.length === 0 && !isPlaying) {
				isSpeaking = false;
				ttsStarted = false;
				setTimeout(() => {
					if (voiceMode && phase === 'coaching') startListening();
				}, 300);
			}
		}
	}

	function ttsFlushQueue() {
		ttsFlush = true;
		if (ttsFetchCount === 0 && audioQueue.length === 0 && !isPlaying) {
			if (ttsStarted) {
				isSpeaking = false;
				ttsStarted = false;
				setTimeout(() => {
					if (voiceMode && phase === 'coaching') startListening();
				}, 300);
			}
		}
	}

	function ttsStartStreaming() {
		ttsStopped = false;
		ttsFlush = false;
		ttsStarted = false;
		audioQueue = [];
		ttsFetchCount = 0;
		isPlaying = false;
	}

	async function ttsSpeak(text: string) {
		ttsStop();
		ttsStopped = false;
		ttsFlush = false;
		ttsStarted = false;
		audioQueue = [];
		ttsFetchCount = 0;
		isSpeaking = true;
		stopListening();
		ttsStarted = true;
		try {
			const controller = new AbortController();
			abortController = controller;
			const res = await fetch('/storybuilder/api/tts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text }),
				signal: controller.signal,
			});
			if (!res.ok) throw new Error(`TTS ${res.status}`);
			const blob = await res.blob();
			const audioUrl = URL.createObjectURL(blob);
			const audio = new Audio(audioUrl);
			currentAudio = audio;
			audio.onended = () => {
				isSpeaking = false;
				URL.revokeObjectURL(audioUrl);
				currentAudio = null;
				ttsStarted = false;
				setTimeout(() => {
					if (voiceMode && phase === 'coaching') startListening();
				}, 300);
			};
			audio.onerror = () => {
				isSpeaking = false;
				URL.revokeObjectURL(audioUrl);
				currentAudio = null;
				ttsStarted = false;
				if (voiceMode && phase === 'coaching') startListening();
			};
			await audio.play();
		} catch (err: any) {
			if (err.name === 'AbortError') return;
			console.warn('TTS failed, falling back to browser:', err.message);
			// Browser fallback
			if (window.speechSynthesis) {
				const u = new SpeechSynthesisUtterance(text);
				u.onend = () => { isSpeaking = false; ttsStarted = false; if (voiceMode && phase === 'coaching') startListening(); };
				u.onerror = () => { isSpeaking = false; ttsStarted = false; if (voiceMode && phase === 'coaching') startListening(); };
				window.speechSynthesis.speak(u);
			}
		}
	}

	function ttsStop() {
		ttsStopped = true;
		if (abortController) { abortController.abort(); abortController = null; }
		if (currentAudio) { currentAudio.pause(); currentAudio = null; }
		audioQueue = [];
		isPlaying = false;
		ttsFetchCount = 0;
		ttsFlush = false;
		if (window.speechSynthesis) window.speechSynthesis.cancel();
		isSpeaking = false;
		ttsStarted = false;
	}

	// ── Send message (streaming SSE) ──
	async function sendMessage(userMessage: string) {
		if (!userMessage.trim() || loading) return;

		messages = [...messages, { role: 'candidate', content: userMessage }];
		loading = true;

		// Add streaming placeholder
		messages = [...messages, { role: 'interviewer', content: '', streaming: true }];

		try {
			const res = await fetch('/storybuilder/api/respond', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, message: userMessage }),
			});

			if (!res.ok) {
				const errData = await res.json();
				messages = messages.filter(m => !m.streaming).concat([
					{ role: 'system', content: `Error: ${errData.error}` }
				]);
				loading = false;
				return;
			}

			const reader = res.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let streamedText = '';
			let spokenText = '';
			let finalData: any = null;

			if (voiceMode) ttsStartStreaming();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() || '';
				for (const line of lines) {
					if (!line.startsWith('data: ')) continue;
					try {
						const event = JSON.parse(line.slice(6));
						if (event.type === 'chunk') {
							streamedText += event.text;
							const clean = stripMarkdown(streamedText);
							messages = messages.map(m => m.streaming ? { ...m, content: clean } : m);
							loading = false;

							if (voiceMode) {
								const cleanSoFar = stripMarkdown(streamedText);
								const unspoken = cleanSoFar.slice(spokenText.length);
								const sentenceRegex = /[^.!?\n]+[.!?]+(?:\s|$)/g;
								let match;
								let lastEnd = 0;
								while ((match = sentenceRegex.exec(unspoken)) !== null) {
									const sentence = match[0].trim();
									if (sentence.length > 5) ttsQueueSentence(sentence);
									lastEnd = match.index + match[0].length;
								}
								if (lastEnd > 0) spokenText = cleanSoFar.slice(0, spokenText.length + lastEnd);
							}
						} else if (event.type === 'done') {
							finalData = event;
						} else if (event.type === 'error') {
							messages = messages.filter(m => !m.streaming).concat([
								{ role: 'system', content: `Error: ${event.error}` }
							]);
						}
					} catch {}
				}
			}

			if (finalData) {
				const cleanMessage = stripMarkdown(finalData.message);
				messages = messages.map(m => m.streaming ? { role: 'interviewer', content: cleanMessage } : m);

				if (voiceMode) {
					const remaining = cleanMessage.slice(spokenText.length).trim();
					if (remaining.length > 5) ttsQueueSentence(remaining);
					ttsFlushQueue();
				}

				if (finalData.starUpdate) {
					starSections = { ...starSections, [finalData.starUpdate.section]: finalData.starUpdate.content };
				}

				if (finalData.done) {
					stopListening();
					ttsStop();
					await handleEnd();
				}
			}
		} catch {
			messages = messages.filter(m => !m.streaming).concat([
				{ role: 'system', content: 'Error communicating with server.' }
			]);
		}
		loading = false;
	}

	// ── Start session ──
	async function handleStart() {
		loading = true;
		try {
			// Deduct credit
			const creditRes = await fetch('/interview', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ action: 'deduct' })
			});
			if (creditRes.ok) {
				const creditsBody = await creditRes.json();
				if (creditsBody.credits !== undefined) {
					$userStore = { ...$userStore, credits: creditsBody.credits };
				}
			}

			const res = await fetch('/storybuilder/api/start', { method: 'POST' });
			const data = await res.json();
			sessionId = data.sessionId;
			startTimeMs = Date.now();
			remainingTime = 20 * 60 * 1000;
			starSections = { situation: null, task: null, action: null, result: null } as Record<string, string | null>;
			userConfirmedEnd = false;
			const cleanOpening = stripMarkdown(data.message);
			messages = [{ role: 'interviewer', content: cleanOpening }];
			phase = 'coaching';

			// Start timer
			timerInterval = setInterval(() => {
				if (!startTimeMs) return;
				const elapsed = Date.now() - startTimeMs;
				remainingTime = Math.max(0, 20 * 60 * 1000 - elapsed);
				if (remainingTime === 0 && timerInterval) {
					clearInterval(timerInterval);
				}
			}, 1000);

			if (voiceMode) {
				setTimeout(() => ttsSpeak(cleanOpening), 500);
			}
		} catch {
			alert('Failed to start session. Is the server running?');
		}
		loading = false;
	}

	// ── Send text input ──
	function handleSend(e?: Event) {
		e?.preventDefault();
		if (!input.trim() || loading) return;
		const msg = input.trim();
		input = '';
		sendMessage(msg);
	}

	// ── End session ──
	async function handleEnd() {
		const confirmed = confirm("Are you sure you want to finish? You won't be able to return to this session and the session credit will be used.");
		if (!confirmed) return;

		userConfirmedEnd = true;
		stopListening();
		ttsStop();
		if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

		const allSectionsFilled = starSections.situation && starSections.task && starSections.action && starSections.result;

		const fetchTP = async (sections: any) => {
			if (!sections) return;
			talkingPointsLoading = true;
			try {
				const res = await fetch('/storybuilder/api/talking-points', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ sessionId, starSections: sections }),
				});
				const data = await res.json();
				if (data.talkingPoints) talkingPoints = data.talkingPoints;
			} catch (err) {
				console.warn('Failed to fetch talking points:', err);
			}
			talkingPointsLoading = false;
		};

		if (allSectionsFilled) {
			const fullStory = [starSections.situation, starSections.task, starSections.action, starSections.result].join('\n\n');
			report = { question: null, full_story: fullStory, star_sections: starSections };
			phase = 'report';
			fetchTP(starSections);
			fetch('/storybuilder/api/end', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, skipReport: true }),
			}).catch(() => {});
		} else {
			phase = 'loading-report';
			try {
				const res = await fetch('/storybuilder/api/end', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ sessionId }),
				});
				const data = await res.json();
				report = data.scorecard;
				phase = 'report';
			} catch {
				alert('Failed to generate story report.');
				phase = 'coaching';
			}
		}
	}

	async function handleRetry() {
		phase = 'loading-report';
		try {
			const res = await fetch('/storybuilder/api/end', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId }),
			});
			const data = await res.json();
			report = data.scorecard;
			phase = 'report';
		} catch {
			report = { error: 'api_error' };
			phase = 'report';
		}
	}

	function handleBackToSession() {
		report = null;
		phase = 'coaching';
		if (voiceMode) startListening();
	}

	function handleBuildAnother() {
		phase = 'lobby';
		messages = [];
		sessionId = null;
		report = null;
		input = '';
		userConfirmedEnd = false;
		talkingPoints = null;
		starSections = { situation: null, task: null, action: null, result: null } as Record<string, string | null>;
	}

	function handleInterrupt() {
		if (isSpeaking) {
			ttsStop();
			startListening();
		}
	}

	// ── Sidebar drag ──
	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		isDragging = true;
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';
		dragHandleEl?.classList.add('dragging');
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		e.preventDefault();
		const vw = window.innerWidth;
		const minW = vw * 0.2;
		const maxW = vw * 0.5;
		sidebarWidth = Math.min(maxW, Math.max(minW, vw - e.clientX));
	}

	function handleMouseUp() {
		if (isDragging) {
			isDragging = false;
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
			dragHandleEl?.classList.remove('dragging');
		}
	}

	// ── Auto-scroll ──
	$: if (messages || interimTranscript) {
		setTimeout(() => messagesEndEl?.scrollIntoView({ behavior: 'smooth' }), 50);
	}

	// ── Timer display ──
	$: timerMinutes = Math.floor(remainingTime / 60000);
	$: timerSeconds = String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, '0');
	$: timerWarning = remainingTime < 2 * 60 * 1000;

	// ── Mic indicator ──
	$: micState = isSpeaking ? 'speaking' : loading ? 'processing' : isListening ? 'listening' : 'idle';
	$: micLabel = isSpeaking ? 'Coach speaking' : loading ? 'Thinking...' : isListening ? 'Listening to you...' : 'Mic idle';

	// ── STAR progress ──
	$: completedCount = [starSections.situation, starSections.task, starSections.action, starSections.result].filter(Boolean).length;

	// ── Report layout ──
	$: showTwoColumn = (talkingPoints || talkingPointsLoading) && !report?.error;

	// ── Credits check ──
	$: noCredits = $userStore.credits === 0 && !$userStore.subscriptionID;

	onMount(() => {
		const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		browserSupported = !!SR;
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	});

	onDestroy(() => {
		stopListening();
		ttsStop();
		if (timerInterval) clearInterval(timerInterval);
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}
	});
</script>

{#if !browserSupported}
	<div class="sb-container">
		<div class="sb-lobby">
			<div class="sb-lobby-icon">&#x1F6AB;</div>
			<h1>Browser Not Supported</h1>
			<p>This app requires speech recognition which is not available in your browser.</p>
			<p style="color: #c96442; margin-top: 16px;">
				Please use <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or <strong>Safari</strong>.
			</p>
		</div>
	</div>

{:else if phase === 'lobby'}
	<div class="sb-container">
		<div class="sb-lobby">
			{#if noCredits}
				<p style="text-align: center;">
					Uh oh, looks like you're out of credits. Please buy more before continuing.
				</p>
				<button class="sb-start-btn" on:click={() => goto('/credits')}>Buy Credits</button>
			{:else}
				<div class="sb-lobby-icon">&#10024;</div>
				<h1>STAR Story Builder</h1>
				<p>Build a compelling behavioral interview answer in 20 minutes. Your AI coach will help you turn a real work experience into a polished STAR story.</p>
				<div class="sb-lobby-tips">
					<h3>How it works</h3>
					<ul>
						<li>Share a rough experience from your work</li>
						<li>Your coach asks questions to extract the key details</li>
						<li>Together you shape it into a Situation, Task, Action, Result story</li>
						<li>Walk away with a ready-to-use interview answer</li>
					</ul>
				</div>
				<div class="sb-lobby-tips" style="margin-top: 0;">
					<h3>Voice Mode</h3>
					<p style="color: #555; font-size: 0.9rem; margin-bottom: 0;">
						Your microphone will be used for hands-free conversation.
						The coach speaks, then listens to you automatically.
						You can also type if you prefer.
					</p>
				</div>
				{#if !$userStore.subscriptionID}
					<p style="text-align: center; color: #888; font-size: 0.85rem;">
						One credit will be deducted when you begin.
					</p>
				{/if}
				<button class="sb-start-btn" on:click={handleStart} disabled={loading}>
					{loading ? 'Starting...' : 'Start Building'}
				</button>
			{/if}
		</div>
	</div>

{:else if phase === 'loading-report'}
	<div class="sb-container">
		<div class="sb-lobby">
			<div class="sb-lobby-icon">&#9997;&#65039;</div>
			<h2>Assembling your story...</h2>
			<p>Putting together your polished answer.</p>
		</div>
	</div>

{:else if phase === 'report'}
	<div class={showTwoColumn ? 'sb-report-layout' : 'sb-container'}>
		{#if showTwoColumn}
			<div class="sb-report-sidebar">
				<!-- Talking Points Panel -->
				<div class="sb-talking-points-panel">
					<h3>Talking Points</h3>
					{#if talkingPointsLoading}
						<p class="sb-talking-points-hint">Generating your key talking points...</p>
					{:else if talkingPoints}
						<p class="sb-talking-points-subtitle">Don't memorize — just remember these anchors and connect them in your own words.</p>
						{#each [{ key: 'situation', label: 'Situation', icon: '&#128205;' }, { key: 'task', label: 'Task', icon: '&#127919;' }, { key: 'action', label: 'Action', icon: '&#9889;' }, { key: 'result', label: 'Result', icon: '&#128202;' }] as section}
							<div class="sb-talking-points-section">
								<div class="sb-talking-points-label">{@html section.icon} {section.label}</div>
								<ul class="sb-talking-points-list">
									{#each (talkingPoints[section.key] || []) as point}
										<li>{point}</li>
									{/each}
								</ul>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
		<div class={showTwoColumn ? 'sb-report-main' : ''}>
			<!-- Story Report -->
			<div class="sb-scorecard">
				{#if report?.error}
					<h2>Story not generated</h2>
					<div class="sb-score-section">
						<p style="color: #555;">
							{#if report.error === 'too_short'}
								The session ended before enough details were shared to build a complete story.
							{:else if report.error === 'parse_error'}
								The coach couldn't organize the conversation into a structured story. Retrying usually fixes it.
							{:else if report.error === 'api_error'}
								We lost connection to the AI service while generating your story. Just retry.
							{:else}
								Something unexpected happened. You can retry generating your story.
							{/if}
						</p>
					</div>
					<div class="sb-scorecard-actions">
						{#if report.error === 'too_short' && !userConfirmedEnd}
							<button class="sb-start-btn" on:click={handleBackToSession}>Back to Session</button>
						{:else}
							<button class="sb-start-btn" on:click={handleRetry}>Retry</button>
						{/if}
					</div>
				{:else}
					<h2>Your STAR Story</h2>
					{#if report?.question}
						<div class="sb-score-section">
							<h3>Interview Question</h3>
							<p style="color: #2d2d2d; font-style: italic;">{report.question}</p>
						</div>
					{/if}
					{#if report?.full_story}
						<div class="sb-score-section">
							<h3>Your Polished Answer</h3>
							<p style="color: #999; font-size: 0.8rem; margin-bottom: 12px;">~3-5 minutes when spoken at a natural pace</p>
							<div class="sb-full-story">{report.full_story}</div>
						</div>
					{/if}
				{/if}
			</div>
			{#if (!report?.error || userConfirmedEnd)}
				<div class="sb-scorecard-actions">
					<button class="sb-start-btn" on:click={handleBuildAnother}>Build Another Story</button>
				</div>
			{/if}
		</div>
	</div>

{:else if phase === 'coaching'}
	<!-- Coaching two-column layout -->
	<div class="sb-coaching-layout">
		<div class="sb-coaching-main">
			<!-- Header -->
			<div class="sb-interview-header">
				<div class="sb-avatar-placeholder">&#10024;</div>
				<div style="flex: 1;">
					<h2>Story Coaching</h2>
					<div class="sb-mic-indicator {micState}">
						<div class="sb-mic-dot"></div>
						<span class="sb-mic-label">{micLabel}</span>
					</div>
				</div>
				<div class="sb-session-timer" class:warning={timerWarning}>
					{timerMinutes}:{timerSeconds}
				</div>
				<button class="sb-end-btn" on:click={handleEnd} disabled={loading}>Finish</button>
			</div>

			<!-- Messages -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="sb-messages"
				class:interruptable={isSpeaking}
				on:click={handleInterrupt}
			>
				{#each messages as msg}
					<div class="sb-message {msg.role}">
						<div class="sb-message-label">
							{msg.role === 'interviewer' ? '&#10024; Coach' : '&#128587; You'}
						</div>
						<div class="sb-message-content" class:typing={msg.role === 'interviewer' && !msg.content}>
							{msg.content || 'Thinking...'}
						</div>
					</div>
				{/each}
				{#if isListening && interimTranscript}
					<div class="sb-message candidate">
						<div class="sb-message-label">&#128587; You (speaking...)</div>
						<div class="sb-message-content interim">{interimTranscript}</div>
					</div>
				{/if}
				{#if loading}
					<div class="sb-message interviewer">
						<div class="sb-message-label">&#10024; Coach</div>
						<div class="sb-message-content typing">Thinking...</div>
					</div>
				{/if}
				<div bind:this={messagesEndEl}></div>
			</div>

			<!-- Input bar -->
			<form class="sb-input-bar" on:submit|preventDefault={handleSend}>
				<textarea
					value={voiceMode && isListening ? interimTranscript : input}
					on:input={(e) => { if (!isListening) input = e.currentTarget.value; }}
					placeholder={isListening ? 'Listening... tell me about your experience' : 'Or type here...'}
					rows="2"
					disabled={loading || isSpeaking}
					on:keydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
				></textarea>
				<button type="submit" disabled={loading || isSpeaking || (!input.trim() && !isListening)}>
					&#x2191;
				</button>
			</form>
		</div>

		<!-- Resize handle -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			bind:this={dragHandleEl}
			class="sb-coaching-resize-handle"
			on:mousedown={handleMouseDown}
		></div>

		<!-- STAR sidebar -->
		<div class="sb-coaching-sidebar" style="width: {sidebarWidth}px;">
			<div class="sb-star-progress-panel">
				<div class="sb-star-progress-header">
					<h3>Your Story</h3>
					<span class="sb-star-progress-count">{completedCount}/4</span>
				</div>
				{#each [{ key: 'situation', label: 'Situation' }, { key: 'task', label: 'Task' }, { key: 'action', label: 'Action' }, { key: 'result', label: 'Result' }] as section}
					<div class="sb-star-progress-section" class:filled={starSections[section.key]} class:empty={!starSections[section.key]}>
						<div class="sb-star-progress-label">
							<span class="sb-star-progress-dot">{starSections[section.key] ? '&#10003;' : '&#9675;'}</span>
							<span>{section.label}</span>
						</div>
						{#if starSections[section.key]}
							<div class="sb-star-progress-content">{starSections[section.key]}</div>
						{/if}
					</div>
				{/each}
				{#if completedCount === 0}
					<p class="sb-star-progress-hint">Sections will appear here as your coach helps you build each part of your story.</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	/* ── All styles scoped with sb- prefix to avoid conflicts with global styles ── */

	.sb-container {
		max-width: 768px;
		margin: 0 auto;
		padding: 24px 24px 0;
		min-height: calc(100vh - 50px);
		display: flex;
		flex-direction: column;
	}

	.sb-lobby {
		text-align: center;
		padding: 80px 24px;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.sb-lobby-icon { font-size: 2.5rem; margin-bottom: 16px; }
	.sb-lobby h1 {
		font-size: 1.75rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 8px;
	}
	.sb-lobby h2 {
		font-size: 1.3rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 8px;
	}
	.sb-lobby p {
		color: #666;
		max-width: 520px;
		margin-bottom: 28px;
		font-size: 0.95rem;
	}
	.sb-lobby-tips {
		background: #ffffff;
		border: 1px solid #e5e5e3;
		border-radius: 12px;
		padding: 20px 24px;
		text-align: left;
		max-width: 480px;
		margin-bottom: 28px;
	}
	.sb-lobby-tips h3 {
		font-size: 0.8rem;
		font-weight: 600;
		color: #b45309;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 10px;
		text-align: left;
	}
	.sb-lobby-tips li {
		color: #555;
		font-size: 0.9rem;
		margin-bottom: 4px;
		margin-left: 18px;
		list-style-type: disc;
	}

	.sb-start-btn {
		background: #c96442;
		color: white;
		border: none;
		padding: 12px 36px;
		border-radius: 24px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s, transform 0.1s;
	}
	.sb-start-btn:hover { background: #b5593a; transform: translateY(-1px); }
	.sb-start-btn:active { transform: translateY(0); }
	.sb-start-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

	/* ── Coaching Layout ── */
	.sb-coaching-layout {
		display: flex;
		min-height: calc(100vh - 50px);
	}
	.sb-coaching-main {
		flex: 1;
		min-width: 0;
		padding: 24px 24px 0;
		display: flex;
		flex-direction: column;
		min-height: calc(100vh - 50px);
		background: #f9f9f8;
	}
	.sb-coaching-sidebar {
		flex-shrink: 0;
		padding: 24px;
		overflow-y: auto;
		position: sticky;
		top: 50px;
		height: calc(100vh - 50px);
		background: #ffffff;
	}
	.sb-coaching-resize-handle {
		width: 6px;
		cursor: col-resize;
		background: transparent;
		position: relative;
		flex-shrink: 0;
		z-index: 10;
		transition: background 0.15s;
	}
	.sb-coaching-resize-handle::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 2px;
		width: 2px;
		background: #e5e5e3;
		transition: background 0.15s, width 0.15s;
	}
	.sb-coaching-resize-handle:hover::after,
	:global(.sb-coaching-resize-handle.dragging)::after {
		background: #c96442;
		width: 3px;
		left: 1px;
	}
	.sb-coaching-resize-handle:hover,
	:global(.sb-coaching-resize-handle.dragging) {
		background: rgba(201, 100, 66, 0.06);
	}

	/* ── Interview Header ── */
	.sb-interview-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid #e5e5e3;
		margin-bottom: 8px;
		position: sticky;
		top: 50px;
		background: #f9f9f8;
		z-index: 100;
	}
	.sb-avatar-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #f0ebe4;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
	}
	.sb-interview-header h2 {
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a1a;
		text-align: left;
		margin: 0;
	}
	.sb-session-timer {
		font-size: 0.9rem;
		font-weight: 600;
		color: #888;
		font-variant-numeric: tabular-nums;
		padding: 4px 12px;
		border-radius: 16px;
		background: #f0ebe4;
	}
	.sb-session-timer.warning {
		color: #dc2626;
		background: #fef2f2;
	}
	.sb-end-btn {
		background: transparent;
		color: #c96442;
		border: 1px solid #e5e5e3;
		padding: 6px 16px;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	.sb-end-btn:hover {
		background: #fef2f2;
		border-color: #c96442;
	}

	/* ── Mic Indicator ── */
	.sb-mic-indicator {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 2px;
	}
	.sb-mic-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ccc;
		transition: background 0.3s;
	}
	.sb-mic-indicator.listening .sb-mic-dot {
		background: #16a34a;
		animation: sb-mic-pulse 1.2s ease-in-out infinite;
	}
	.sb-mic-indicator.speaking .sb-mic-dot {
		background: #c96442;
		animation: sb-mic-pulse 0.8s ease-in-out infinite;
	}
	.sb-mic-indicator.processing .sb-mic-dot {
		background: #d97706;
		animation: sb-mic-pulse 0.6s ease-in-out infinite;
	}
	@keyframes sb-mic-pulse {
		0%, 100% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.5); opacity: 0.5; }
	}
	.sb-mic-label {
		font-size: 0.7rem;
		color: #999;
		font-weight: 500;
	}
	.sb-mic-indicator.listening .sb-mic-label { color: #16a34a; }
	.sb-mic-indicator.speaking .sb-mic-label { color: #c96442; }
	.sb-mic-indicator.processing .sb-mic-label { color: #d97706; }

	/* ── Messages ── */
	.sb-messages {
		flex: 1;
		overflow-y: auto;
		padding: 16px 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.sb-messages.interruptable { cursor: pointer; }
	.sb-message { max-width: 100%; }
	.sb-message-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #999;
		margin-bottom: 4px;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.sb-message-content {
		padding: 0;
		font-size: 0.95rem;
		line-height: 1.7;
		white-space: pre-wrap;
		color: #2d2d2d;
	}
	.sb-message.interviewer .sb-message-content {
		border-left: 3px solid #c96442;
		padding: 8px 0 8px 16px;
		color: #1a1a1a;
	}
	.sb-message.candidate .sb-message-content {
		background: #f0ebe4;
		border-radius: 12px;
		padding: 12px 16px;
		color: #2d2d2d;
	}
	.sb-message-content.typing {
		color: #999;
		font-style: italic;
	}
	.sb-message-content.interim {
		opacity: 0.6;
		background: #f5f0ea;
		border: 1px dashed #d4c9be;
		border-radius: 12px;
		padding: 12px 16px;
	}

	/* ── Input Bar ── */
	.sb-input-bar {
		display: flex;
		gap: 10px;
		padding: 16px 0;
		border-top: 1px solid #e5e5e3;
		position: sticky;
		bottom: 0;
		background: #f9f9f8;
	}
	.sb-input-bar textarea {
		flex: 1;
		background: #ffffff;
		border: 1px solid #e5e5e3;
		border-radius: 20px;
		padding: 10px 16px;
		color: #2d2d2d;
		font-family: inherit;
		font-size: 0.9rem;
		resize: none;
	}
	.sb-input-bar textarea:focus {
		outline: none;
		border-color: #c96442;
		box-shadow: 0 0 0 2px rgba(201, 100, 66, 0.12);
	}
	.sb-input-bar button {
		background: #c96442;
		color: white;
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		font-weight: 600;
		font-size: 1.1rem;
		cursor: pointer;
		align-self: flex-end;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sb-input-bar button:disabled { opacity: 0.3; cursor: not-allowed; }
	.sb-input-bar button:hover:not(:disabled) { background: #b5593a; }

	/* ── STAR Progress Panel ── */
	.sb-star-progress-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		padding-bottom: 12px;
		border-bottom: 1px solid #e5e5e3;
	}
	.sb-star-progress-header h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a1a;
		text-align: left;
	}
	.sb-star-progress-count {
		font-size: 0.8rem;
		font-weight: 600;
		color: #c96442;
		background: #fef2f2;
		padding: 2px 10px;
		border-radius: 12px;
	}
	.sb-star-progress-section {
		margin-bottom: 16px;
		border-radius: 10px;
		padding: 12px 14px;
		transition: all 0.3s ease;
	}
	.sb-star-progress-section.empty {
		background: #f9f9f8;
		border: 1px dashed #e5e5e3;
	}
	.sb-star-progress-section.filled {
		background: #faf8f5;
		border: 1px solid #e5e5e3;
		animation: sb-section-fill 0.6s ease;
	}
	@keyframes sb-section-fill {
		0% { background: #fef3e2; border-color: #c96442; box-shadow: 0 0 0 2px rgba(201, 100, 66, 0.19); }
		100% { background: #faf8f5; border-color: #e5e5e3; box-shadow: none; }
	}
	.sb-star-progress-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 4px;
	}
	.sb-star-progress-section.empty .sb-star-progress-label { color: #bbb; }
	.sb-star-progress-section.filled .sb-star-progress-label { color: #c96442; }
	.sb-star-progress-dot { font-size: 0.85rem; }
	.sb-star-progress-section.filled .sb-star-progress-dot { color: #16a34a; }
	.sb-star-progress-content {
		font-size: 0.85rem;
		line-height: 1.6;
		color: #2d2d2d;
		margin-top: 6px;
		white-space: pre-wrap;
	}
	.sb-star-progress-hint {
		color: #bbb;
		font-size: 0.8rem;
		font-style: italic;
		text-align: center;
		margin-top: 24px;
		line-height: 1.5;
	}

	/* ── Report Layout ── */
	.sb-report-layout {
		display: flex;
		gap: 32px;
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px 24px 0;
		min-height: calc(100vh - 50px);
	}
	.sb-report-sidebar {
		width: 320px;
		flex-shrink: 0;
		position: sticky;
		top: 74px;
		align-self: flex-start;
		max-height: calc(100vh - 98px);
		overflow-y: auto;
	}
	.sb-report-main {
		flex: 1;
		min-width: 0;
	}

	/* ── Scorecard ── */
	.sb-scorecard { padding: 32px 0; }
	.sb-scorecard h2 {
		font-size: 1.5rem;
		font-weight: 600;
		text-align: center;
		color: #1a1a1a;
		margin-bottom: 24px;
	}
	.sb-score-section {
		background: #ffffff;
		border: 1px solid #e5e5e3;
		border-radius: 12px;
		padding: 20px 24px;
		margin-bottom: 12px;
	}
	.sb-score-section h3 {
		font-size: 0.8rem;
		font-weight: 600;
		color: #b45309;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 12px;
		text-align: left;
	}
	.sb-full-story {
		background: #faf8f5;
		border: 1px solid #e5e5e3;
		border-radius: 8px;
		padding: 16px 20px;
		color: #2d2d2d;
		font-size: 0.95rem;
		line-height: 1.7;
		white-space: pre-wrap;
	}
	.sb-scorecard-actions {
		text-align: center;
		padding: 24px 0;
	}

	/* ── Talking Points Panel ── */
	.sb-talking-points-panel {
		background: #fff;
		border: 1px solid #e5e5e3;
		border-radius: 16px;
		padding: 24px;
	}
	.sb-talking-points-panel h3 {
		font-size: 1.1rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 4px;
		text-align: left;
	}
	.sb-talking-points-subtitle {
		font-size: 0.8rem;
		color: #888;
		margin-bottom: 20px;
		line-height: 1.4;
	}
	.sb-talking-points-hint {
		color: #888;
		font-size: 0.85rem;
		font-style: italic;
	}
	.sb-talking-points-section { margin-bottom: 18px; }
	.sb-talking-points-section:last-child { margin-bottom: 0; }
	.sb-talking-points-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #b45309;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 6px;
	}
	.sb-talking-points-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.sb-talking-points-list li {
		position: relative;
		padding-left: 16px;
		font-size: 0.9rem;
		color: #2d2d2d;
		line-height: 1.5;
		margin-bottom: 4px;
	}
	.sb-talking-points-list li::before {
		content: '\2022';
		position: absolute;
		left: 0;
		color: #c96442;
		font-weight: bold;
	}

	/* ── Responsive ── */
	@media (max-width: 1024px) {
		.sb-coaching-layout { flex-direction: column; }
		.sb-coaching-main { max-width: 100%; }
		.sb-coaching-sidebar {
			width: 100% !important;
			height: auto;
			position: relative;
			top: 0;
			border-top: 1px solid #e5e5e3;
			max-height: 300px;
		}
		.sb-coaching-resize-handle { display: none; }
		.sb-report-layout { flex-direction: column; padding: 16px; }
		.sb-report-sidebar { width: 100%; position: static; max-height: none; }
	}
	@media (max-width: 600px) {
		.sb-container { padding: 16px 16px 0; }
		.sb-coaching-main { padding: 16px 16px 0; }
	}
</style>
