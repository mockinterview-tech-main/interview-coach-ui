<script lang="ts">
	import { page } from "$app/stores";
    import LogoFilled from "$lib/assets/icons/logo-filled.svg";
	import { getSummaryStats } from "$lib/serviceApi.js";
	import { statsStore } from "$lib/stores/statsStore.js";
	import { userStore } from "$lib/stores/userStore.js";
	import { onMount } from "svelte";
    export let data;
    const {loggedIn, credits, username} = data;

    $: isInterviewPage = $page.url.pathname === '/interview';

    $userStore = {credits}

    let navMenu: HTMLElement;
    $: isNavOpen = false;

    const logout = () => fetch('/logout');

    const toggleNav = () => {
        if(window.matchMedia('(max-width: 750px)').matches) {
            isNavOpen = !isNavOpen;
        }
    }

    const closeNav = (event: MouseEvent): void => {
        if (navMenu && !navMenu.contains(event.target as Node)) {
            isNavOpen = false
        }
    };

    // establish global state & event listeners
    onMount( async () => {
        if (loggedIn) {
            let stats = await getSummaryStats();
            if (stats) {
                statsStore.set(stats)
            }
        }
        document.addEventListener('click', closeNav)
    });

    const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_INFO;
</script>

<div class="container">
    <nav bind:this={navMenu}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span class="hamburger" on:click={toggleNav}><img alt="mockinterview.tech logo" src={LogoFilled}/></span>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="nav-links" class:open={isNavOpen}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="left-nav-links">
                {#if isNavOpen}
                    <span class="nav-link" on:click={toggleNav}><a href="/">Home</a></span>
                {:else}
                    <span class="nav-link" on:click={toggleNav}><a href="/"><img alt="mockinterview.tech logo" src={LogoFilled}/></a></span>
                {/if}
                {#if loggedIn}
                    <span class="nav-link" on:click={toggleNav}><a href="/interview">New Interview</a></span>
                    <span class="nav-link" on:click={toggleNav}><a href="/summary">Past Interviews</a></span>
                {:else}
                    <span class="nav-link" on:click={toggleNav}><a href="/login">Get Started</a></span>
                {/if}
            </div>
            {#if loggedIn}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="right-nav-links">
                <span class="nav-link">{username}</span>
                <span class="nav-link" on:click={logout}><a href="/">logout</a></span>
                <span class="nav-link">{$userStore.credits} Interviews</span>
                <span class="nav-link" on:click={toggleNav}><a class="link-cta" href="/credits">Buy More</a></span>
            </div>
            {/if}
            
        </div>
        
    </nav>
    <main>
        <slot/>
    </main>
    {#if !isInterviewPage}
        <footer>
            <span>&copy; 2024 EmpowerPro Labs</span>
            <span><a href="https://medium.com/@mockinterview-tech">Blog</a></span>
            <span><a href="/legal/tos">Terms of Service</a></span>
            <span><a href="/legal/privacy">Privacy Policy</a></span>
            <span><a href="/legal/cookie">Cookie Policy</a></span>
            <span><a href="mailto:{CONTACT_EMAIL}">Contact Us</a></span>
        </footer>
    {/if}
</div>
<style lang="scss">
    @import "@fontsource/inter";
    @import "../lib/styles/form.scss";
    @import "../lib/styles/button.scss";
    @import "../lib/styles/links.scss";

    :global(html, body) {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
    }

    * {
        min-width: 0;
    }

    :global(h3) { text-align: center; }
    :global(li) { list-style-type: none; }

    .container {
        font-family: 'inter', Arial, Helvetica, sans-serif;
        font-size: medium;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0px;
        margin: 0px;
    }
    
    nav {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 1000;
        background-color: $dark-gray;
        line-height: 50px;
        img {
            width: 40px;
            position: relative;
            top: 4px;
            vertical-align: middle;
        }
            .nav-links {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .left-nav-links, .right-nav-links {
                display: flex;
                flex-direction: row;
            }

            .left-nav-links {
                align-items: flex-start;
                .nav-link {
                    margin-left: 20px;
                }
            }
            
            .right-nav-links {
                align-items: flex-end;
                margin-right: 20px;
                color: $white;
                .nav-link {
                    margin-right: 20px;
                }
            }

            @media only screen and (max-width: 750px) {
                .left-nav-links, .right-nav-links {
                    flex-direction: column;
                }
                .right-nav-links {
                    align-items: flex-start;
                    margin-right: 0px;
                    margin-left: 20px;
                }
                display: none;
                flex-direction: column;
                position: absolute;
                background-color: $dark-gray;
                top: 50px;
                left: 0;
                width: 100%;
                &.open {
                    display: flex;
                    width: 50%;
                    height: 100vh;
                    justify-content: flex-start;
                }
            }
        }
        .hamburger {
            display: none;
            @media only screen and (max-width: 750px) {
                display: inline-block;
                cursor: pointer;
                margin-left: 20px;
            }
        }
    }

    main { flex: 1; }
    
    footer {
        flex-flow: row wrap;
        display: flex;
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
        footer {
            justify-content: space-around;
            span {
                padding: 20px;
            }
        }
    }
</style>

