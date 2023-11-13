<script lang="ts">
    import { browser } from '$app/environment';
    import type { PageData } from './$types';
    import googleGLogo from '$lib/assets/logos/googleLogo.svg'
    import githubLogo from '$lib/assets/logos/githubLogo.svg'
    export let data: PageData;
    export let form;

    let providers = data;

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

<div>
    <div class="form-container">
        <h2>Sign Up</h2>
        <form method="POST" action="?/signup">
            <label for="email">email address</label><br/>
            <input name="email" type="email" placeholder="email@address.com" required/><br/>
            <label for="password">password</label><br/>
            <input name="password" type="password" placeholder="secret password" minlength=8 required/><br/>
            <label for="passwordConfirm">confirm password</label><br/>
            <input name="passwordConfirm" type="password" placeholder="secret password" minlength=8 required/><br/>
            <button type="submit">Sign Up</button>
        </form>
    </div>
    <div class="form-container">
        <h2>Log In</h2>
        <form method="POST" action="?/login">
            <label for="email">email address</label><br/>
            <input name="email" type="email" placeholder="email@address.com" required/><br/>
            <label for="password">password</label><br/>
            <input name="password" type="password" placeholder="secret password" required/><br/>
            <button type="submit">Login</button>
        </form>
    </div>

    <div class="form-container">
        <h2>Social Login</h2>
        {#each Object.keys(providers) as provider}
            {#if providers[provider].authProviderState}
                <button class="social-button" on:click={() => gotoAuthProvider(provider)}><img width="20px" height="20px" src={logos[provider]} alt="{provider} logo"/>Login with {provider}</button>
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/colors.scss";
    .error {
        padding: 40px;
        position: absolute;
        top: 40px;
        color: red;
    }
    div {
        padding: 70px 20px;
        display: flex;

        .form-container {
            flex-direction: column;
            flex: 1;
            button {
                background: none;
                border-color: $dark-purple;
                color: $dark-gray;
            }
                
            button:hover {
                background-color: $dark-purple;
                color: $white;
            }

            .social-button {
                margin: 16px 0px;
            }

            button img {
                width: 24px;
                height: 24px;
                margin-right: 10px;
            }
        }
        
    }
</style>