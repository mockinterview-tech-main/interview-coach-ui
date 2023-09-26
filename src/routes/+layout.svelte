<script lang="ts">
    export let data;
    const {loggedIn, credits, username} = data;
</script>

<main>
    <nav>
        <span><a href="/">Home</a></span>
        {#if loggedIn}
            <span><a href="/interview">New Interview</a></span>
            <span><a data-sveltekit-preload-data="hover" href="/summary">Past Interviews</a></span>
            
            <div><span>{username}</span><span>{credits} Interviews</span><span><a class="header-cta" href="/credits">Buy More</a></span></div>
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
    </footer>
</main>

<style lang="scss">
    main {
        font-family: Arial, Helvetica, sans-serif;
        font-size: medium;
        nav {
            padding: 0px 20px;
        }
    }
    nav {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 1000;
        padding: 20px;
        background-color: #333;
        line-height: 50px;

        .header-cta {
            color: #FDF56C;
            text-decoration: none;
            font-weight: bold;
            outline: black;
        }

        div {
            float: right;
            margin-right: 40px;
            color: #fff;
        }
        span {
            padding: 20px;
            a {
                color: #fff;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            a:hover {
                color: #FDF56C;
            }
        }
    }
    footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #333; 
        color: #fff; 
        padding: 10px;
        span {
            padding: 20px;
        }
        a {
            color: #fff;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        a:hover {
            color: #FDF56C;
        }
    }
</style>

