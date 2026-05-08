<script lang="ts">
	let email = '';
	let showSuccess = false;

	const PDF_DOWNLOAD_URL =
		'https://drive.google.com/uc?export=download&id=1x5bQIZWlqtOF5zhxAZgOvnD2CLYHkrYF';
	const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgodnyla';
	const CAL_LINK = 'yijun-interview-therapist/30min-free-narrative-audit';

	function handleSubmit() {
		if (!email) return;

		showSuccess = true;

		// Trigger PDF download
		const link = document.createElement('a');
		link.href = PDF_DOWNLOAD_URL;
		link.download = '';
		link.target = '_blank';
		link.rel = 'noopener';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Fire-and-forget email capture
		fetch(FORMSPREE_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({ email, _subject: 'New lead: ' + email })
		}).catch((err) => console.error('Formspree error:', err));
	}

	function handleSchedule() {
		// @ts-ignore
		if (window.Cal) {
			// @ts-ignore
			window.Cal('openModal', { calLink: CAL_LINK });
		} else {
			window.open('https://cal.com/' + CAL_LINK, '_blank');
		}
	}
</script>

<svelte:head>
	<title>Free Narrative Audit — Mock Interview Therapist</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
	<script src="https://app.cal.com/embed/embed.js" async></script>
</svelte:head>

<main class="main">
	<h2>Your narratives can be more impactful!</h2>
	<p class="lead">Enter your email to receive the 1-page Narrative Symptom Checklist.</p>

	{#if !showSuccess}
		<form class="email-form" on:submit|preventDefault={handleSubmit}>
			<input type="email" bind:value={email} placeholder="you@example.com" required />
			<button type="submit">Download</button>
		</form>
		<p class="hint">Next, unlock a complimentary 30-minute session with me</p>
	{:else}
		<div class="success-msg">
			<h3>Your download is starting!</h3>
			<p>Now book your free 30-minute <b>Narrative Audit</b>.</p>
			<button class="btn-schedule" on:click={handleSchedule}>Book Your Free Session</button>
		</div>
	{/if}
</main>

<hr class="divider" />

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: Inter, Arial, Helvetica, sans-serif;
		background: #fff;
		color: #000;
		font-size: medium;
		min-height: 100vh;
	}

	/* ── MAIN CONTENT ── */
	.main {
		max-width: 600px;
		margin: 0 auto;
		margin-top: 100px;
		padding: 3.5rem 2rem;
		text-align: center;
	}

	.main h2 {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 2rem;
		margin-bottom: 0.75rem;
		color: #000;
	}

	.main .lead {
		font-size: 1rem;
		color: #676778;
		margin-bottom: 2.5rem;
		line-height: 1.5rem;
	}

	/* ── FORM ── */
	.email-form {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
		align-items: center;
	}

	.email-form input[type='email'] {
		flex: 1;
		padding: 10px;
		border: 1px solid #a40080;
		border-radius: 4px;
		background: #fff;
		color: #000;
		font-size: 1rem;
		font-family: inherit;
		line-height: 20px;
		outline: none;
		transition: border-color 0.2s;

		&::placeholder {
			color: rgba(0, 0, 0, 0.38);
		}

		&:focus {
			border-color: #a40080;
		}
	}

	.email-form button {
		padding: 10px 20px;
		background: #a40080;
		color: #fff;
		border: 2px solid transparent;
		border-radius: 4px;
		font-size: 16px;
		font-weight: 700;
		font-family: inherit;
		letter-spacing: 0.0892857143em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color 0.3s, border-color 0.3s;
		white-space: nowrap;
		height: 36px;
		display: inline-flex;
		align-items: center;

		&:hover {
			background: #c0009a;
		}
	}

	.hint {
		font-size: 0.875rem;
		color: #676778;
	}

	/* ── SUCCESS ── */
	.success-msg {
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-top: 3px solid #a40080;
		border-radius: 4px;
		padding: 2rem;
		margin-top: 1rem;
		text-align: center;

		h3 {
			font-size: 1.25rem;
			font-weight: 700;
			color: #000;
			margin-bottom: 0.6rem;
			line-height: 1.75rem;
		}

		p {
			color: #676778;
			margin-bottom: 1.5rem;
			line-height: 1.5rem;
			font-size: 1rem;
		}
	}

	.btn-schedule {
		display: inline-flex;
		align-items: center;
		padding: 10px 20px;
		background: #a40080;
		color: #fff;
		border: 2px solid transparent;
		border-radius: 4px;
		font-size: 16px;
		font-weight: 700;
		font-family: inherit;
		letter-spacing: 0.0892857143em;
		text-transform: uppercase;
		cursor: pointer;
		text-decoration: none;
		transition: background-color 0.3s, border-color 0.3s;
		height: 36px;

		&:hover {
			background: #c0009a;
		}
	}

	/* ── DIVIDER ── */
	.divider {
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.12);
		margin: 0;
	}

	@media (max-width: 500px) {
		.main {
			padding: 2.5rem 1.25rem;
		}

		.main h2 {
			font-size: 1.6rem;
		}

		.email-form {
			flex-direction: column;
			align-items: stretch;
		}

		.email-form button {
			justify-content: center;
			height: auto;
			padding: 10px 20px;
		}
	}
</style>
