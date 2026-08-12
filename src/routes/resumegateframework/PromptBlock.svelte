<script lang="ts">
	export let code: string;

	let copied = false;
	let copyTimer: ReturnType<typeof setTimeout>;

	async function copy() {
		await navigator.clipboard.writeText(code);
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="prompt-block">
	<button class="copy-btn" type="button" on:click={copy}>
		{copied ? 'Copied!' : 'Copy'}
	</button>
	<pre>{code}</pre>
</div>

<style lang="scss">
	@import '../../lib/styles/colors.scss';

	.prompt-block {
		position: relative;
		background: $white;
		border: 1px solid #ece7f0;
		border-radius: $card-radius;
		box-shadow: $card-shadow;
		margin: 20px 0;
	}

	pre {
		margin: 0;
		padding: 40px 20px 20px;
		max-height: 420px;
		overflow-y: auto;
		overflow-x: auto;
		overscroll-behavior: contain;
		color: $text-dark;
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 13px;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.copy-btn {
		position: absolute;
		top: 0px;
		right: 12px;
		background: $bg-peach;
		color: $primary;
		border: 1px solid rgba(232, 115, 90, 0.25);
		border-radius: 8px;
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;

		&:hover {
			background: #ffe4da;
		}
	}
</style>
