<script lang="ts">
	import interviewScreenshot from '$lib/assets/interview-screenshot.png';
	import setupScreenshot from '$lib/assets/setup-screenshot.png';
	import Card from '@smui/card';
	import target from '$lib/assets/icons/target.svg';
	import bookFilled from '$lib/assets/icons/book-filled.svg';
	import personFilled from '$lib/assets/icons/person-filled.svg';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Button from '@smui/button';
	import { userStore } from '$lib/stores/userStore.js';

	const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_INFO;
</script>

<div class="frontpage-container">
	<section class="jumbotron">
		<div>
			<h1>The Missing Interview Dress Rehearsal</h1>
			<p>Make your stories as exceptional as you</p>
			<br /><br />
			{#if $userStore.loggedIn}
				<a data-sveltekit-preload-data="hover" href="/interview"
					><Button class="cta-button jumbo">New Interview</Button></a
				>
				<a data-sveltekit-preload-data="hover" href="/summary"
					><Button class="cta-button jumbo">Review Interviews</Button></a
				>
			{:else}
				<a href="/login"><Button class="cta-button jumbo">Get Started!</Button></a>
				<a href="/login"><Button class="cta-button jumbo">Log In</Button></a>
			{/if}
		</div>
	</section>

	{#if !$userStore.loggedIn}
		<div class="announcement-banner">
			Want Free Interviews? Do one interview and tell us about your experience!
		</div>
	{/if}

	<div class="info-section">
		<section class="section">
			<h1>Why Us?</h1>
			<div class="vertical-sections">
				<div class="vl-section">
					<p>
						Craft and curate stories that get to the heart of what interviewers actually care about.
					</p>
					<p>
						Efficiently hone your practice telling stories about select soft-skill traits rather
						than answering random questions.
					</p>
				</div>
			</div>
		</section>

		<section class="section">
			<div class="horizontal-sections">
				<div class="hz-section">
					<img width="100px" height="100px" src={bookFilled} alt="high impact story telling" />
					<h2>Storytelling S.T.A.R</h2>
					<ul>
						<li>
							Practice the Situation Task Action & Result (S.T.A.R.) framework, the prefered
							framework of hiring managers
						</li>
						<li>
							See specific areas of your story that need more (or less) details and prepare
							supporting data and points for the real interview
						</li>
					</ul>
				</div>
				<div class="hz-section">
					<img width="100px" height="100px" src={target} alt="progression" />
					<h2>Focused Topics</h2>
					<ul>
						<li>
							Choose a focus area from grading rubrics used at thousands of companies to interview
							against
						</li>
						<li>
							Emphasize signals that hiring managers look for rather than random interview questions
						</li>
					</ul>
				</div>
				<div class="hz-section">
					<img width="100px" height="100px" src={personFilled} alt="personalized coaching" />
					<h2>Flexible Coaching</h2>
					<ul>
						<li>Get affordable practice works with your schedule</li>
						<li>
							Personalized score cards in storytelling and core skills focus areas track how well
							your story improves with each attempt
						</li>
					</ul>
				</div>
			</div>
		</section>

		<section class="section">
			<Card padded class="features-card">
				<img src={setupScreenshot} alt="Setup Screenshot" />
				<div style=" text-align: left;">
					<h3>Focus on Skill Areas That Matter to Hiring Managers</h3>
					<p>
						We don't use a question bank and randomly pick questions. We know what interpersonal
						skills hiring managers truly care about and emphasize story telling in those areas.
					</p>
					<p>
						Learn to recognize what a hiring manager is really looking for in a question so you can
						deliver the story that best showcases the skill.
					</p>
					<p>
						We score you on how well your story exhibits skills like collaboration, leadership, and
						problem solving so you can hone your story before the big day.
					</p>
				</div>
			</Card>
			<br /><br />
			<Card padded class="features-card">
				<div style=" text-align: left;">
					<h3>Practical Practice</h3>
					<p>
						We're a dress rehearsal for your interview in an objective, judgement-free environment.
					</p>
					<p>Focus on your story and your message.</p>
					<p>
						Transcripts are saved and accessable forever so you can review them, make changes, and
						hone your story.
					</p>
				</div>
				<img src={interviewScreenshot} alt="Interview Screenshot" />
			</Card>
		</section>

		<section class="section">
			<h2>Pricing</h2>
			<p>All packages come with result summaries. Credits never expire.</p>
			<div class="horizontal-sections price-section">
				<div class="hz-section price">
					<h3 style="text-wrap: nowrap;">Single Session - $2.00</h3>
					<p>1 Deep Dive Interview Question</p>
					<a href={$userStore.loggedIn ? '/credits' : '/login'}
						><Button class="cta-button">Buy Now</Button></a
					>
				</div>
				<div class="hz-section price">
					<h3 style="text-wrap: nowrap;">Subscription Plan - $20.00</h3>
					<p>Unlimited Questions</p>
					<a href={$userStore.loggedIn ? '/credits' : '/login'}
						><Button class="cta-button">Buy Now</Button></a
					>
				</div>
				<div class="hz-section price">
					<h3 style="text-wrap: nowrap;">Live Coaching - Call Us</h3>
					<p>Customized Live Interview Coaching</p>
					<a href="mailto:{CONTACT_EMAIL}"><Button class="cta-button">Get in Touch!</Button></a>
				</div>
			</div>
		</section>

		<section class="section">
			<h2>Frequently Asked Questions</h2>
			<Accordion>
				<Panel>
					<Header>Is my data safe and private?</Header>
					<Content
						><p>
							Absolutely! Mockinterview.tech was built using the most up to date security and
							privacy best practices by people who've worked in the cybersecurity industry. We will
							not transmit any data you give us without your permission.
						</p></Content
					>
				</Panel>
				<Panel>
					<Header>Do credits expire?</Header>
					<Content><p>No, however we're unable to give refunds at this time.</p></Content>
				</Panel>
				<Panel>
					<Header>I left my session mid-interview. Can I get my token back?</Header>
					<Content
						><p>
							Right now we don't have a self serve way to do that but if you <a
								class="contact-link"
								href="mailto:{CONTACT_EMAIL}">get in touch (click here)</a
							> we can get you squared away.
						</p></Content
					>
				</Panel>
				<Panel>
					<Header>How do I shut down my account?</Header>
					<Content
						><p>
							We'd be sorry to see you go, however, just <a
								class="contact-link"
								href="mailto:{CONTACT_EMAIL}">get in touch (click here)</a
							> we can close out your account including erasure of your data.
						</p></Content
					>
				</Panel>
				<Panel>
					<Header>Why not just use ChatGPT?</Header>
					<Content
						><p>
							We leverage exclusive, interview evaluation metrics honed from years of practical,
							in-depth experience - an expertise extending beyond what ChatGPT can deliver alone. We
							engineered mock interview to not only provide detailed and customized feedback, but
							also to monitor your progress. Mock Interview embodies the essence of hundreds of
							hours of research and development, converging to forge a best-in-class AI-driven
							behavioral interview simulator.
						</p></Content
					>
				</Panel>
			</Accordion>
		</section>
	</div>
</div>

<style lang="scss">
	@import '../lib/styles/colors.scss';

	p,
	li {
		line-height: 1.5em;
	}

	* :global(.cta-button) {
		margin: auto;
		border: 1px solid $dark-purple;
		background-color: $dark-purple;
		color: white;
	}

	.frontpage-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.jumbotron {
		position: relative;
		color: $white;
		z-index: 100;
		padding: 200px 0px;
		width: 100vw;
		background-color: transparent; /* No direct background on the jumbotron */

		/* Blurred version of the background */
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: -2; /* Ensure it's below the content */
			background-image: url('$lib/assets/jumbotron.jpg');
			background-size: cover;
		}

		div {
			padding: 0 40px;
		}
		h1 {
			font-size: 42px;
		}
		p {
			font-size: 24px;
		}
		* :global(.jumbo) {
			padding: 20px;
			margin-right: 20px;
			margin-top: 20px;
		}
	}

	.announcement-banner {
		text-align: center;
		padding: 20px;
		font-size: large;
		display: block;
		width: 100%;
		background-color: $dark-purple;
		color: $white;
	}

	.contact-link {
		color: $yellow;
		font-weight: bold;
	}

	* :global(.features-card) {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		flex-direction: row;
		align-items: center;

		& :global(img) {
			max-width: 40%;
			min-width: 300px;
			min-height: 200px;
		}
		& :global(div) {
			min-width: 300px;
			max-width: 40%;
		}

		@media only screen and (max-width: 500px) {
			padding: 20px;
			& :global(img) {
				display: none;
			}
		}
	}

	.info-section {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		max-width: 1500px;
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
			.hz-section {
				flex: 1;
				margin: 20px;
				box-sizing: border-box;
				width: 300px;
				ul {
					flex: 1;
					margin: auto;
					padding: 0;
					li {
						margin-top: 10px;
						display: inline-block;
					}
				}
			}
		}
		@media only screen and (max-width: 1020px) {
			.horizontal-sections {
				flex-direction: column;
				align-items: center;
				ul,
				& :global(.price) {
					margin: 10px;
				}
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
