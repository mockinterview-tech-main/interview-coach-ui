<script lang="ts">
    import { browser } from '$app/environment';
    import type { PageData } from './$types';
    import googleGLogo from '../../lib/assets/googleLogo.svg'
    export let data: PageData;

    let providers = data;

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

<div>
    <div class="form">
        <h2>Sign Up</h2>
        <form method="POST" action="?/signup">
            <label for="email">email address</label><br/><input name="email" type="email" placeholder="email@address.com" required/><br/>
            <label for="password">password</label><br/><input name="password" type="password" placeholder="secret password" required/><br/>
            <label for="passwordConfirm">confirm password</label><br/><input name="passwordConfirm" type="password" placeholder="secret password" required/><br/>
            <button type="submit">Sign Up</button>
        </form>
    </div>
    <div class="form">
        <h2>Log In</h2>
        <form method="POST" action="?/login">
            <label for="email">email address</label><br/><input name="email" type="email" placeholder="email@address.com" required/><br/>
            <label for="password">password</label><br/><input name="password" type="password" placeholder="secret passphrase" required/><br/>
            <button type="submit">Login</button>
        </form>
    </div>

    <div class="form">
        <h2>Social Login</h2>
        {#each Object.keys(providers) as provider}
            {#if providers[provider].authProviderState}
                <button class="social-button" on:click={() => gotoAuthProvider(provider)}><img width="20px" height="20px" src={googleGLogo} alt="Google Logo">Login with {provider}</button>
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">
    div {
        padding: 60px 20px;
        display: flex;

        .form {
            flex-direction: column;
            flex: 1;
            label {
                margin-bottom: 5px;
            }
            input {
                width: 50%;
                line-height: 20px;
                margin-bottom: 20px;
                border: 1px solid #A40080;
                padding: 10px;
                border-radius: 4px;
            }
            input:focus {
                border: 1px solid #A40080;
            }
            button {
                display: flex;
                align-items: center;
                padding: 10px 20px;
                border: 2px solid transparent;
                cursor: pointer;
                font-weight: bold;
                border-radius: 4px;
                transition: background-color 0.3s, border-color 0.3s;
                background: none;
                outline: none;
                font-size: 16px;
            }

            button img {
                width: 24px;
                height: 24px;
                margin-right: 10px;
            }

            button {
                border-color: #A40080;
                color: #333; /* Google's blue color, can adjust if needed */
            }

            button:hover {
                background-color: #A40080;
                color: white;
            }
            .social-button {
                margin: 0px
            }
        }
        
    }
</style>