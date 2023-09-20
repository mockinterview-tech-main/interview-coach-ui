<script lang="ts">
    import microsoftLogo from '../lib/assets/microsoftLogo.svg'
    import amazonLogo from '../lib/assets/amazonLogo.svg'
    import metaLogo from '../lib/assets/metaLogo.svg'

</script>

<section class="jumbotron">
    <h1>You Are Exceptional</h1>
    <p>Let us help you make your story as excpetional as you are</p>
</section>

<section class="section">
    <div class="container">
        <h2>Our Approach</h2>
        <div class="steps">
            <div class="step approach" style="line-height: 50px; padding-top: 100px;">
                <p>We'll give you tips on how to <b>be an effective story teller.</b></p>
                <p><b>See your responses as hiring managers see them.</b></p>
                <p>Refine and hone your answers for <b>maximum impact.</b></p>
            </div>
            <div class="step approach" style="text-align: center;">
                <p>
                    Our interview coaching is fine tuned buy hiring managers with experience at top companies including <br/><br/>
                    <img width="100px" src={microsoftLogo} alt="Microsoft Logo"/>&emsp14;
                    <img width="150px" src={amazonLogo} alt="Amazon Logo"/>&emsp14;
                    <img width="100px" src={metaLogo} alt="Meta Logo"/>&emsp14;
                    <br/><br/><b>And More</b><br/><br/>
                </p>
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
        <h2>Why Us?</h2>
        <div class="row">
            <div class="outcome">
                <h3>High Impact Storytelling</h3>
                <p>Most interviewers expect stories to be in the Situation Task Action Result (STAR) format</p>
            </div>
            <div class="outcome">
                <h3>Focused Coaching</h3>
                <p>See how well you're being understood and get actionable advice to strengthen your stories and land your dream job</p>
            </div>
            <div class="outcome">
                <h3>Trackable Progress</h3>
                <p>We'll keep a history of past responses so you can see how well your storytelling has improved and highlight trends in areas where you can provide the details that will wow your next interviewer</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <h2>Pricing</h2>
    <div class="steps">
        <div class="step">
            <h3>Looking Around</h3>
            <ul>
                <li>3 Interview Question</li>
                <li>Full Assessment of Storytelling</li>
                <li>Actionable Feedback For Your Interview</li>
            </ul>
        </div>
        <div class="step">
            <h3>Passive Candidate</h3>
            <ul>
                <li>Everything in "Looking Around"</li>
                <li>5 Questions per day</li>
            </ul>
        </div>
        <div class="step">
            <h3>Active Candidate</h3>
            <ul>
                <li>Everything in "Passive Candidate"</li>
                <li>1 Hour Session With a Live Interview Coach</li>
            </ul>
        </div>
    </div>
</section>



<style lang="scss">
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
        padding: 10px;
        border-radius: 8px;
        flex: 1;
        margin: 20px;
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