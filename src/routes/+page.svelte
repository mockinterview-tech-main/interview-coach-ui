<script lang="ts">
    import microsoftLogo from '../lib/assets/microsoftLogo.svg'
    import amazonLogo from '../lib/assets/amazonLogo.svg'
    import metaLogo from '../lib/assets/metaLogo.svg'
    import clockOutline from '../lib/assets/clock-outline.svg';
    import bookFilled from '../lib/assets/book-filled.svg';
    import personFilled from '../lib/assets/person-filled.svg';
    import separator from '../lib/assets/separator.svg';
    import rightArrow from '../lib/assets/right-arrow.svg';
	import Popdown from '$lib/components/popdown.svelte';

    export let data;
    const loggedIn = data.loggedIn;

    const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_INFO;
</script>

<section class="jumbotron">
    <div>
        <h1>Nail Your Next Interview</h1>
        <p>Let us help you make your story as exceptional as you are</p>
        <div class="cta-buttons">
            {#if loggedIn}
                <a data-sveltekit-preload-data href="/interview"><button class="primary-button">New Interview</button></a>
                <a data-sveltekit-preload-data href="/summary"><button class="secondary-button">Review Interviews</button></a>
            {:else}
                <a href="/login"><button class="primary-button">Get Started!</button></a>
                <a href="/login"><button class="secondary-button">Log In</button></a>
            {/if}
        </div>
    </div>
</section>

{#if !loggedIn}
    <div class="announcement-banner">
        Early Adopter Special: Sign up now and get 3 FREE interview questions!
    </div>
{/if}

<div class="info-section">
    <section class="section">
        <div class="container">
            <h1>Why Us?</h1>
            <div class="vertical-sections">
                <div class="vl-section">
                    <p>Get quality interview skills coaching on your schedule at a fraction of the cost with guidance fine-tuned by expert coaches who've helped over 200 people land jobs at top companies.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="horizontal-sections">
            <div class="hz-section">
                <img width="100px" height="100px" src={bookFilled} alt="high impact story telling"/>
                <h2>High Impact Storytelling</h2>
                <p>Most interviewers expect stories to follow the Situation Task Action Result (STAR) format so our coaches objectively evaluate how well you cover each STAR point and echo it back to you so you see what the interviewer sees and can improve your story.</p>
            </div>
            <div class="hz-section">
                <img width="100px" height="100px" src={personFilled} alt="focused coaching"/>
                <h2>Focused Coaching</h2>
                <p>See how well you're understood and get actionable advice to strengthen your story to land your dream job with prompts and evaluation rubrics from seasoned experts at Fortune 500 companies.</p>
            </div>
            <div class="hz-section">
                <img width="100px" height="100px" src={clockOutline} alt="progression"/>
                <h2>Sense of Progression</h2>
                <p>Get a history of past responses so you can see how well your storytelling improves and highlight trends in areas where you can provide the details that will WOW your next interviewer.</p>
            </div>
        </div>
    </section>

    <img width="50%" src={separator} alt="separator"/>

    <section class="section">
        <div class="container">
            <h2>Our Approach</h2>
            <div class="horizontal-sections">
                <div class="hz-section approach" style="text-align: center;">
                    <p>
                        Our interview coaching is fine tuned by hiring managers with experience at top companies including <br/><br/>
                        <img width="100px" src={metaLogo} alt="Meta Logo"/>&emsp14;
                        <img width="100px" src={microsoftLogo} alt="Microsoft Logo"/>&emsp14;
                        <img width="150px" src={amazonLogo} alt="Amazon Logo"/>&emsp14;
                        <br/><br/><b>And More...</b><br/><br/>
                    </p>
                </div>
                <div class="hz-section approach" style="line-height: 50px; text-align: left;">
                    <p><img style="vertical-align: middle;" height="15px" src={rightArrow} alt="rightArrow"/> Get tips on how to be an effective story teller.</p>
                    <p><img style="vertical-align: middle;" height="15px" src={rightArrow} alt="rightArrow"/> See your responses as hiring managers see them.</p>
                    <p><img style="vertical-align: middle;" height="15px" src={rightArrow} alt="rightArrow"/> Refine and hone your answers for maximum impact.</p>
                </div>
                
            </div>
        </div>
    </section>

    <img width="50%" src={separator} alt="separator"/>
    
    <section class="section">
        <h2>Pricing</h2>
        <p>All packages come with result summaries. Credits never expire.</p>
        <div class="horizontal-sections">
            <div class="hz-section">
                <h3>Looking Around $5.00</h3>
                <img width="50%" src={separator} alt="separator"/>
                <ul>
                    <li>1 Interview Question</li>
                    <li>Best as a refresher on interviewing</li>
                </ul>
                <a href={loggedIn ? '/credits' : '/login'}><button>Buy Now</button></a>
            </div>
            <div class="hz-section">
                <h3>Passive Candidate $20.00</h3>
                <img width="50%" src={separator} alt="separator"/>
                <ul>
                    <li>5 Interview Questions</li>
                    <li>Equivalent to a 2 hour live person coaching session valued at $200.00</li>
                </ul>
                <a href={loggedIn ? '/credits' : '/login'}><button>Buy Now</button></a>
            </div>
            <div class="hz-section">
                <h3>Active Candidate $30.00</h3>
                <img width="50%" src={separator} alt="separator"/>
                <ul>
                    <li>10 Interview Questions</li>
                    <li>Best for refining answers to tricky interview questions or preparing for multiple interviews</li>
                </ul>
                <a href={loggedIn ? '/credits' : '/login'}><button>Buy Now</button></a>
            </div>
        </div>
        <div class="hz-section">
            <h3>Live Coaching</h3>
            <p>Contact us for a consultation with one of our interview experts with experience at top paying companies including <b>Microsoft</b>, <b>Amazon</b>, <b>Meta</b>, and more!</p>
            <p>We'll work with you on your career goals and craft an interviewing plan that is perfect for you.</p>
            <a href="mailto:{CONTACT_EMAIL}"><button>Get in Touch</button></a>
        </div>
    </section>

    <img width="50%" src={separator} alt="separator"/>

    <section class="section">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="horizontal-sections">
                <div class="hz-section popdown" style="text-align: center;">
                    <Popdown>
                        <h3 class="popdown-header" slot="popdown-header">Who is behind mockinterview.tech?</h3>
                        <p class="popdown-content" slot="popdown-content">Mock Interview was founded by Yijun Wang and Dominick Caponi. 
Yijun has 9+ years of experience working in tier-1 tech companies as a Technical Program Manager (TPM), in charge of multi-million-dollar programs and responsible for tens of millions users in Alexa and Facebook. She is currently a Senior Technical Program Manager at Amazon, previously at Meta and Microsoft. 
Dominick is a seasoned technical leader specializing in influencing without authority, and driving products, programs, and teams that deliver business value using Big Data, Machine Learning, and Distributed Systems. He is currently an engineering leader and manager in the startup space for 8+ years, previously at Microsoft.
Aside from the 2 core founders, Mock Interview has close connections with 10+ hiring experts in the tier-1 companies and startup field, ranging from high-performing Individual Contributors (ICs), senior managers, and executives (with 20+ years of experiences). 
We strive to bring the most effective evaluation rubrics that make your story telling as exceptional as you are already today.</p>
                    </Popdown>
                    <Popdown>
                        <h3 class="popdown-header" slot="popdown-header">How do I use mockinterview.tech for best results?</h3>
                        <p class="popdown-content" slot="popdown-content">Proactive preparation for behavioral interviews is as essential as hard skill focus interviews. It helps transform not just your answers, but optimizing your portrayal of professional prowess through storytelling via the S.T.A.R. technique. Beginning preparation early and doing it often (4 hrs per week if active interviewing) allow you to meticulously align your experiences with the role’s competencies, showcasing a broad spectrum of skills through well-chosen examples. 
Mock Interview helps you strategically construct narratives that display emotional intelligence and professional sincerity, plus “sell” your highlights at the right time in a time-limiting environment.  
Consider it a cost-effective way to do add-on behavior interview practices before you can make the best use of any in-person mock interviews which costs from $150 - $300 per session.</p>
                    </Popdown>
                    <Popdown>
                        <h3 class="popdown-header" slot="popdown-header">Why not just use ChatGPT?</h3>
                        <p class="popdown-content" slot="popdown-content">We leverage exclusive, interview evaluation metrics honed from years of practical, in-depth experience - an expertise extending beyond what ChatGPT can deliver alone. 
We engineered mock interview to not only provide detailed and customized feedback, but also to monitor your progress. Mock Interview embodies the essence of hundreds of hours of research and development, converging to forge a best-in-class AI-driven behavioral interview simulator.</p>
                    </Popdown>
                </div>
            </div>
        </div>
    </section>

</div>

<style lang="scss">
    @import "../styles/colors.scss";
    .jumbotron {
        position: relative;
        color: $white;
        width: 100%;
        padding: 200px 40px;
        background-color: transparent; /* No direct background on the jumbotron */

        /* Blurred version of the background */
        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -2; /* Ensure it's below the content */
            background-image: url('../lib/assets/jumbotron.jpg');
            background-size: cover;
            background-position: center;
            filter: blur(2px);
        }

        /* Sharp edges with tint */
        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1; /* Above the blurred version but below the content */
            background-image: 
                linear-gradient(rgba(112, 112, 112, 0.5), rgba(27, 27, 27, 0.5)), 
                url('../lib/assets/jumbotron.jpg'); 
            background-size: cover;
            background-position: center;
            mask-image: radial-gradient(circle at center, transparent 0%, transparent 75%, black 75.5%, black);
        }

        h1 { font-size: 42px; }
        
        p { font-size: 24px; }

        .cta-buttons {
            display: flex;
            flex-direction: row;
        }
    }

    .announcement-banner {
        text-align: center;
        font-size: large;
        display: block;
        line-height: 80px;
        background-color: $dark-purple;
        color: $white;
    }

    .info-section {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        .section {
            align-items: center;
            padding: 20px 0;
            max-width: 80%;
            text-align: center;
            &:last-of-type {
                padding-bottom: 60px;
            }
        }

        .vl-section {
            padding: 0px 50px;
        }

        .horizontal-sections {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        .hz-section {
            border-radius: 8px;
            flex: 1;
            margin: 20px;
            ul {
                margin: auto;
                padding: 0;
                li {
                    text-align: center;
                }
            }
            button {
                margin: auto;
            }
        }

        .popdown-header {
            text-align: left;
        }

        .popdown-content {
            text-align: left;
            line-height: 25px;
        }

        .approach {
            background-color: $white;
            justify-content: center;
            img {
                margin: 10px;
            }
        }

        ul {
            list-style-type: none;
            li {
                text-align: left;
                margin: 10px 0px;
            }
        }
    }
</style>