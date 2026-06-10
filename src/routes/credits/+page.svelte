<script lang="ts">
	import { userStore } from '$lib/stores/userStore';

	export let data;

	const offerings = data.offerings;

	const initPurchase = (sku: string) => {
		if (document) {
			const form = document.getElementById(sku);
			if (form && form instanceof HTMLFormElement) {
				form.submit();
			}
		}
	};
</script>

<div class="credits-page">
	<div class="credits-back-row">
		<a href="/dashboard" class="credits-back">&larr; Dashboard</a>
	</div>
	<div class="credits-inner">

		{#if $userStore.subscriptionID}
			<div class="credits-header">
				<h1>You're on Monthly Unlimited</h1>
				<p class="credits-subtitle">You currently have unlimited coaching sessions.</p>
			</div>

			<div class="credits-active">
				<div class="credits-active-top">
					<span class="credits-active-badge">Active</span>
					<span>Monthly Unlimited — $30/month</span>
				</div>
				{#if data.subscriptionRenewAt}
					<span class="credits-renew">Renews on {data.subscriptionRenewAt}</span>
				{/if}
			</div>

			<a href="/credits/api/portal" class="credits-manage-link">Cancel subscription &rarr;</a>
		{:else}
			<div class="credits-header">
				<h1>Get Interview Credits</h1>
				<p class="credits-subtitle">Choose a plan that works for you.</p>
			</div>

			<div class="credits-cards">
				{#each offerings as offering}
					<button class="credits-card" class:credits-card-featured={offering.type === 'subscription'} on:click={() => initPurchase(offering.sku)}>
						<form id={offering.sku} action="?/purchase" method="POST">
							<input type="hidden" name="chosenOffering" value={JSON.stringify(offering)} />
						</form>
						{#if offering.type === 'subscription'}
							<span class="credits-badge">Best Value</span>
						{/if}
						<div class="credits-card-top">
							<h2>{offering.label}</h2>
							<p class="credits-desc">{offering.description}</p>
						</div>
						<div class="credits-price">
							<span class="credits-amount">${offering.price}</span>
							<span class="credits-period">{offering.type === 'subscription' ? '/month' : ''}</span>
						</div>
						<div class="credits-divider"></div>
						<ul class="credits-features">
							{#each offering.features as feature}
								<li><span class="credits-check">✓</span> {feature}</li>
							{/each}
						</ul>
						{#if offering.type === 'subscription'}
							<p class="credits-cancel-note">Cancel anytime. Access continues through the end of billing period — no partial refunds.</p>
						{/if}
						<div class="credits-card-cta">
							{offering.type === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@import '$lib/styles/colors.scss';

	.credits-page {
		min-height: 100vh;
		background: $bg-warm;
	}

	.credits-back-row {
		max-width: 1200px;
		margin: 0 auto;
		padding: 68px 20px 0;
	}

	.credits-inner {
		max-width: 900px;
		margin: 0 auto;
		padding: 32px 24px 60px;
	}

	.credits-back {
		display: inline-block;
		padding: 10px 24px;
		font-size: 0.9rem;
		font-weight: 600;
		color: #c96442;
		text-decoration: none;
		border: 1px solid #c96442;
		border-radius: 24px;
		transition: all 0.2s;
		margin-bottom: 32px;
		&:hover {
			background: #c96442;
			color: white;
		}
	}

	.credits-header h1 {
		font-size: 1.8rem;
		font-weight: 700;
		color: $text-dark;
		margin: 0 0 8px;
	}
	.credits-subtitle {
		color: $text-light;
		font-size: 1rem;
		margin: 0;
	}

	.credits-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		margin-top: 8px;
	}

	.credits-card {
		position: relative;
		background: white;
		border-radius: 20px;
		padding: 36px 32px;
		box-shadow: $card-shadow;
		border: 2px solid transparent;
		cursor: pointer;
		text-align: center;
		transition: all 0.25s;
		display: flex;
		flex-direction: column;
		align-items: center;
		&:hover {
			border-color: #c96442;
			box-shadow: $card-shadow-hover;
			transform: translateY(-3px);
		}
	}
	.credits-card-featured {
		border-color: #f0e0d8;
	}

	.credits-card-top {
		margin-bottom: 4px;
	}

	.credits-card h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: $text-dark;
		margin: 12px 0 8px;
	}

	.credits-desc {
		color: $text-light;
		font-size: 0.88rem;
		line-height: 1.5;
		margin: 0;
		min-height: 2.8em;
	}

	.credits-price {
		margin: 16px 0;
	}
	.credits-amount {
		font-size: 2.8rem;
		font-weight: 800;
		color: $text-dark;
		letter-spacing: -0.02em;
	}
	.credits-period {
		font-size: 0.95rem;
		color: $text-light;
		margin-left: 2px;
	}

	.credits-divider {
		width: 48px;
		height: 2px;
		background: #f0ece6;
		border-radius: 1px;
		margin-bottom: 20px;
	}

	.credits-features {
		list-style: none;
		padding: 0;
		margin: 0 0 20px;
		text-align: left;
		width: 100%;
		li {
			font-size: 0.9rem;
			color: $text-medium;
			padding: 6px 0;
			display: flex;
			align-items: flex-start;
			gap: 10px;
		}
	}
	.credits-check {
		color: #2e7d32;
		font-weight: 700;
		font-size: 0.85rem;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.credits-badge {
		position: absolute;
		top: 18px;
		right: 18px;
		background: #c96442;
		color: white;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 5px 12px;
		border-radius: 14px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.credits-cancel-note {
		font-size: 0.78rem;
		color: $text-light;
		line-height: 1.5;
		margin: 0 0 16px;
		text-align: center;
	}

	.credits-card-cta {
		margin-top: auto;
		padding: 12px 36px;
		background: #c96442;
		color: white;
		font-size: 0.95rem;
		font-weight: 600;
		border-radius: 24px;
		transition: background 0.2s;
	}
	.credits-card:hover .credits-card-cta {
		background: #b5593a;
	}

	.credits-active {
		background: white;
		border-radius: 12px;
		padding: 20px 24px;
		box-shadow: $card-shadow;
		margin-top: 24px;
	}
	.credits-active-top {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 0.95rem;
		font-weight: 600;
		color: $text-dark;
	}
	.credits-renew {
		display: block;
		margin-top: 8px;
		font-size: 0.84rem;
		color: $text-light;
	}
	.credits-active-badge {
		background: #e8f5e9;
		color: #2e7d32;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 4px 10px;
		border-radius: 12px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.credits-manage-link {
		display: inline-block;
		margin-top: 16px;
		font-size: 0.82rem;
		color: #aaa;
		font-weight: 400;
		text-decoration: none;
		&:hover {
			color: #888;
			text-decoration: underline;
		}
	}

	@media (max-width: 650px) {
		.credits-cards {
			grid-template-columns: 1fr;
			max-width: 380px;
			margin-left: auto;
			margin-right: auto;
		}
		.credits-header h1 {
			font-size: 1.5rem;
		}
	}
</style>
