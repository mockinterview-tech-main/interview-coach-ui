<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/userStore';
	import Card, { PrimaryAction } from '@smui/card';

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

<section class="jumbotron">
	{#if $userStore.subscriptionID}
		<h1>Manage Subscription</h1>
	{:else}
		<h1>Buy Interview Credits</h1>
	{/if}
</section>

<div>
	{#if $userStore.subscriptionID}
		<div>
			<Card class="pay-card">
				<PrimaryAction
					on:click={() => {
						goto(data.manageLink);
					}}
				>
					<div>
						<h3>Manage Subscription</h3>
						<p>
							Subscriptions are managed through Stripe. You'll log in with them to manage your
							payment information and subscription details.
						</p>
					</div>
				</PrimaryAction>
			</Card>
		</div>
	{:else}
		{#each offerings as offering}
			<Card class="pay-card">
				<PrimaryAction
					on:click={() => {
						initPurchase(offering.sku);
					}}
				>
					<form id={offering.sku} action="?/purchase" method="POST">
						<h3>{offering.label}</h3>
						<p>{offering.description}</p>
						<input type="hidden" name="chosenOffering" value={JSON.stringify(offering)} />
						<h3 class="price-tag">${offering.price}.00</h3>
					</form>
				</PrimaryAction>
			</Card>
		{/each}
	{/if}
</div>

<style lang="scss">
	@import '$lib/styles/colors.scss';

	.jumbotron {
		position: relative;
		color: $white;
		z-index: 100;
		padding: 100px 0px;
		margin-bottom: 50px;
		width: 100vw;
		background-color: transparent; /* No direct background on the jumbotron */
		h1 {
			font-size: 42px;
			padding-left: 40px;
		}

		/* Blurred version of the background */
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: -2; /* Ensure it's below the content */
			background-image: url('$lib/assets/jumbotron.jpg');
			background-size: cover;
			background-position: center;
		}
	}

	div {
		display: flex;
		justify-content: space-around;
		flex-flow: row wrap;
		align-items: center;
		form,
		div {
			flex: 1;
			overflow: hidden;
			width: 300px;
			padding: 20px;
			text-align: center;
		}
	}

	@media only screen and (max-width: 1020px) {
		div {
			flex-flow: column nowrap;
			& :global(.pay-card) {
				margin: 10px;
			}
		}
	}
</style>
