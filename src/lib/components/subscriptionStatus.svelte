<script lang="ts">
	import { userStore } from '$lib/stores/userStore';

	export let subscriptionCancelAt: Date | null | undefined;
	export let subscriptionID: string | null | undefined;
	export let credits: number;

	$: {
		subscriptionCancelAt;
		subscriptionID;
		credits;
	}

	const cancelSubscription = async () => {
		if (confirm(`Are you sure? You'll still have access until the end of your billing cycle.`)) {
			const response = await fetch('/subscription/cancel', {
				method: 'PUT',
				body: JSON.stringify({ subscriptionID: subscriptionID, action: 'cancel' }),
				headers: { 'content-type': 'application/json' }
			});
			({ subscriptionCancelAt } = await response.json());
			if (subscriptionCancelAt) {
				alert("We're sorry to see you go, your subscription will cancel at the end of the month.");
				userStore.set({ ...$userStore, subscriptionCancelAt });
			}
		}
	};

	const restoreSubscription = async () => {
		if (confirm(`Are you sure? If so, we'll continue billing you monthly.`)) {
			const response = await fetch('/subscription/restore', {
				method: 'PUT',
				body: JSON.stringify({ subscriptionID: subscriptionID, action: 'restore' }),
				headers: { 'content-type': 'application/json' }
			});
			const { restored } = await response.json();
			if (restored) {
				alert('Thank you for reinstating your subscription!');
				userStore.set({ ...$userStore, subscriptionCancelAt: null });
				subscriptionCancelAt = null;
			}
		}
	};
</script>

{#if subscriptionID}
	{#if subscriptionCancelAt}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span
			class="nav-link"
			on:click={() => {
				restoreSubscription();
			}}
		>
			<a href="/">Restore Subscription</a>
		</span>
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span
			class="nav-link"
			on:click={() => {
				cancelSubscription();
			}}
		>
			<a href="/">Cancel Subscription</a>
		</span>
	{/if}
{:else}
	<span class="nav-link"><a href="/credits">Subscribe</a></span>
	{#if $userStore.credits === 0}
		<span class="nav-link"><a href="/credits">Buy Credits</a></span>
	{:else}
		<span class="nav-link"><a href="/credits">{credits} Interviews</a></span>
	{/if}
{/if}

<style lang="scss">
	@import '$lib/styles/colors.scss';
	.nav-link {
		margin-right: 20px;
		a {
			color: $text-dark;
			text-decoration: none;
			font-weight: 600;
			font-size: 15px;
			transition: color 0.2s;
			&:hover {
				color: $primary;
			}
		}
	}
</style>
