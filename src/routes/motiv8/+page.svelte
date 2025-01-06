<script lang="ts">
  import Button from '@smui/button';
  import { goto } from '$app/navigation';

  import { userStore } from '$lib/stores/userStore.js';
  const registerUser = () => alert("thank you for your interest - we'll let you know when the full experience is ready!");
  const signup = () => {
    goto('/login')
  }
</script>

<section>
  <h1>Motiv8 Concept Demo</h1>
  <p>Motiv8 is a new platform that leverages <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3079278/">identity based motivation</a> to help you achieve your goals.</p>
  <p>We'll help you define the type of person you want to be, whether its a FAANG software engineer, a morning person, or a fitter you.</p>
  <p>We start with a discussion about who you are, who you want to become and identify milestones and key habits you should adopt in service of your goals and ultimately your new persona.</p>
  <p>Then our AI will check in with you twice daily to establish</p>
  <ul>
    <li>In the morning: What 3 activities you're going to do today in service of that goal</li>
    <li>In the evening: what activities have you done in service of your goal</li>
  </ul>
  <p>We keep track of the conversations and give you a progress report based on what you set out to do and what you actually do daily and how that lines up with habits your ideal persona would do.</p>
  <p>Rather than a rigid structure requiring you to constantly update an app or remembering to write in a journal, we'll meet you where you are via text messaging - just like if a personal coach would check in with you daily</p>
  <p>You're also welcome to converse with the app via sms if you need help identifying some key activities or plan changes that day</p>
  <hr/>
  <form>
    {#if $userStore.loggedIn}
      <label for="phone">phone number</label><br/><br/>
      <input type="tel"/>
      <button class="cta-button interest" type="submit" on:click={registerUser}>I'm Interested!</button>
    {:else}
      <p>This service is only available to registerd users of mockinterview.tech with a paid subscription right now. Please consider signing up!</p>
      <a href="/login"><Button class="cta-button jumbo">Get Started!</Button></a>
    {/if}
  </form>
  <hr/>
  <h1>The Fine Print</h1>
  <p>Motiv8 uses sms based messaging to reach out to you about your plans and goals.</p>
  <p>By signing up for this service, you agree to be contacted via SMS as part of our service offering.</p>
  <p>Standard messaging rates apply.</p>
  <p>We will not spam, sell your phone number, or use your phone number for marketing.</p>
  <p>You may opt out any time by texting STOP.</p>
  <p>Signing up for this service means you agree to sms based communications.</p>
  <p>Please review our <a href="/legal/tos">terms of service</a> and <a href="/legal/privacy">privacy policy</a> for more details</p>
</section>

<style lang="scss">
  @import "../../lib/styles/colors.scss";

  section {
    margin-top: 70px;
    margin-left: 20px;
    margin-right: 20px;
  }
  hr {
    margin: 20px 0px;
  }
  a {
    color: $yellow;
  }
  .interest {
    margin: 0;
  }
</style>