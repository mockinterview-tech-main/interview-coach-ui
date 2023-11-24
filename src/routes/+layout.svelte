<script lang="ts">
    import LogoFilled from "$lib/assets/icons/logo-filled.svg";
    export let data;
    const {loggedIn, credits, username} = data;

    const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_INFO;
</script>

<main>
    <nav>
        <span><a href="/"><img alt="mockinterview.tech logo" src={LogoFilled}/></a></span>
        {#if loggedIn}
            <span><a href="/interview">New Interview</a></span>
            <span><a data-sveltekit-preload-data="hover" href="/summary">Past Interviews</a></span>
            <div><span>{username}</span><span>{credits} Interviews</span><span><a class="link-cta" href="/credits">Buy More</a></span></div>
        {:else}
            <span><a href="/login">Get Started</a></span>
        {/if}
    </nav>
    <slot/>
    <footer>
        <span>&copy; 2023 EmpowerPro Labs</span>
        <span><a href="/legal/tos">Terms of Service</a></span>
        <span><a href="/legal/privacy">Privacy Policy</a></span>
        <span><a href="/legal/cookie">Cookie Policy</a></span>
        <span><a href="mailto:{CONTACT_EMAIL}">Contact Us</a></span>
    </footer>
</main>

<style lang="scss">
    @import "@fontsource/inter";
    @import "../lib/styles/form.scss";
    @import "../lib/styles/button.scss";
    @import "../lib/styles/links.scss";

    :global(h3) { text-align: center; }
    :global(li) { list-style-type: none; }

    main {
        font-family: 'inter', Arial, Helvetica, sans-serif;
        font-size: medium;
        width: 100%;
        padding: 0px;
        margin: 0px;
        nav { padding: 0px 20px; }
    }
    
    nav {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 1000;
        padding: 20px;
        background-color: $dark-gray;
        line-height: 50px;
        div {
            float: right;
            margin-right: 40px;
            color: $white;
        }
        span { padding: 20px; }
        img {
            width: 40px;
            position: relative;
            top: 4px;
            vertical-align: middle;
        }
    }
    footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: $dark-gray; 
        color: $white; 
        padding: 10px;
        span { padding: 20px; }
    }

    @media only screen and (max-width: 1000px) {
        * { font-size: 14px; }
        nav {
            div {
                margin-right: 20px;
            }
        }
        footer {
            span {
                padding: 10px;
            }
        }
    }
</style>

