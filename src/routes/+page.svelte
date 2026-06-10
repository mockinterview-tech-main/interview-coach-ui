<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { userStore } from '$lib/stores/userStore.js';
	import yijunProfile from '$lib/assets/yijun-profile.png';

	const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_INFO;

</script>

<div class="page">

	<!-- ═══ HERO — personal, photo-forward ═══ -->
	<section class="hero">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>

		<div class="hero-inner">
			<div class="hero-text">
				<p class="hero-greeting">Meet Your Interview Therapist</p>
				<h1>Are Your Stories Interview-Ready?</h1>
				<p class="hero-sub">50% of the candidates I coached need better stories before mock interviews can even help. I'm <strong>Yijun</strong> — I've coached 600+ people through <strong>behavior interview rounds</strong>. Now my AI does the same thing, for a fraction of the cost.</p>
				<p class="hero-credential">Sr. TPM at FAANG &middot; 10+ years &middot; 600+ candidates coached</p>
				<div class="hero-actions">
					{#if $userStore.loggedIn}
						<a href="/storybuilder"><button class="btn-primary">Build a Story with Me</button></a>
						<a href="/stories"><button class="btn-ghost">My Stories &rarr;</button></a>
					{:else}
						<a href="/login"><button class="btn-primary">Start Building Stories</button></a>
					{/if}
				</div>
			</div>
			<div class="hero-photo-area">
				<div class="photo-wrapper">
					<img src={yijunProfile} alt="Yijun Wang — Interview Coach" class="hero-portrait" />
				</div>
				<!-- Floating mini coaching card -->
				<div class="mini-coaching-card">
					<div class="mini-header">
						<span class="mini-dot"></span>
						<span>Live Coaching</span>
					</div>
					<p class="mini-msg">"What impact did that have on the business?"</p>
					<div class="mini-star-row">
						<span class="star-pill s filled">S</span>
						<span class="star-pill t filled">T</span>
						<span class="star-pill a partial">A</span>
						<span class="star-pill r empty">R</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══ BEFORE → AFTER transformation ═══ -->
	<section class="transform-section">
		<p class="section-sub-lead">Stuck digging up the right details? Unsure which project to use? Don't know what signals interviewers want?</p>
		<h2>From Rambling to Remarkable</h2>

		<div class="transform-container">
			<div class="transform-card before">
				<div class="transform-label">&#128172; Without story coaching</div>
				<p>"Um, so there was this project at work and things weren't going well. I guess I kind of stepped up and we figured it out. The client was happy in the end I think..."</p>
				<div class="before-cost">
					<p class="cost-line">&#128176; That's a <strong>$200+ mock session</strong> wasted</p>
					<p class="cost-line severe">&#9888;&#65039; Or worse — the actual interview opportunity gone</p>
				</div>
			</div>
			<div class="transform-arrow">&#10132;</div>
			<div class="transform-card after">
				<div class="transform-label">&#10024; After the session</div>
				<div class="after-sections">
					<div class="after-row"><span class="star-badge s">S</span><p>Led a 5-person team on a $2M client project that fell 3 weeks behind schedule</p></div>
					<div class="after-row"><span class="star-badge t">T</span><p>Needed to recover the timeline without increasing budget or losing the client</p></div>
					<div class="after-row"><span class="star-badge a">A</span><p>Restructured sprint cycles, negotiated scope with the client, and pair-programmed critical features</p></div>
					<div class="after-row"><span class="star-badge r">R</span><p>Delivered 2 days early, client renewed for $3.5M, team got promoted</p></div>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══ HOW IT WORKS — 3 steps ═══ -->
	<section class="steps-section">
		<h2>How It Works</h2>
		<div class="steps">
			<div class="step">
				<div class="step-number">1</div>
				<div class="step-icon">&#128172;</div>
				<h3>Share your experience</h3>
				<p>Talk naturally or even ramble about a real work experience — the coach actively listens and asks insightful follow-ups</p>
			</div>
			<div class="step-connector"></div>
			<div class="step">
				<div class="step-number">2</div>
				<div class="step-icon">&#127959;</div>
				<h3>Construct your story</h3>
				<p>You are co-building each STAR section in real-time - the coach pulls out the signals and aspects most interviewers care about</p>
			</div>t
			<div class="step-connector"></div>
			<div class="step">
				<div class="step-number">3</div>
				<div class="step-icon">&#127919;</div>
				<h3>Show up prepared</h3>
				<p>Confidently walk into mock or real interviews with polished stories and talking points already in your pocket.</p>
			</div>
		</div>
	</section>

	<!-- ═══ CLIENT OUTCOMES — logo bar ═══ -->
	<section class="outcomes-section">
		<p class="outcomes-label">My clients land offers at</p>
		<div class="outcomes-logos">
			{#each [
				{ name: 'Amazon', file: 'amazon' },
				{ name: 'Meta', file: 'meta' },
				{ name: 'Adobe', file: 'adobe' },
				{ name: 'Google', file: 'google' },
				{ name: 'Microsoft', file: 'microsoft' }
			] as company}
				<div class="outcomes-logo">
					<img src="/logos/{company.file}.svg" alt="{company.name}" />
				</div>
			{/each}
		</div>
		<p class="outcomes-sub">and their <b>dream companies</b></p>
	</section>

	<div class="section-divider"><span></span></div>

	<!-- ═══ TESTIMONIALS ═══ -->
	<section class="testimonials-section">
		<h2>Clients Approve My Methods</h2>
		<p class="section-sub">Real stories from real job seekers</p>
		<div class="testimonials-wall">
			<div class="testimonials-row scroll-left">
				<div class="testimonials-track">
					{#each [
						{ name: 'Hitesh T.', role: 'IT Director at Meta', text: 'My executive interview with the VP and Managing Director ran 1 hour and 40 minutes instead of 1 hour because it became such an engaging strategic discussion. Your delivery frameworks completely shift the dynamic!' },
						{ name: 'Pavan K.', role: 'AI Tech Program Leader at Walmart', text: 'Before working with Yijun, I struggled with pacing and long answers. After her targeted feedback, my narrative completely flipped. I immediately had three different Amazon recruiters chasing me to lock down interview dates. She teaches you how to command senior leadership presence.' },
						{ name: 'Yanyu H.', role: 'TPM at Supermicro', text: 'Yijun\'s coaching method has enlightened me. I didn\'t know some of my small projects are actually impactful.' },
						{ name: 'Jerry S.', role: 'Senior Staff Engineer at LinkedIn', text: 'Instead of a dry mock interview, Yijun made me feel I was in \"interview therapy\". Her insights on handling execution and leadership narratives for a FAANG-level loop were incredibly deep. I am so impressed with her energy and wisdom that I want to stay in touch personally.' },
						{ name: 'Sandra Z.', role: 'Software Engineer at Chewy', text: 'Yijun moved me past dry answers into deep storytelling using the STAR framework. Her structured feedback helped highlight my technical actions and product impact. I left with actionable advice, boosted confidence, and a clear roadmap.' },
						{ name: 'Shawn J.', role: 'Software Engineer II at Amazon', text: 'I landed an SDE offer with Amazon! Yijun really helped get me prepared for the leadership principles, and I did very well in that area.' },
						{ name: 'Sangeeta S.', role: 'Delivery Manager at SAP', text: 'I realized I had the imposter syndrome, and Yijun completely shifted my mental positioning. She didn’t just get standard mock prep—it’s interview therapy. My consulting experiences were seamlessly reframed into powerful, high-impact narratives that unlocked my true potential.' },
						{ name: 'Seun O.', role: 'TPM at Microsoft', text: 'I didn\'t realize my rambling hid my critical judegement and business impact. Yijun coached me through reconstructing my outstanding achievements into sellable stories. Her method boosted my confidence largely.' },
						{ name: 'Padma K.', role: 'Technical Program Manager', text: 'Yijun\'s drilling on metric improvements and impactful results helped me see a huge improvement in my story construction. I finally understand how to deliver data-driven answers.' },
						{ name: 'Shruti V.', role: 'Backend Engineer at Discovery', text: 'I had zero numbers in my initial narrative, but Yijun\'s intentional probing helped me realize how much metrics matter. I now feel completely confident streamlining my engineering experience into executive-level scripts.' },
						{ name: 'Mina S.', role: 'Technical Product Owner', text: 'Yijun\'s mentorship gave me a much broader perspective on career growth. I felt completely lost before, but extracting my past achievements and re-framing my resume to be outcome-driven gave me the perfect blueprint to crack top-tier interview loops.' },
					] as t}
						<div class="testimonial-card" style="width: {Math.min(500, Math.max(260, t.text.length * 1.8 + 80))}px;">
							<img class="testimonial-avatar" src="https://api.dicebear.com/9.x/big-smile/svg?seed={encodeURIComponent(t.name)}" alt="{t.name}" />
							<div class="testimonial-body">
								<p class="testimonial-text">"{t.text}"</p>
								<p class="testimonial-name">{t.name}</p>
								<p class="testimonial-role">{t.role}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="testimonials-row scroll-right">
				<div class="testimonials-track">
					{#each [
						{ name: 'Bala T.', role: 'Principal TPM at Microsoft', text: 'Yijun gave me an exceptional deep dive into architectural complexity and cross-functional signals. The direct feedback on time management and conversational pacing was highly encouraging. This training gave me the exact tools to confidently lead senior-level stakeholder panel loops.' },
						{ name: 'Rita M.', role: 'Principal Program Manager', text: 'Yijun has the absolute best pair of ears for detecting structural gaps in my storytelling. Her insights helped me identify hidden data blocks, eliminate tactical traps, and refine my executive interactions.' },
						{ name: 'Danyal A.', role: 'Principle Product Manager at Adobe', text: 'I am super excited about the result and want to thank you again for all your strategic support. I did mock interviews with other coaches on the market, but your approach was entirely different. You truly went above and beyond to help me restructure my narratives. If anyone wants a coach who drives top-tier offers, Yijun is your go-to.' },
						{ name: 'Ali H.', role: 'Senior Network Engineer', text: 'Yijun completely fixed my communication pitfalls. By condensing infrastructure details into a crisp elevator pitch format, I learned to showcase process simplification and dynamic risk-mitigation metrics. Highly recommended her for your Amazon loops.' },
						{ name: 'Manan K.', role: 'TPM at Microsoft', text: 'I learned to stop using flat status reports and anchor my results in absolute cost-saving data. Controlling the conversation layout and highlighting strategic trade-offs is a game-changer for passing strict hiring committee bars.' },
						{ name: 'Soman R.', role: 'Cloud Architect', text: 'Yijun gave me a brilliant lesson in re-framing negative project outcomes into scalable organizational blueprints. Adding concrete metrics, clear "I" ownership lines, and general lesson frameworks made my unpolished migration drafts sound incredibly senior. It was worth every single credit!' },
						{ name: 'Chris P.', role: 'Lead Data Scientist at stealth startup', text: 'Yijun gave superb guidance on building an authoritative presence. The decision-tree framework for icebreakers helped me structure my background using clear data-driven achievements. I now know exactly how to demonstrate strong tech-lead capacity.' },
						{ name: 'Fabian L.', role: 'Software Engineer at Microsoft', text: 'Yijun\'s natural storytelling method is a perfect cheat code for Tier-1 behavioral rounds. I learned to embed localized company culture phrases directly into my narattive, dramatically elevating my overall presentation. I feel incredibly motivated and fully prepared!' },						
					] as t}
						<div class="testimonial-card" style="width: {Math.min(500, Math.max(260, t.text.length * 1.8 + 80))}px;">
							<img class="testimonial-avatar" src="https://api.dicebear.com/9.x/big-smile/svg?seed={encodeURIComponent(t.name)}" alt="{t.name}" />
							<div class="testimonial-body">
								<p class="testimonial-text">"{t.text}"</p>
								<p class="testimonial-name">{t.name}</p>
								<p class="testimonial-role">{t.role}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ═══ PRICING — toggle ═══ -->
	<section class="pricing-section">
		<h2>Simple Pricing</h2>
		<p class="section-sub">Single credit never expires. Cancel subscription anytime.</p>

		<div class="pricing-cards">
			<div class="pricing-card">
				<div class="spotlight-emoji">&#9889;</div>
				<div class="spotlight-price">$3</div>
				<div class="spotlight-label">per session with AI coach</div>
				<p>One deep-dive coaching session to build a polished STAR story</p>
				<a style="align-self:center; display:flex; justify-content:center; text-decoration:none;" href={$userStore.loggedIn ? '/credits' : '/login'}>
					<button class="btn-primary">Get Started</button>
				</a>
			</div>
			<div class="pricing-card popular">
				<div class="popular-tag">Best Value</div>
				<div class="spotlight-emoji">&#128640;</div>
				<div class="spotlight-price">$30<span>/mo</span></div>
				<div class="spotlight-label">unlimited sessions with AI coach</div>
				<p>Build as many stories as you need. Perfect for active job seekers.</p>
				<a style="align-self:center; display:flex; justify-content:center; text-decoration:none;" href={$userStore.loggedIn ? '/credits' : '/login'}>
					<button class="btn-primary">Subscribe</button>
				</a>
			</div>
			<div class="pricing-card">
				<div class="spotlight-emoji">&#128170;</div>
				<div class="spotlight-price">Custom</div>
				<div class="spotlight-label">in-person coaching</div>
				<p>1-on-1 sessions with Yijun. Personalized strategy for your target areas.</p>
				<a style="align-self:center; display:flex; justify-content:center; text-decoration:none;" href="https://calendly.com/yijun-wang-mockinterview/book-a-15-min-free-interview-consultation" target="_blank">
					<button class="btn-ghost">Book a 15-min Free Consultation</button>
				</a>
			</div>
		</div>

		<div class="trust-strip">
			<span class="trust-icon">&#127974;</span>
			<p class="trust-headline">Your stories are yours — forever.</p>
			<p class="trust-body">Every STAR story, talking points, and all details from each session is saved to your personal Story Bank — at no cost. Come back anytime, and they'll be ready for your next interview without starting from scratch again.</p>
		</div>

	</section>

	<!-- ═══ FAQ ═══ -->
	<section class="faq-section">
		<h2>Questions?</h2>
		<div class="faq-container">
			<Accordion>
				<Panel>
					<Header>Is my data safe and private?</Header>
					<Content
						><p>
							Absolutely! Mockinterview.tech was built using the most up-to-date security and
							privacy best practices by people who've worked in the cybersecurity industry. We will
							not transmit any data you give us without your permission. <b>However, you should comply to your company's NDA rule the same here</b>.
						</p></Content
					>
				</Panel>
				<Panel>
					<Header>Do session credits expire?</Header>
					<Content><p>No, however the credits are <b>non-refundable</b> after purchase.</p></Content>
				</Panel>
				<Panel>
					<Header>I left my session mid-interview. Can I get my session credit back?</Header>
					<Content><p>If a technical issue prevents your session from starting, your credit is automatically refunded. Once a session is underway, you can only end it by clicking "Finish" — and you'll see a confirmation warning before it goes through. If you experience a crash mid-session, log in and contact us, we'll make it right.</p></Content>
				</Panel>
				<Panel>
					<Header>How do I shut down my account?</Header>
					<Content
						><p>
							We'd be sorry to see you go, however, you can log in and contact us for such request.
						</p></Content
					>
				</Panel>
				<Panel>
					<Header>Why not just use ChatGPT / Gemini / any general LLM?</Header>
					<Content
						><p>
							You absolutely can — and you'll get a generic answer that sounds okay but won't survive a real interview.
							A general LLM will help you <em>write</em> an answer, and <strong>only if you know HOW to guide that LLM to probe back</strong>. We help you <strong>build a story you can actually deliver</strong> under pressure.
						</p>
						<p>
							The AI coach runs a structured 20-minute session that mirrors how Yijun coaches — drawing out the details interviewers actually care about, pushing you to be specific where you're vague, and catching the gaps you didn't know you had. At the end, you get a polished narrative, key talking points for each STAR section, and <strong>Strength Signals</strong> — a breakdown of which evaluation criteria your story hits hard and where it falls short.
						</p>
						<p>
							Interviewers aren't just checking "did they use STAR-structured story." They evaluate signals like ownership, cross-functional influence, ambiguity navigation, and measurable business impact. 
							General LLMs don't know what those signals are upfront, <strong>nor do they proactively probe based on your specific situation</strong>. 
							Our designed coaching flow tells you which ones you're nailing and which ones need work. Every story gets saved to your <strong>Story Bank</strong>, so over multiple sessions you build a portfolio of interview-ready stories you can pull from on the spot. No matter when you need to interview again in the future, you will always have available stories where granularities don't die with time in memory.
						</p>
						<p>
							TL;DR — General LLM gives you a script. We give you a <strong>coached, pressure-tested, remarkable story</strong> ready for any upcoming behavior interviews.
						</p></Content
					>
				</Panel>
			</Accordion>
		</div>
	</section>

</div>

<style lang="scss">
	@import '../lib/styles/colors.scss';

	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	p, li { line-height: 1.7; color: $text-medium; }
	a { text-decoration: none; }

	.section-sub {
		font-size: 17px;
		margin-top: -4px;
		margin-bottom: 40px;
	}

	/* ══════════ HERO ══════════ */
	.hero {
		position: relative;
		width: 100vw;
		padding: 120px 6% 0;
		background: $gradient-hero;
		overflow: hidden;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: flex-end;
		gap: 50px;
	}

	.hero-text {
		flex: 1.2;
		min-width: 320px;
		padding-bottom: 60px;

		h1 {
			font-size: 52px;
			font-weight: 800;
			color: $text-dark;
			line-height: 1.1;
			margin: 0 0 20px;
		}

		strong {
			color: $primary;
		}
	}

	.hero-greeting {
		display: inline-block;
		background: $bg-peach;
		color: $primary;
		font-weight: 700;
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		padding: 6px 16px;
		border-radius: 50px;
		margin-bottom: 16px;
	}

	.hero-sub {
		font-size: 18px;
		color: $text-medium !important;
		line-height: 1.7;
		margin-bottom: 32px;
		max-width: 480px;
	}

	.hero-credential {
		font-size: 13px;
		font-weight: 600;
		color: $text-light !important;
		letter-spacing: 0.3px;
		margin-bottom: 28px;
	}

	.hero-actions {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
	}

	/* ── Hero photo area ── */
	.hero-photo-area {
		flex: 1;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		min-width: 300px;
		max-width: 500px;
	}

	.photo-wrapper {
		position: relative;
		z-index: 2;
	}

	.hero-portrait {
		width: 100%;
		max-width: 440px;
		height: auto;
		display: block;
		filter: drop-shadow(0 8px 30px rgba(45, 43, 61, 0.15));
	}

	@keyframes gentle-bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-8px); }
	}

	/* ── Floating mini coaching card ── */
	.mini-coaching-card {
		position: absolute;
		bottom: 40px;
		left: -40px;
		z-index: 3;
		background: white;
		border-radius: 16px;
		padding: 14px 18px;
		box-shadow: 0 12px 40px rgba(45, 43, 61, 0.15);
		min-width: 220px;
		animation: gentle-bob 6s ease-in-out infinite;
		animation-delay: -2s;

		.mini-header {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 11px;
			font-weight: 700;
			color: $text-dark;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			margin-bottom: 8px;
		}

		.mini-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: #4caf50;
			animation: pulse-dot 2s ease-in-out infinite;
		}

		.mini-msg {
			font-size: 13px;
			font-style: italic;
			color: $text-medium;
			margin: 0 0 10px;
			line-height: 1.5;
		}

		.mini-star-row {
			display: flex;
			gap: 6px;
		}
	}

	@keyframes pulse-dot {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.star-pill {
		padding: 4px 12px;
		border-radius: 50px;
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 1px;

		&.filled { background: #4caf50; color: white; }
		&.partial { background: #FFF0B3; color: #b8860b; }
		&.empty { background: #f0f0f0; color: #bbb; }
	}

	/* Blobs */
	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.45;
		z-index: 0;
		animation: float 8s ease-in-out infinite;
	}
	.blob-1 { width: 280px; height: 280px; background: $accent; top: -40px; right: 8%; }
	.blob-2 { width: 220px; height: 220px; background: $primary-light; bottom: -20px; left: 3%; animation-delay: -3s; }
	.blob-3 { width: 180px; height: 180px; background: $secondary-light; top: 40%; left: 55%; animation-delay: -5s; }

	@keyframes float {
		0%, 100% { transform: translateY(0) scale(1); }
		50% { transform: translateY(-20px) scale(1.05); }
	}

	/* ══════════ BUTTONS ══════════ */
	.btn-primary {
		background: $gradient-warm;
		color: white;
		border: none;
		padding: 14px 32px;
		border-radius: 50px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		font-family: inherit;
		text-align: center;
		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(232, 115, 90, 0.35);
		}
	}

	.btn-ghost {
		background: none;
		color: $text-dark;
		border: none;
		padding: 14px 20px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
		transition: color 0.2s;
		text-align: center;
		&:hover { color: $primary; }
	}

	/* ══════════ TRANSFORM ══════════ */
	.transform-section {
		width: 100%;
		max-width: 1100px;
		padding: 70px 6%;
		text-align: center;

		h2 { font-size: 34px; font-weight: 700; color: $text-dark; margin-bottom: 36px; }
	}

	.section-sub-lead {
		font-size: 17px;
		color: $text-light !important;
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.transform-container {
		display: flex;
		align-items: stretch;
		gap: 24px;
		margin-top: 36px;

		@media (max-width: 960px) {
			flex-direction: column;
			align-items: center;
		}
	}

	.transform-card {
		flex: 1;
		border-radius: $card-radius;
		padding: 28px 24px;
		text-align: left;

		&.before {
			background: #FFF5F5;
			border: 2px dashed #FFCACA;
			p {
				font-style: italic;
				color: #999;
				font-size: 17px;
				line-height: 1.7;
			}

			.before-cost {
				margin-top: 20px;
				padding-top: 16px;
				border-top: 1px solid #FFCACA;

				.cost-line {
					font-style: normal;
					font-size: 16px;
					font-weight: 600;
					color: $text-medium;
					margin: 0 0 8px;
					line-height: 1.6;

					strong {
						color: #e53e3e;
					}

					&.severe {
						font-size: 17px;
						color: #e53e3e;
						font-weight: 700;
					}
				}
			}
		}
		&.after {
			background: white;
			box-shadow: $card-shadow;
			border: 2px solid #E8F5E9;
		}
	}

	.transform-label {
		font-weight: 700;
		font-size: 18px;
		margin-bottom: 16px;
		color: $text-dark;
	}

	.transform-arrow {
		display: flex;
		align-items: center;
		font-size: 32px;
		color: $primary;
		flex-shrink: 0;
		@media (max-width: 960px) {
			transform: rotate(90deg);
		}
	}

	.after-sections {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.after-row {
		display: flex;
		align-items: flex-start;
		gap: 12px;

		p {
			font-size: 16px;
			margin: 0;
			line-height: 1.6;
			color: $text-dark;
		}
	}

	.star-badge {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 12px;
		color: white;
		margin-top: 1px;

		&.s { background: #4caf50; }
		&.t { background: #2196f3; }
		&.a { background: #ff9800; }
		&.r { background: #9c27b0; }
	}

	/* ══════════ STEPS ══════════ */
	.steps-section {
		width: 100%;
		background: white;
		padding: 70px 6%;
		text-align: center;

		h2 { font-size: 34px; font-weight: 700; color: $text-dark; margin-bottom: 40px; }
	}

	.steps {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 0;
		max-width: 900px;
		margin: 0 auto;

		@media (max-width: 768px) {
			flex-direction: column;
			align-items: center;
			gap: 12px;
		}
	}

	.step {
		flex: 1;
		max-width: 260px;
		padding: 0 20px;
		position: relative;

		.step-number {
			width: 36px;
			height: 36px;
			border-radius: 50%;
			background: $gradient-warm;
			color: white;
			font-weight: 800;
			font-size: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto 12px;
		}

		.step-icon {
			font-size: 40px;
			margin-bottom: 12px;
		}

		h3 {
			font-size: 18px;
			font-weight: 700;
			color: $text-dark;
			margin-bottom: 8px;
		}

		p {
			font-size: 14px;
			line-height: 1.6;
		}
	}

	.step-connector {
		width: 60px;
		height: 2px;
		background: linear-gradient(90deg, $primary-light, $secondary-light);
		margin-top: 54px;
		flex-shrink: 0;
		border-radius: 2px;

		@media (max-width: 768px) {
			width: 2px;
			height: 30px;
			margin-top: 0;
		}
	}

	/* ══════════ FEATURES ══════════ */
	/* ══════════ CLIENT OUTCOMES ══════════ */
	.outcomes-section {
		width: 100%;
		padding: 40px 6% 32px;
		text-align: center;
	}

	.outcomes-label {
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: $text-medium;
		margin: 0 0 24px;
	}

	.outcomes-logos {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 32px;
		max-width: 800px;
		margin: 0 auto;
	}

	.outcomes-logo {
		display: flex;
		align-items: center;
		justify-content: center;

		img {
			height: 24px;
			width: auto;
			opacity: 0.7;
			transition: opacity 0.3s;
		}

		&:hover img {
			opacity: 1;
		}
	}

	.outcomes-sub {
		font-size: 18px;
		color: $text-medium;
		margin: 24px 0 0;
		font-style: italic;
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.outcomes-logos {
			gap: 24px;
		}
		.outcomes-logo img {
			height: 24px;
		}
	}

	/* ══════════ SECTION DIVIDER ══════════ */
	.section-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 0;

		&::before, &::after {
			content: '';
			width: 200px;
			height: 1px;
			background: rgba(45, 43, 61, 0.15);
		}

		span {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: rgba(45, 43, 61, 0.2);
			margin: 0 14px;
		}
	}

	/* ══════════ TESTIMONIALS ══════════ */
	.testimonials-section {
		width: 100%;
		padding: 0 20px 40px;
		text-align: center;
		overflow: hidden;

		h2 {
			font-size: 34px;
			font-weight: 700;
			color: $text-dark;
			margin-bottom: 8px;
		}
	}

	.testimonials-wall {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 40px;
		overflow: hidden;
		mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
		-webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
	}

	.testimonials-row {
		overflow: hidden;
	}

	.testimonials-track {
		display: flex;
		gap: 16px;
		width: max-content;
	}

	.scroll-left .testimonials-track {
		animation: scroll-left 40s linear infinite;
	}

	.scroll-right .testimonials-track {
		animation: scroll-right 40s linear infinite;
	}

	@keyframes scroll-left {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	@keyframes scroll-right {
		0% { transform: translateX(-50%); }
		100% { transform: translateX(0); }
	}

	.testimonial-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 2px 12px rgba(45, 43, 61, 0.06);
		display: flex;
		gap: 16px;
		align-items: flex-start;
		height: 180px;
		flex-shrink: 0;
		overflow: hidden;
	}

	.testimonial-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: $bg-peach;
		flex-shrink: 0;
		object-fit: cover;
	}

	.testimonial-body {
		flex: 1;
		text-align: left;
	}

	.testimonial-text {
		font-size: 14px;
		line-height: 1.6;
		color: $text-medium;
		margin: 0 0 10px;
		font-style: italic;
	}

	.testimonial-name {
		font-size: 14px;
		font-weight: 700;
		color: $text-dark;
		margin: 0;
	}

	.testimonial-role {
		font-size: 12px;
		color: $text-light;
		margin: 2px 0 0;
	}

	.testimonials-wall:hover .testimonials-track {
		animation-play-state: paused;
	}

	@media (max-width: 640px) {
		.testimonial-card {
			max-width: 360px;
		}
	}

	/* ══════════ PRICING ══════════ */
	.pricing-section {
		width: 100%;
		padding: 70px 6%;
		text-align: center;
		background: $gradient-hero;

		h2 { font-size: 34px; font-weight: 700; color: $text-dark; margin-bottom: 8px; }
	}

	.pricing-cards {
		display: flex;
		gap: 24px;
		justify-content: center;
		align-items: stretch;
		max-width: 960px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.pricing-card {
		background: white;
		border-radius: 24px;
		padding: 40px 32px;
		flex: 1;
		max-width: 300px;
		box-shadow: $card-shadow;
		position: relative;
		overflow: hidden;
		transition: transform 0.3s;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		&:hover { transform: translateY(-4px); }

		&.popular {
			border: 2px solid $primary;
		}

		.popular-tag {
			position: absolute;
			top: 0;
			right: 0;
			background: $gradient-warm;
			color: white;
			padding: 6px 20px;
			font-size: 12px;
			font-weight: 700;
			text-transform: uppercase;
			border-bottom-left-radius: 12px;
		}

		.spotlight-emoji {
			font-size: 40px;
			margin-bottom: 8px;
		}

		.spotlight-price {
			font-size: 48px;
			font-weight: 800;
			color: $text-dark;

			span {
				font-size: 18px;
				font-weight: 500;
				color: $text-light;
			}
		}

		.spotlight-label {
			font-size: 14px;
			color: $text-light;
			font-weight: 500;
			margin-bottom: 16px;
		}

		p {
			font-size: 14px;
			margin-bottom: 24px;
			flex: 1;
		}

		:global(a) {
			align-self: center;
			text-decoration: none;
		}
		:global(button) {
			margin: 0;
			align-self: center;
		}
	}

	@media (max-width: 768px) {
		.pricing-cards {
			flex-direction: column;
			align-items: center;
		}
		.pricing-card {
			max-width: 360px;
			width: 100%;
		}
	}

	/* ══════════ TRUST STRIP ══════════ */
	.trust-strip {
		text-align: center;
		padding: 40px 6% 10px;
		max-width: 860px;
		margin: 0 auto;
	}

	.trust-icon {
		font-size: 36px;
		display: block;
		margin-bottom: 10px;
	}

	.trust-headline {
		font-size: 22px;
		font-weight: 800;
		color: $primary-dark;
		margin: 0 0 8px;
	}

	.trust-body {
		font-size: 15px;
		color: $text-dark;
		font-weight: 500;
		margin: 0;
		line-height: 1.6;
	}

	/* ══════════ FAQ ══════════ */
	.faq-section {
		width: 100%;
		max-width: 700px;
		padding: 70px 6% 100px;
		text-align: center;

		h2 { font-size: 34px; font-weight: 700; color: $text-dark; margin-bottom: 24px; }
	}

	.faq-container {
		text-align: left;
	}

	.contact-link {
		color: $primary;
		font-weight: 600;
		&:hover { color: $primary-dark; }
	}

	/* ══════════ RESPONSIVE ══════════ */
	/* Stack hero when photo can't fit beside text (~950px) */
	@media (max-width: 960px) {
		.hero {
			padding: 80px 6% 0;
		}
		.hero-inner {
			flex-direction: column;
			gap: 30px;
			text-align: center;
		}
		.hero-text {
			min-width: unset;
			padding-bottom: 0;
		}
		.hero-sub {
			max-width: 600px;
			margin-left: auto;
			margin-right: auto;
		}
		.hero-actions {
			justify-content: center;
			margin-bottom: 20px;
		}
		.hero-photo-area {
			min-width: unset;
			max-width: 300px;
			width: 100%;
			margin: 0 auto;
		}
		.hero-portrait {
			max-width: 280px;
			margin: 0 auto;
		}
		.mini-coaching-card {
			left: auto;
			right: -10px;
			bottom: 20px;
		}
	}

	/* Smaller mobile refinements */
	@media (max-width: 480px) {
		.hero-text h1 {
			font-size: 28px;
		}
		.hero-sub {
			font-size: 15px;
		}
		.hero-credential {
			font-size: 12px;
		}
		.hero-photo-area {
			max-width: 260px;
		}
		.hero-portrait {
			max-width: 240px;
		}
		.mini-coaching-card {
			min-width: 170px;
			padding: 10px 14px;

			.mini-msg {
				font-size: 12px;
			}
		}
		.transform-section h2,
		.steps-section h2,
		.pricing-section h2,
		.faq-section h2 {
			font-size: 28px;
		}
	}
</style>
