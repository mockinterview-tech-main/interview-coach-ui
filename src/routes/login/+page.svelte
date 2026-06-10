<script lang="ts">
	import googleGLogo from '$lib/assets/logos/googleLogo.svg';

	export let form;
</script>

<p class="error">
	{#if form?.error}<span class="error-text">{form.message}</span>{/if}
</p>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<h2>Welcome</h2>
			<p>Sign in to start building better interview stories</p>
		</div>

		<form method="POST" action="?/google">
			<button type="submit" class="google-btn">
				<img src={googleGLogo} alt="Google logo" />
				<span>Continue with Google</span>
			</button>
		</form>
	</div>
</div>

<style lang="scss">
	@import '$lib/styles/colors.scss';

	.error {
		position: fixed;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
	}
	.error-text { color: #e53e3e; font-weight: 500; }

	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 120px);
		padding: 0px;
		background: $bg-warm;
	}

	.login-card {
		width: 100%;
		max-width: 420px;
		background: white;
		border-radius: $card-radius;
		box-shadow: $card-shadow;
		padding: 40px 36px;
	}

	.login-header {
		text-align: center;
		margin-bottom: 28px;
		h2 {
			font-size: 26px;
			font-weight: 700;
			color: $text-dark;
			margin: 0 0 6px;
		}
		p {
			color: $text-light;
			font-size: 14px;
			margin: 0;
		}
	}

	.google-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
		padding: 14px 24px;
		border: 2px solid rgba(45, 43, 61, 0.1);
		border-radius: 50px;
		background: white;
		cursor: pointer;
		font-size: 15px;
		font-weight: 600;
		font-family: inherit;
		color: $text-dark;
		transition: border-color 0.2s, transform 0.2s;

		&:hover {
			border-color: $primary;
			transform: translateY(-1px);
		}
		img {
			width: 20px;
			height: 20px;
		}
	}
</style>
