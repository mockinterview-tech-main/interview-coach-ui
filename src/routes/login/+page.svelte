<script lang="ts">
    import Button from '@smui/button';
    import Card from '@smui/card';

    import { browser } from '$app/environment';
    import type { PageData } from './$types';
    import googleGLogo from '$lib/assets/logos/googleLogo.svg'
    import githubLogo from '$lib/assets/logos/githubLogo.svg'
    export let data: PageData;
    export let form;

    let providers = data;

    let isSignup = true;

    const toggleIsSignup = () => isSignup = !isSignup

    const logos: { [key: string]: string } = {
        'google': googleGLogo,
        'github': githubLogo,
    }

    const gotoAuthProvider = (name: string) => {
        if (browser) {
            if( providers[name] ){
                document.cookie = `state=${providers[name].authProviderState}`;
                document.cookie = `cv=${providers[name].authCodeVerifier}`;
                document.cookie = `prov=${name}`
            }
        }
        window.location.href = providers[name].authProviderRedirect || '';
    }
</script>

<p class="error">{#if form?.error}{form.message}{/if}</p>


<div class="form-container">
    <Card padded>
        <div class="action-selector">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <p class={isSignup ? "active-action-tab" : ""} on:click={toggleIsSignup}>Sign Up</p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <p class={isSignup ? "" : "active-action-tab"} on:click={toggleIsSignup}>Log In</p>
        </div>
        <div class="action-form">
            {#if isSignup}
                <form method="POST" action="?/signup">
                    <label for="email">email</label><br/>
                    <input name="email" type="email" placeholder="email" required/><br/>
                    <label for="password">password</label><br/>
                    <input name="password" type="password" placeholder="password" minlength=8 required/><br/>
                    <label for="passwordConfirm">confirm</label><br/>
                    <input name="passwordConfirm" type="password" placeholder="password" minlength=8 required/><br/>
                    <Button class="cta-button" type="submit">Sign Up</Button>
                </form>
            {:else}
                <form method="POST" action="?/login">
                    <label for="email">email</label><br/>
                    <input name="email" type="email" placeholder="email" required/><br/>
                    <label for="password">password</label><br/>
                    <input name="password" type="password" placeholder="password" required/><br/>
                    <Button class="cta-button" type="submit">Login</Button>
                </form>
            {/if}
        </div>
        <div class="social-container">
            {#each Object.keys(providers) as provider}
                {#if providers[provider].authProviderState}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <div>
                        <img src={logos[provider]} alt="{provider} logo" on:click={() => gotoAuthProvider(provider)}/>
                        <p>{provider}</p>
                    </div>
                {/if}
            {/each}
        </div>
    </Card>
</div>

<style lang="scss">
    @import "$lib/styles/colors.scss";
    .error {
        padding: 40px;
        position: absolute;
        top: 40px;
        color: red;
    }
    .form-container {
        width: 50%;
        margin: auto;
        position: relative;
        top: 100px;
        text-align: center;

        .action-selector {
            display: flex;
            flex-flow: row nowrap;
            margin: none;
            text-wrap: nowrap;
            cursor: pointer;
            border-bottom: 1px solid $dark-purple;
            p {
                margin: 0;
                flex: 1;
                text-align: center;
                line-height: 50px;
                color: $light-purple;
            }
            p:hover {
                background-color: $dark-purple;
                color: white;
                transition: background-color 0.2s ease-in-out;
                transition: color 0.2s ease-in-out;
            }
            .active-action-tab {
                background-color: $dark-purple;
                color: white;
            }
        }
        .action-form { 
            padding: 20px 0px; 
            text-align: center;
            & :global(.cta-button) {
                margin: auto
            }
        }
        .social-container {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-evenly;
            img {
                cursor: pointer;
                width: 50px;
                height: 50px;
                
            }
        }
    }
</style>