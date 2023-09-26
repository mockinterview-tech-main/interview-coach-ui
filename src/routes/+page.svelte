<script lang="ts">
    import microsoftLogo from '../lib/assets/microsoftLogo.svg'
    import amazonLogo from '../lib/assets/amazonLogo.svg'
    import metaLogo from '../lib/assets/metaLogo.svg'
    
    export let data;
    const loggedIn = data.loggedIn
</script>

<section class="jumbotron">
    <h1>Nail Your Next Interview</h1>
    <p>Let us help you make your story as excpetional as you are</p>
    <div>
        {#if loggedIn}
            <a data-sveltekit-preload-data href="/interview"><button class="primary-button">New Interview</button></a>
            <a data-sveltekit-preload-data href="/summary"><button class="secondary-button">Review Interviews</button></a>
        {:else}
            <a href="/login"><button class="primary-button">Get Started!</button></a>
            <a href="/login"><button class="secondary-button">Log In</button></a>
        {/if}
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>Why Us?</h2>
        <div class="row">
            <div class="outcome">
                <h3>High Impact Storytelling</h3>
                <p>Most interviewers expect stories to be in the Situation Task Action Result (STAR) format so we objectively evaluate how well you cover each STAR point and echo it back to you so you know where to improve your story.</p>
            </div>
            <div class="outcome">
                <h3>Focused Coaching</h3>
                <p>See how well you're being understood and get actionable advice to strengthen your stories and land your dream job. Our prompts and grading rubrics come from hiring managers and employees at top companies so you get the inside scoop on what they expect from candidates.</p>
            </div>
            <div class="outcome">
                <h3>Trackable Progress</h3>
                <p>We'll keep a history of past responses so you can see how well your storytelling has improved and highlight trends in areas where you can provide the details that will wow your next interviewer.</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <h2>How It Works</h2>
    <div class="steps">
        <div class="step">
            <h3>Step 1</h3>
            <p>Tell me about the role and company you're preparing for and answer an interview question from a hiring manager at that company</p>
        </div>
        <div class="step">
            <h3>Step 2</h3>
            <p>Get detailed actionable feedback to improve your response</p>
        </div>
        <div class="step">
            <h3>Step 3</h3>
            <p>Review your past responses, retry previous questions, and continue to hone your story</p>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>Our Approach</h2>
        <div class="steps">
            <div class="step approach" style="text-align: center;">
                <p>
                    Our interview coaching is fine tuned by hiring managers with experience at top companies including <br/><br/>
                    <img width="100px" src={metaLogo} alt="Meta Logo"/>&emsp14;
                    <img width="100px" src={microsoftLogo} alt="Microsoft Logo"/>&emsp14;
                    <img width="150px" src={amazonLogo} alt="Amazon Logo"/>&emsp14;
                    <br/><br/><b>And More</b><br/><br/>
                </p>
            </div>
            <div class="step approach" style="line-height: 50px; padding-top: 50px; text-align: left;">
                <p>Get tips on how to <b>be an effective story teller.</b></p>
                <p><b>See your responses as hiring managers see them.</b></p>
                <p>Refine and hone your answers for <b>maximum impact.</b></p>
            </div>
            
        </div>
    </div>
</section>

<section class="section">
    <h2>Pricing</h2>
    <p>All packages come with result summaries. Credits never expire.</p>
    <div class="steps">
        <div class="step">
            <h3>Looking Around $5.00</h3>
            <ul>
                <li>1 Interview Question</li>
                <li>Best as a refresher on interviewing</li>
            </ul>
            <a href={loggedIn ? '/credits' : '/login'}><button>Buy Now</button></a>
        </div>
        <div class="step">
            <h3>Passive Candidate $20.00</h3>
            <ul>
                <li>5 Interview Questions</li>
                <li>Equivalent to a 2 hour live person coaching session valued at $200.00</li>
            </ul>
            <a href={loggedIn ? '/credits' : '/login'}><button>Buy Now</button></a>
        </div>
        <div class="step">
            <h3>Active Candidate $30.00</h3>
            <ul>
                <li>10 Interview Questions</li>
                <li>Best for refining answers to tricky interview questions or preparing for multiple interviews</li>
            </ul>
            <a href={loggedIn ? '/credits' : '/login'}><button>Buy Now</button></a>
        </div>
    </div>
    <div class="step">
        <h3>Live Coaching</h3>
        <p>Contact us for a consultation with one of our interview experts with experience at top paying companies including <b>Microsoft</b>, <b>Amazon</b>, <b>Meta</b>, and more!</p>
        <p>We'll work with you on your career goals and craft an interviewing plan that is perfect for you.</p>
    </div>
</section>



<style lang="scss">

    button {
        margin-right: 20px;
        margin-top: 40px;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        border: 2px solid transparent;
        cursor: pointer;
        font-weight: bold;
        border-radius: 4px;
        transition: background-color 0.3s, border-color 0.3s;
        outline: none;
        font-size: 16px;
        border-color: #fff;
        background-color: #A40080;
        color: #fff;
    }

    button:hover {
        border-color: #A40080;
        background-color: #fff;
        color: #A40080;
    }

    .jumbotron {
        background-image: url('../lib/assets/jumbotron.jpg');
        background-size: cover;
        background-position: center;
        color: #fff;
        padding: 200px 40px;
        h1 {
            font-size: 42px;
        }
        p {
            font-size: 24px;
        }
        div {
            display: flex;
            a {
                text-decoration: none;
            }
            .primary-button {
                background-color: #A40080;
                border-color: #FDF56C;
                color: #FDF56C;
            }
            .primary-button:hover {
                border-color: #A40080;
                background-color: #fff;
                color: #A40080;
            }
            .secondary-button {
                background-color: #A40080;
                border-color: #fff;
                color: #fff;
            }
            .secondary-button:hover {
                border-color: #A40080;
                background-color: #fff;
                color: #A40080;
            }
        }
    } 

    .section {
        padding: 20px 0;
        text-align: center;
        &:last-of-type {
            padding-bottom: 60px;
        }
    }

    .outcome {
        padding: 20px;
    }

    .steps {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .step {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 8px;
        flex: 1;
        margin: 20px;
        h3 {
            text-align: center;
        }
        ul {
            margin: auto;
            padding: 0;
            li {
                text-align: center;
            }
        }
        a {
            text-decoration: none;
        }
        button {
            margin: auto;
        }
    }

    .approach {
        background-color: #fff;
        justify-content: center;
        img {
            margin: 10px;
        }
    }

    ul {
        list-style-type: none;
        li {
            text-decoration: none;
            text-align: left;
            margin: 10px 0px;
        }
    }
</style>