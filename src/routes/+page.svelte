<script lang="ts">
    import interviewScreenshot from '$lib/assets/interview-screenshot.png';
    import setupScreenshot from '$lib/assets/setup-screenshot.png';
    import target from '$lib/assets/icons/target.svg';
    import bookFilled from '$lib/assets/icons/book-filled.svg';
    import personFilled from '$lib/assets/icons/person-filled.svg';
    import separator from '$lib/assets/icons/separator.svg';
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Button from '@smui/button';

    export let data;
    const {loggedIn} = data;

    const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_INFO;
</script>

<section class="jumbotron">
    <div>
        <h1>Be On The Ball In Your Next Interview</h1>
        <p>Let us help you make your story as exceptional as you are</p>
        {#if loggedIn}
            <a data-sveltekit-preload-data href="/interview"><Button>New Interview</Button></a>
            <a data-sveltekit-preload-data href="/summary"><Button>Review Interviews</Button></a>
        {:else}
            <a href="/login"><Button>Get Started!</Button></a>
            <a href="/login"><Button>Log In</Button></a>
        {/if}
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
                    <p>We believe career mobility should be accessible to all. That's why we use our experience in interviewing and hiring at top companies to give you personalized insights to your stories as hiring managers would see and evaluate them.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="horizontal-sections">
            <div class="hz-section">
                <img width="100px" height="100px" src={personFilled} alt="personalized coaching"/>
                <h2>Flexible Coaching</h2>
                <ul>
                    <li>Get affordable anyime coaching works with your schedule</li>
                    <li>Personalized score cards in storytelling and core skills focus areas track how well your story improves with each attempt</li>
                </ul>
            </div>
            <div class="hz-section">
                <img width="100px" height="100px" src={bookFilled} alt="high impact story telling"/>
                <h2>Storytelling S.T.A.R</h2>
                <ul>
                    <li>Craft your story using the Situation Task Action & Result (S.T.A.R.) framework, the prefered framework of hiring managers</li>
                    <li>See specific areas of your story that need more (or less) details and prepare supporting data and points for the real interview</li>
                </ul>
            </div>
            
            <div class="hz-section">
                <img width="100px" height="100px" src={target} alt="progression"/>
                <h2>Focused Questions</h2>
                <ul>
                    <li>Choose a focus area from grading rubrics used at thousands of companies to interview against</li>
                    <li>Understand signals that hiring managers use to evaluate you in areas like <strong>collaboration, problem solving, and influence without authority</strong></li>
                </ul>
            </div>
        </div>
    </section>

    <img width="50%" src={separator} alt="separator"/>

    <section class="section">
        <div class="container">
            <h2>Our Approach</h2>
            <div style="box-shadow: 5px 5px #EDECF2; margin-bottom: 20px; border: 1px solid #EDECF2" class="horizontal-sections">
                <div class="hz-section approach" style="text-align: center;">
                    <img width="100%" src={setupScreenshot} alt="Setup Screenshot"/>
                </div>
                <div class="hz-section approach" style=" text-align: left;">
                    <h3>Focus on Skill Areas That Matter to Hiring Managers</h3>
                    <p>We don't use a question bank and randomly pick questions. We know what interpersonal skills hiring managers truly care about and emphasize story telling in those areas.</p>
                    <p>Training with us will help you recognize what a hiring manager is really looking for in a question so you can deliver the story that best showcases the skill.</p>
                    <p>We score you on how well your story showcases skills like collaboration, leadership, and problem solving and let you re-try questions in an area until you feel confident and ready for the interview.</p>
                </div>
            </div>
            <div style="box-shadow: 5px 5px #EDECF2; margin-bottom: 20px; border: 1px solid #EDECF2" class="horizontal-sections">
                <div class="hz-section approach" style=" text-align: left;">
                    <h3>Practical Practice</h3>
                    <p>We encourage speaking and practicing as if you were on a call with a real interviewer to build confidence and muscle memory.</p>
                    <p>Filler words are filtered out so you can focus on your story's content rather than the mechanics.</p>
                    <p>Transcripts are saved so you can review them, make changes, and hone your story.</p>
                </div>
                <div class="hz-section approach" style="text-align: center;">
                    <img width="100%" src={interviewScreenshot} alt="Meta Logo"/>
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
                <h3 style="text-wrap: nowrap;">Looking Around $5.00</h3>
                <img width="50%" src={separator} alt="separator"/>
                <ul>
                    <li>1 Interview Question</li>
                </ul>
                <a href={loggedIn ? '/credits' : '/login'}><Button>Buy Now</Button></a>
            </div>
            <div class="hz-section">
                <h3 style="text-wrap: nowrap;">Passive Candidate $20.00</h3>
                <img width="50%" src={separator} alt="separator"/>
                <ul>
                    <li>5 Interview Questions</li>
                </ul>
                <a href={loggedIn ? '/credits' : '/login'}><Button>Buy Now</Button></a>
            </div>
            <div class="hz-section">
                <h3 style="text-wrap: nowrap;">Active Candidate $30.00</h3>
                <img width="50%" src={separator} alt="separator"/>
                <ul>
                    <li>10 Interview Questions</li>
                </ul>
                <a href={loggedIn ? '/credits' : '/login'}><Button>Buy Now</Button></a>
            </div>
        </div>
        <div class="hz-section">
            <h3>Live Coaching</h3>
            <p>Contact us for a consultation with one of our interview experts and we'll work with you on your career goals and craft an interviewing plan that is perfect for you.</p>
            <a href="mailto:{CONTACT_EMAIL}"><Button>Get in Touch</Button></a>
        </div>
    </section>

    <img width="50%" src={separator} alt="separator"/>

    <section class="section">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="horizontal-sections">
                <Accordion>
                    <Panel>
                        <Header>Do credits expire?</Header>
                        <Content><p>No, however we're unable to give refunds at this time.</p></Content>
                    </Panel>
                    <Panel>
                        <Header>Is my data safe and private?</Header>
                        <Content><p>Absolutely! Mockinterview.tech was built using the most up to date security and privacy best practices by people who've worked in the cybersecurity industry. We will not transmit any data you give us without your permission.</p></Content>
                    </Panel>
                    <Panel>
                        <Header>I left my session mid-interview. Can I get my token back?</Header>
                        <Content><p>Right now we don't have a self serve way to do that but if you <a href="mailto:{CONTACT_EMAIL}">drop us a line</a> we can get you squared away.</p></Content>
                    </Panel>
                    <Panel>
                        <Header>How do I shut down my account?</Header>
                        <Content><p>We'd be sorry to see you go, however, just <a href="mailto:{CONTACT_EMAIL}">drop us a line</a> we can close out your account including erasure of your data.</p></Content>
                    </Panel>
                    <Panel>
                        <Header>Why not just use ChatGPT?</Header>
                        <Content><p>We leverage exclusive, interview evaluation metrics honed from years of practical, in-depth experience - an expertise extending beyond what ChatGPT can deliver alone. 
We engineered mock interview to not only provide detailed and customized feedback, but also to monitor your progress. Mock Interview embodies the essence of hundreds of hours of research and development, converging to forge a best-in-class AI-driven behavioral interview simulator.</p></Content>
                    </Panel>
                </Accordion>
            </div>
        </div>
    </section>

</div>

<style lang="scss">
    @import "../lib/styles/colors.scss";
    .jumbotron {
        position: relative;
        color: $white;
        z-index: 100;
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
            background-image: url('$lib/assets/jumbotron.jpg');
            background-size: cover;
            background-repeat: no-repeat;
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
        line-height: 30px;
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
            &:last-of-type { padding-bottom: 60px; }
        }

        .vl-section { padding: 0px 50px; }

        .horizontal-sections {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        .hz-section {
            border-radius: 8px;
            flex: 1;
            margin: 20px;
            min-width: 200px;
            ul {
                margin: auto;
                padding: 0;
                li {
                    margin-top: 10px;
                    display: inline-block;
                }
            }
            button { margin: auto; }
        }

        .approach {
            background-color: $white;
            justify-content: center;
            img { margin: 10px; }
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