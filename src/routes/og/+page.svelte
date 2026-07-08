<script lang="ts">
	// Hidden route used only to render/screenshot the 1200x630 Open Graph image.
	// Not linked anywhere, noindex, and disallowed in robots.txt.
	import yijunProfile from '$lib/assets/yijun-profile.png';
</script>

<svelte:head>
	<title>OG image source</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<!-- Exactly 1200x630 — screenshot this card and save as static/og-image.png -->
<div class="og-card">
	<div class="og-left">
		<span class="og-pill">Meet Your Interview Therapist</span>
		<h1 class="og-headline">Are Your Stories<br />Interview-Ready?</h1>
		<p class="og-sub">
			Build interview-ready <strong>STAR stories</strong> with an AI coach — trained by Yijun,
			who's coached <strong>600+</strong> candidates through behavioral rounds.
		</p>
		<p class="og-credential">Sr. TPM at FAANG · 10+ years · mockinterview.tech</p>
	</div>

	<div class="og-right">
		<img src={yijunProfile} alt="Yijun Wang" class="og-portrait" />
		<div class="og-mini-card">
			<div class="og-mini-header">
				<span class="og-mini-dot"></span>
				<span>LIVE COACHING</span>
			</div>
			<p class="og-mini-msg">"What impact did that have on the business?"</p>
			<div class="og-star-row">
				<span class="og-star s">S</span>
				<span class="og-star t">T</span>
				<span class="og-star a">A</span>
				<span class="og-star r">R</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	/* Hide the global nav/chrome so the capture is clean */
	:global(nav) { display: none !important; }
	:global(html), :global(body) { height: 630px !important; overflow: hidden !important; }
	:global(body), :global(.container) { margin: 0 !important; padding: 0 !important; background: #fff; }

	.og-card {
		position: fixed;
		top: 0;
		left: 0;
		width: 1200px;
		height: 630px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 40px;
		padding: 0 72px;
		overflow: hidden;
		background: linear-gradient(135deg, #FFF2EB 0%, #F0E6FF 50%, #FFF8F0 100%);
		font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
		z-index: 99999;
	}

	.og-left {
		flex: 1 1 58%;
		min-width: 0;
	}

	.og-pill {
		display: inline-block;
		background: rgba(255, 255, 255, 0.75);
		color: #E8735A;
		font-weight: 700;
		font-size: 20px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 10px 20px;
		border-radius: 40px;
		margin-bottom: 28px;
	}

	.og-headline {
		font-size: 72px;
		line-height: 1.04;
		font-weight: 800;
		color: #2A2A38;
		margin: 0 0 24px;
		letter-spacing: -0.02em;
	}

	.og-sub {
		font-size: 25px;
		line-height: 1.45;
		color: #4A4A57;
		margin: 0 0 28px;
		max-width: 560px;

		strong { color: #E8735A; }
	}

	.og-credential {
		font-size: 19px;
		font-weight: 600;
		color: #8A8496;
		margin: 0;
	}

	.og-right {
		position: relative;
		flex: 0 0 380px;
		height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.og-portrait {
		height: 560px;
		width: auto;
		object-fit: contain;
		object-position: bottom;
	}

	.og-mini-card {
		position: absolute;
		bottom: 40px;
		left: -60px;
		width: 320px;
		background: #fff;
		border-radius: 16px;
		padding: 16px 18px;
		box-shadow: 0 12px 40px rgba(80, 40, 120, 0.18);
	}

	.og-mini-header {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #6B6577;
		margin-bottom: 8px;
	}

	.og-mini-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #22C55E;
	}

	.og-mini-msg {
		font-size: 17px;
		font-style: italic;
		color: #2A2A38;
		margin: 0 0 12px;
		line-height: 1.3;
	}

	.og-star-row {
		display: flex;
		gap: 8px;
	}

	.og-star {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 16px;
		color: #fff;
	}
	.og-star.s { background: #22C55E; }
	.og-star.t { background: #22C55E; }
	.og-star.a { background: #FFD93D; color: #7A5C00; }
	.og-star.r { background: #D9D4DE; color: #8A8496; }
</style>
