<script lang="ts">
	import { page } from '$app/stores';
	import PromptBlock from './PromptBlock.svelte';

	const SITE_URL = 'https://mockinterview.tech';
	const PAGE_URL = `${SITE_URL}/resumegateframework`;
	const PAGE_TITLE = 'Why Your Resume Isn’t Getting Callbacks | mockinterview.tech';
	const PAGE_DESC =
		"There are four places an application dies and the fix for each is different. Free interrogation prompts for the ones you can fix at your desk — they ask you questions before they write anything.";

	let email = '';
	let submitting = false;
	let submitted = false;
	let submitError = '';
	let unlockedFromStorage = false;

	// Honeypot. Hidden from people and from screen readers; bots that fill every
	// field give themselves away. The server silently drops anything non-empty.
	let company = '';

	$: unlockedFromParam = $page.url.searchParams.get('u') === '1';
	$: unlocked = unlockedFromParam || unlockedFromStorage || submitted;

	import { onMount } from 'svelte';
	onMount(() => {
		unlockedFromStorage = localStorage.getItem('gates_unlocked') === '1';
	});

	async function handleSubmit() {
		if (!email || submitting) return;
		submitting = true;
		submitError = '';

		try {
			const res = await fetch('/resumegateframework/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, company })
			});
			if (res.status === 429) throw new Error('rate limited');
			if (!res.ok) throw new Error('subscribe failed');

			localStorage.setItem('gates_unlocked', '1');
			submitted = true;
		} catch (err) {
			submitError =
				err instanceof Error && err.message === 'rate limited'
					? "That's a few tries in a row — give it a few minutes."
					: 'Something went wrong — try again in a moment.';
		} finally {
			submitting = false;
		}
	}

	const TEASER_PROMPT = `You are a certified professional resume writer. Your job right now is NOT to
write anything. It is to interrogate one bullet until the real story is on the
table.

Here is my bullet:
"[PASTE ONE BULLET]"

Collect exactly three things from me:

1. BASELINE — what the number or state was before. The scale it operated at.
2. CONSEQUENCE — why it mattered to the business. What breaks if it doesn't
   happen. Who cared, and what it was worth to them.
3. MECHANISM — what I actually did that caused the change.

How to ask me:

- One question at a time. Wait for my answer. Never batch questions.
- Start by defining any vague word in my bullet. If I wrote "performance,"
  "efficiency," "engagement," or "impact," your first question is what I
  actually mean by it.
- Then work through the three items above in whatever order fits my answers.

Useful questions, drawn from how a coach actually probes:
- "Compared to what? What was normal before?"
- "What breaks if this doesn't happen? Who notices?"
- "Was that protecting revenue you already had, or winning revenue you didn't?"
- "Did you decide the approach, or carry out someone else's decision?"
- "How many teams, systems, or people, were involved?"

ALSO ASK FOR THESE TWO - they are what make a bullet impossible to "steal", so
I can stand out from other resumes:

NAME THE SPECIFIC THING. Ask what the system, tool, product, team, or
framework was actually called. Use the real name if it isn't confidential - it
is both un-copyable and a term a recruiter may search for.

WHAT MADE IT HARD. Ask what the constraint, trade-off, or friction was. A
legacy system nobody had touched in years, two teams that disagreed, a
deadline set before the scope was known. "Delivered on time" is a claim
anyone can make; "delivered on time despite X" is a claim only I can.
Seniority reflects what I had to navigate.

THE TEST FOR EVERY ANSWER I GIVE YOU:
Could this sentence be true of a stranger's project? If yes, it is not specific
enough. Ask again - do not accept it and move on.

Say the verdict out loud every time, in a few words, before your next
question: "that could be anyone's - still too general," or "that one's only
yours." If you don't say it, I have no way to know whether you ran it.

A NUMBER IS NOT AUTOMATICALLY AN OUTCOME.
"Ran 200+ standups," "managed 20 campaigns," "filed 3,000 bugs" are counts of
activity, not measures of change. If my number counts things I did rather than
what moved because I did them, ask me what actually changed.

HARD RULES:
- Never invent, assume, or fill in any of the three items. If I haven't told
  you, it stays empty. A plausible guess is a failure, not a help.
- Do NOT rewrite a bullet until you have all three from my own words.
  Not a draft, not a "here's roughly what it might look like."
- If I try to move on early, say what's still missing and ask again.

IF I DON'T HAVE EXACT NUMBERS:

Estimating from memory is fine - I lived it and can back it up. Inventing one
for me is not.

- Ask me to estimate, then ask HOW I got there. "We handled roughly 80-100 a
  week, so a third is about 25-30" is a real answer. "Around 30%" with no basis
  behind it is not - push back and ask what it's based on.
- Write estimates hedged: "~30%", "roughly 25", "about two quarters."
- If I have no number at all, ask for a concrete consequence instead. "The CFO
  stopped asking for weekly status updates" isn't a metric, but it's specific
  and nobody else can claim it.
- YOU never supply a number - not as a statement, not as a suggestion, and not
  as a range for me to agree to. "Would 15-20% be fair?" is a violation, not a
  question. Simple check: if a figure appears in your message before it
  appeared in mine, you broke this rule. If I can't give a number and can't
  give a consequence either, say the bullet isn't ready and tell me what to go
  find.

THE TEST: if an interviewer asked "how did you get that number?", could I
answer? If yes, use it. If no, it doesn't go on the page.

WHEN YOU HAVE ALL THREE:
Rewrite the bullet. Nothing I didn't tell you — no invented numbers, no
inflated scope, no added causation.

If I tell you I genuinely don't remember something, write the bullet with what
exists AND state plainly which of the three is still missing. Don't hide the
gap.`;

	const STEP1_PROMPT = `You are a career strategist. Do not reassure me and do not flatter me.

Here is my resume:
[PASTE RESUME]

I am considering applying for: [TARGET ROLE — or write "not sure" if you
don't know]
My company-assigned title is: [YOUR CURRENT TITLE]

There may be a disconnect between my title and the work I actually did.
Company titles are naming conventions, not descriptions of work. Use my resume
to know which projects and roles existed, then probe behind it — don't assume
what's on the page is the whole story, and don't assume anything missing
didn't happen.

FIRST, BEFORE ANY QUESTIONS: read the titles across my whole resume — the
headline at the top and the title on every role — and tell me whether they
agree with each other. If the top of my resume already claims the target title
but none of my roles carry it, say so plainly. That is the first thing a
recruiter notices, and I may not have noticed it myself.

Interrogate me about what I actually owned. One question at a time.

Probe specifically for the difference between OWNING an outcome and
PARTICIPATING in it:
- Who made the call when there was a disagreement?
- What happened if it went wrong — who answered for it?
- Did you set the direction, or execute a direction someone else set?
- What did you own that nobody else owned?

Ask about scope: how many teams, systems, people, or dollars.
Ask what a normal week actually looked like.

PROXIMITY IS NOT PARTICIPATION.
For each core capability my target role requires, probe how deep my
involvement actually went:
- Was I in the room for those discussions, or contributing to them?
- Did I make or influence the decisions, or watch them get made?
- When leadership had a question in that area, did I answer it — or did I go
  find the person who could?
- Did I build it, or coordinate the people who built it? Both are real work,
  but they are different claims.
If I describe being "involved in," "part of," or "exposed to" something, ask
what I specifically contributed. Those phrases usually mean presence rather
than participation.

THEN CHECK FOR WORK I LEFT OFF ENTIRELY.
Ask me about categories of work people routinely omit, adapted to my target
role:
- Things I built that didn't exist before — a system, a process, a team, a
  function
- Things I replaced, migrated, retired, or turned around
- Things I killed or simplified because they weren't working
- People I developed — mentoring, training, hiring, onboarding
- Times I was the bridge between groups that don't normally talk
- Crises or failures I was pulled into
People leave these off because they don't feel impressive from the inside, or
because the resume was written from a different job's perspective. If I say
"that's all," ask once more about the categories I skipped. Tell me which of
what I describe is missing from my resume entirely.

THE TEST: if my answer could be true of anyone with a similar title, it's not
specific enough. Ask again.

After 5-8 questions, tell me plainly:

IF I NAMED A TARGET ROLE:
1. Which job family my actual work belongs to — which may not be the one I
   named, and may not be the one my title says.
2. Whether my target is supported by the evidence, a stretch I could close, or
   a mismatch I should drop.
3. If it's a stretch: exactly what evidence is missing and how I'd build it.

IF I SAID "NOT SURE":
1. The 2-3 job families my actual work best supports, ranked, and what in my
   answers points to each one.
2. Which is the strongest bet right now, and which would need evidence I don't
   have yet.

IN EITHER CASE, if my work supports a role my title doesn't say:
- What functional title would describe the work honestly on my resume
- Which of my experiences carry the strongest signal for that role
- Which to lead with, and which to shrink

Be honest even if the answer is that I'm not there yet. Telling me what I want
to hear costs me months.`;

	const STEP2_PROMPT = `Here is a job description:

[PASTE THE JOB DESCRIPTION]

List every specifically named thing in it — tools, technologies, platforms,
certifications, methodologies, and products or domains. Names only: not
responsibilities, not adjectives, not soft skills.

Then tell me two things, separately:

1. Does this posting name enough specific things for a recruiter to search
   on? Or is it mostly generic responsibilities?

2. Does it say anything concrete about WHICH team, what they're building, or
   what problem this role exists to solve? "TPM, Alexa voice team" and "TPM"
   are very different postings.

If (1) is thin, tell me to go gather comparable postings from the same company.
If (2) is thin, tell me the posting won't tell me what this team actually
needs — I'll have to find that out elsewhere before I decide what to emphasize
or what to ask in the room.

Don't pad a short list to be encouraging. If it's thin, say so.`;

	const STEP3_PROMPT = `You are a certified professional resume writer running an intake session with
me. Your job right now is NOT to write anything. It is to get the real story
of one job out of my head and onto the table.

THE ROLE WE'RE WORKING ON:
Company: [COMPANY]
My title: [TITLE]
Dates: [DATES]
I'm targeting: [TARGET ROLE]

What's currently on my resume for this role, if anything:
[PASTE THE EXISTING BULLETS — or write "nothing yet"]

Work I know is missing from the page:
[LIST ANYTHING STEP 1 SURFACED — or write "not sure"]

HOW TO RUN THIS:

Ask me one question at a time. Never batch. Wait for my answer.

Start with the arc of the job, not the bullets:
- What was I hired to do?
- What did I inherit — what state was it in when I arrived?
- What was different by the time I left?
- What was I the person for? What came to me that didn't come to anyone else?

Then work through the specific pieces of work one at a time. For each one,
collect three things:

1. BASELINE — what the number or state was before. The scale it operated at.
2. CONSEQUENCE — why it mattered to the business. What breaks if it doesn't
   happen. Who cared, and what it was worth to them.
3. MECHANISM — what I actually did that caused the change.

Useful questions, drawn from how a coach actually probes:
- "Compared to what? What was normal before?"
- "What breaks if this doesn't happen? Who notices?"
- "What would have happened if you hadn't been there?"
- "Was that protecting revenue you already had, or winning revenue you didn't?"
- "Did you decide the approach, or carry out someone else's decision?"
- "How many teams, systems, or people, were involved?"

ALSO ASK FOR THESE TWO — they are what make a bullet impossible to "steal," so
I can stand out from other resumes:

NAME THE SPECIFIC THING. Ask what the system, tool, product, team, or
framework was actually called. Use the real name if it isn't confidential —
it is both un-copyable and a term a recruiter may search for.

WHAT MADE IT HARD. Ask what the constraint, trade-off, or friction was. A
legacy system nobody had touched in years, two teams that disagreed, a
deadline set before the scope was known. "Delivered on time" is a claim
anyone can make; "delivered on time despite X" is a claim only I can.
Seniority reflects what I had to navigate.

BEFORE YOU STOP, SWEEP FOR WHAT I LEFT OUT.
Ask me about categories of work people routinely omit:
- Things I built that didn't exist before
- Things I replaced, migrated, retired, or turned around
- Things I killed or simplified because they weren't working
- People I developed — mentoring, training, hiring, onboarding
- Times I was the bridge between groups that don't normally talk
- Crises or failures I was pulled into
If I say "that's all," ask once more about the categories I skipped. People
leave these off because they don't feel impressive from the inside.

THE TEST FOR EVERY ANSWER I GIVE YOU:
Could this sentence be true of a stranger's project? If yes, it is not specific
enough. Ask again — do not accept it and move on.

Say the verdict out loud every time, in a few words, before your next
question: "that could be anyone's — still too general," or "that one's only
yours." If you don't say it, I have no way to know whether you ran it.

A NUMBER IS NOT AUTOMATICALLY AN OUTCOME.
"Ran 200+ standups," "managed 20 campaigns," "filed 3,000 bugs" are counts of
activity, not measures of change. If my number counts things I did rather than
what moved because I did them, ask me what actually changed.

HARD RULES:
- Never invent, assume, or fill in anything. If I haven't told you, it stays
  empty. A plausible guess is a failure, not a help.
- Do NOT write anything until the intake is done. Not a draft, not a "here's
  roughly what it might look like." Nothing.
- If I try to move on early, say what's still missing and ask again.

IF I DON'T HAVE EXACT NUMBERS:

Estimating from memory is fine — I lived it and can back it up. Inventing one
for me is not.

- Ask me to estimate, then ask HOW I got there. "We handled roughly 80-100 a
  week, so a third is about 25-30" is a real answer. "Around 30%" with no basis
  behind it is not — push back and ask what it's based on.
- Write estimates hedged: "~30%", "roughly 25", "about two quarters."
- If I have no number at all, ask for a concrete consequence instead. "The CFO
  stopped asking for weekly status updates" isn't a metric, but it's specific
  and nobody else can claim it.
- YOU never supply a number — not as a statement, not as a suggestion, and not
  as a range for me to agree to. "Would 15-20% be fair?" is a violation, not a
  question. Simple check: if a figure appears in your message before it
  appeared in mine, you broke this rule. If I can't give a number and can't
  give a consequence either, say that piece isn't ready and tell me what to go
  find.

THE TEST: if an interviewer asked "how did you get that number?", could I
answer? If yes, use it. If no, it doesn't go on the page.

WHEN THE INTAKE IS DONE:

1. Write every bullet the material supports — deliberately more than will fit
   on a resume. I'll cut later.
2. Use only what I gave you. No invented numbers, no inflated scope, no added
   causation.
3. NO FACT MAY CARRY TWO BULLETS. If the same achievement appears twice in
   different words, that's one bullet, not two. If the material only supports
   one bullet, write one.
4. Mark any bullet that is still missing a baseline, a consequence, or a
   mechanism, and say which.

If I tell you I genuinely don't remember something, write the bullet with what
exists AND state plainly which of the three is still missing. Don't hide the
gap.`;

	const STEP4_PROMPT = `I'm targeting this role:

[PASTE THE TARGET JOB DESCRIPTION — or, if you don't have one yet, just write
the target title and level]

Here are real postings for that role at a similar title and level:

[PASTE COMPARABLE POSTINGS]

And here is my resume:

[PASTE RESUME]

Do this, in order:

1. Across the comparable postings, extract every specifically named tool,
   technology, platform, certification, methodology, and domain term. Names
   only — not verbs, not adjectives, not responsibilities.

2. Rank them: which appear across most postings (this company's standard
   vocabulary) vs. which appear only once.

3. If I gave you a target posting: tell me which of those terms it left out.
   These matter most — the recruiter may well search on them even though they
   never wrote them down. If I only gave you a title, skip this and treat the
   recurring terms from step 2 as the vocabulary to work against.

4. Now compare against my resume. Two lists — these you CAN determine:
   - Terms from the postings that already appear on my resume
   - Terms from the postings that do NOT appear on my resume

5. For that second list, do NOT guess whether I have the experience — you have
   no way to know. Ask me. Go through them in small batches and ask which ones
   I've actually done.

6. For the ones I confirm: tell me exactly where to put them, using the
   posting's exact wording — if they write "Kubernetes," I write "Kubernetes,"
   not "K8s."

RULES:
- Never assume I have or don't have an experience. My resume is the only thing
  you can see, and it is incomplete — that's the entire point of this exercise.
- Never suggest I add a term I haven't confirmed. If I tell you I haven't done
  it, it doesn't go on the page.
- Do NOT rewrite my sentences to sound like the postings. Copy their
  vocabulary, never their phrasing — a resume that reads like the job
  description fed back is a known red flag.`;

	const STEP5_PROMPT = `Here is my full resume:

[PASTE ENTIRE RESUME]

I'm targeting: [TARGET ROLE]

Do NOT rewrite anything. Do not propose replacement wording. Do not add,
estimate, or infer any fact that is not already on the page. Read this the way
a recruiter reads it — as one document, top to bottom, in a single pass.

Report only what you can actually see:

1. THE NUMBERS, AS A SET. List every number and percentage in order. Flag any
   value that appears more than once. Then tell me whether they vary the way
   real measurements vary, or whether nearly all of them land on the same few
   figures. A round number is normal on its own. A page where almost every
   bullet ends in one is the pattern I want to know about.

2. REPEATED LANGUAGE. Which verbs, phrases, and claims show up more than once
   across roles.

3. TENSE. Where it shifts inside a single role.

4. THE SAME CLAIM TWICE. Which bullets are making substantially the same point
   in different words.

5. WHAT'S EARNING ITS SPACE. Given my target, which bullets carry the
   strongest signal for it and which are taking up room without doing work.
   Tell me which role's section is contributing least, and which role deserves
   more space than it currently has.

6. THE STRANGER TEST, AT PAGE SCALE. Which bullets could sit on the resume of
   anyone with my title. List them worst first.

For anything you flag, do not fix it. Tell me which piece of work to take back
through the intake.`;
</script>

<svelte:head>
	<title>{PAGE_TITLE}</title>
	<meta name="description" content={PAGE_DESC} />
	<link rel="canonical" href={PAGE_URL} />
	<meta name="robots" content="index, follow" />

	<meta property="og:type" content="article" />
	<meta property="og:title" content={PAGE_TITLE} />
	<meta property="og:description" content={PAGE_DESC} />
	<meta property="og:url" content={PAGE_URL} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={PAGE_TITLE} />
	<meta name="twitter:description" content={PAGE_DESC} />
</svelte:head>

<div class="page">
	<div class="wrap">
		<!-- Hero -->
		<section class="hero">
			<h1>The Resume Gate Framework</h1>
			<p class="lede">Nobody tells you why you were rejected. So you guess, and you usually fix the wrong thing.</p>
			<p>There are 4 places an application dies. From your side they all look the same: <b>silence</b>. But the fix for each one is completely different.</p>
			<p>Below is the one idea popular resume prompts going around are missing: <span class="highlight">a good one asks you questions before it writes anything, and won't fill in what you haven't told it</span>. Try it on a single bullet and you'll see the difference in about three exchanges.</p>
		</section>

		<!-- The Gate map -->
		<section>
			<h2>The Gate map</h2>
			<p><strong>🚪 Gate 0 - Target.</strong> If you ever questioned, are you aiming at the right role at all?</p>
			<p><strong>🚪 Gate 1 - Filter.</strong> Do you show up in the search a recruiter runs in the ATS?</p>
			<p><strong>🚪 Gate 2 - Skim.</strong> Does a human believe in your bullets? Are those bullets "stealable" by your competitors?</p>
			<p><strong>🚪 Gate 3 - Defense.</strong> Can you back it up out loud in the interview room?</p>
		</section>

		<!-- Find your problematic gate -->
		<section>
			<h2>Find your problematic gate</h2>
			<p>❌ <strong>No callbacks at all</strong> → Gate 0 or 1. Your signal doesn't match your substance.</p>
			<p>❌ <strong>Screened, then silence</strong> → Gate 2. They read you and didn't believe it.</p>
			<p>❌ <strong>Interviews, no offers</strong> → Gate 3. The page promised more than you delivered.</p>
			<p>The trap is treating all these symptoms like a Gate 1 problem - more keywords, tighter formatting, another prompt off LinkedIn. If you're wrong at Gate 0, better keywords only make you fail faster.</p>
		</section>

		<!-- Try it on one bullet -->
		<section>
			<h2>Try it on one bullet</h2>
			<p><strong>Why it's a conversation and not a one-shot?</strong> Most resume prompts going around work the same way - you paste, it produces, you're done in a single exchange. <b>That single turn is the problem</b>. An LLM model can only rewrite what's on your page, and the thing that makes a bullet believable, what the number was before and why it mattered and what you actually did, is in your head where the model has no way to reach. It can't stop and ask you, so it AI-slops back. It doesn't know the difference between a thin bullet and a thin career.</p>

			<p>Mine is built to ask. Paste any bullet, straight off your current resume.</p>

			<PromptBlock code={TEASER_PROMPT} />


			<p><strong>If it starts writing before it has asked you anything</strong>, stop it: <em>"Don't write anything yet. Ask me one question at a time until you have all three."</em> That's usually enough to get it back. It's the prompt slipping, not you — and it's worth knowing that this one talks back, so it costs more messages than a paste-and-go prompt does.</p>

			<p><strong>If it comes back saying the bullet isn't ready</strong>, that it needs something you can't give it yet — that's the tool working, not failing. You've just found out which line on your resume can't survive being asked about, which is better learned here than in the room.</p>
		</section>

		<!-- What four questions do to a bullet -->
		<section>
			<h2>What four questions do to a bullet</h2>
			<p class="caption">An illustration, not a client transcript.</p>
			<div class="before-after">
				<div class="ba-card">
					<span class="ba-label">Before</span>
					<blockquote>"Improved performance by 10%."</blockquote>
				</div>
				<div class="ba-card">
					<span class="ba-label">After</span>
					<blockquote>"Cut service response latency 10% to hold new enterprise SLA commitments, protecting ~$200K of at-risk revenue."</blockquote>
				</div>
			</div>
			<p>Same project. Same number. What sits between them is four questions — what "performance" actually meant, why 10% mattered, what would have broken if they'd missed it, and what that was worth. Every answer was his. None of them were on his resume, because nobody had ever asked.</p>
		</section>

		<!-- What this won't do -->
		<section>
			<h2>What this won't do</h2>
			<p>It won't hear your hesitation. It won't notice the thing you're steering around. It won't know your industry's tells.</p>
			<p>That part still takes a person. I'd rather tell you that up front than let you find out at the wrong moment.</p>
		</section>

		<!-- The fold -->
		<section class="fold">
			{#if !unlocked}
				<h2>That was one bullet. Below is the whole method, in the order a resume writer would actually work it.</h2>
				<ul class="fold-bullets">
					<li><strong>The target check</strong> — <em>for when you're not sure your title matches what you actually did</em></li>
					<li><strong>The keyword gap</strong> — the terms a thin posting left out</li>
					<li><strong>The full interrogation</strong> — role by role, not line by line</li>
					<li><strong>The allocation pass</strong> — what makes the cut, and what shrinks</li>
					<li><strong>The room</strong> — why none of the above can be faked</li>
				</ul>

				<form class="fold-form" on:submit|preventDefault={handleSubmit}>
					<!--
						Honeypot: hidden from sighted users by CSS and from assistive tech by
						aria-hidden + tabindex, so nobody can fill it by accident. Bots that
						fill every input give themselves away, and the server drops those
						quietly. Not type="hidden" — bots skip those on purpose.
					-->
					<div class="hp-field" aria-hidden="true">
						<label for="rgf-company">Company (leave this empty)</label>
						<input
							id="rgf-company"
							type="text"
							name="company"
							tabindex="-1"
							autocomplete="off"
							bind:value={company}
						/>
					</div>
					<input
						type="email"
						required
						placeholder="you@email.com"
						bind:value={email}
						disabled={submitting}
					/>
					<button type="submit" disabled={submitting}>
						{submitting ? 'Sending…' : 'Unlock the full method'}
					</button>
				</form>
				{#if submitError}
					<p class="fold-error">{submitError}</p>
				{/if}
			{:else if submitted}
				<p class="fold-done">Check your inbox — the rest of the method is open below.</p>
			{:else}
				<p class="fold-done">You're unlocked — the rest of the method is open below.</p>
			{/if}
		</section>

		<!-- Intro — heading + first paragraph + partial second paragraph always visible, rest gated -->
		<section class="gate-tease" class:pre-fold={!unlocked}>
			<h2>The gates tell you where you're dying. This is the order you fix it in.</h2>
			<p>The four gates are a diagnosis — four places an application dies. They aren't a to-do list, and the numbers aren't the running order. What follows is.</p>
			<p>It mirrors <span class:blur-1={!unlocked}>how a resume writer actually runs an intake: settle the target first,</span> <span class:blur-2={!unlocked}>because everything downstream gets edited against it.</span> <span class:blur-3={!unlocked}>Then go role by role</span> <span class:blur-4={!unlocked}>and deliberately collect more than will fit.</span> <span class:blur-5={!unlocked}>Only then decide what makes the page,</span> <span class:blur-6={!unlocked}>and how much room each job gets.</span></p>

			{#if unlocked}
				<p>Six steps, and they're not all the same kind of work. <strong>Steps 1, 3, 5 and 6 you do once</strong> — that's building the resume. <strong>Steps 2 and 4 you repeat for each job you apply to</strong> — that's tailoring it.</p>

				<p>If you don't have a specific posting in front of you yet, that's fine. Skip Step 2, and run Step 4 against postings for your target title generally. You'll be building on the vocabulary the field uses, which is the right baseline anyway — you can narrow it to a particular job later.</p>
			{/if}
		</section>

		{#if unlocked}
			<!-- Step 1 -->
			<section>
				<h2>Step 1 — The target check <em>(Gate 0)</em></h2>
				<div class="callout">
					<p>Skip this if you're confident your title reflects what you actually did. Run it if you're not sure — or if you're getting calls for the wrong kind of role.</p>
				</div>
				<p><strong>Why it interrogates instead of just reading your resume.</strong> Your resume was written from where you've been. If you're aiming somewhere else, the work that proves you belong there is either described in the old job's language or left off entirely — usually because it didn't feel impressive from the inside. So this prompt asks from the target role's perspective, not your resume's, and it goes looking for what isn't on the page.</p>
				<p><strong>And why it won't give you a verdict.</strong> It has one resume and eight of your answers. It doesn't know what the market currently rewards, how thin is too thin, or which gaps close in three months versus three years. So it lays out your evidence against what the role asks for and leaves the conclusion to you. Any prompt that confidently tells you to abandon a target is guessing.</p>

				<PromptBlock code={STEP1_PROMPT} />

				<div class="callout">
					<p><strong>Keep the list of missing work it gives you.</strong> Step 3 is where it goes on the page.</p>
					<p><strong>If your title turns out to be the problem</strong>, I wrote about how far you can go renaming it — and where the line is — <a href="https://lnkd.in/p/gkhuadsm" target="_blank" rel="noopener">here</a>.</p>
				</div>
			</section>

			<!-- Step 2 -->
			<section>
				<h2>Step 2 — Read the posting <em>(Gate 1, first half)</em></h2>
				<div class="callout">
					<p><strong>Only if you're working from a specific job posting.</strong> If you're building your resume before picking a job, skip this and go to Step 4 — you'll gather postings for your target title there instead.</p>
					<p>Most job postings carry the vocabulary their own recruiter will search on — but watch out for the ones that don't. <strong>This tells you which kind you're looking at, in one paste.</strong></p>
				</div>
				<p>A posting can be thin in two different ways, and they need different fixes. This one paste checks both.</p>

				<PromptBlock code={STEP2_PROMPT} />

				<p><strong>If (1) comes back with a solid list</strong>, the posting already carries what the recruiter will search on — you can skip Step 4 entirely.</p>
				<p><strong>If (1) is thin</strong>, you'll need Step 4. Don't do it yet. Come back to it after Step 3, for a reason that matters — see below.</p>
			</section>

			<!-- Step 3 -->
			<section>
				<h2>Step 3 — The interrogation <em>(Gate 2)</em></h2>
				<p>This is the one the public prompt is a preview of. Same idea, done properly.</p>
				<p><strong>One role at a time, not one line at a time.</strong> A resume writer doesn't go bullet by bullet, because a bullet is the <em>output</em> of the conversation, not its subject. They take a job, walk the arc of it, and collect far more than will fit — then decide later what makes the page. Bullet-by-bullet can only sharpen what's already written, which means it can never find the work you left off, and leaving work off is the more common problem.</p>
				<p><strong>Deliberately overshoot.</strong> If an hour on one role produces material for ten bullets and six survive, that's the process working. Selection happens in Step 5, not here.</p>

				<PromptBlock code={STEP3_PROMPT} />

				<div class="callout">
					<p><strong>Repeat for each role you're keeping.</strong> Start with the most recent and most relevant. Older roles need less — Step 5 will tell you how much less.</p>
					<p><strong>Keep the interviewer questions it gives you.</strong> Step 6 is where they get used.</p>
				</div>
			</section>

			<!-- Step 4 -->
			<section>
				<h2>Step 4 — The vocabulary diff <em>(Gate 1, second half)</em></h2>
				<div class="callout">
					<p>Run this if Step 2 told you the posting was thin — <strong>or if you don't have a specific posting yet</strong> and you're building on the vocabulary of the role generally. Skip it if Step 2 came back with a solid list for the job you're actually applying to.</p>
				</div>
				<p><strong>Why this comes after the interrogation and not before.</strong> If you diff a thin resume against a job posting, you get <strong>false gaps</strong> — it tells you you're missing terms for work you've actually done and simply hadn't written down yet. And the action that follows a false gap is padding, which is the one thing this gate exists to prevent. Fill the page first, then compare.</p>
				<p><strong>Why it refuses to add anything you haven't confirmed.</strong> You're not hunting for more keywords. You're finding out what they call the things you've <strong>already done</strong>, so your real experience is written in the words they'll search for.</p>
				<p>That distinction is the whole difference between this and the keyword prompts going around. Padding your page with terms you don't own gets you past the search and killed on the read — and if it somehow survives that, it becomes the question you can't answer in the room. Recruiters don't search the job description anyway; they search their own string, built from the posting plus intake notes from the hiring manager that never get published. Comparable postings are how you recover the part of that vocabulary you can actually see.</p>

				<h3>Finding the comparables</h3>
				<p>Search <strong>"[company name] [your target title]"</strong> on LinkedIn Jobs, Indeed, or the company's own careers page.</p>
				<p>Open the two or three postings closest to the role you want — same title, same level. Copy the full text of each, requirements section included.</p>
				<p><strong>Two or three is enough.</strong> You're looking for the words they repeat, not a complete survey.</p>
				<p><strong>Same company first.</strong> Same recruiters means same internal vocabulary, so those terms are closer to what actually goes in their search box than a competitor's posting would be. If that company only has the one opening, use close competitors instead.</p>
				<p><strong>No specific company in mind yet?</strong> Search your target title on its own and take three to five postings from companies you'd realistically apply to. You lose the same-recruiter advantage, so widen the sample a little — what you're after is the vocabulary the role carries everywhere, not one company's dialect.</p>
				<p><strong>Don't ask the model to go find the postings for you.</strong> When it can't, it won't say so — it will generate a plausible composite from training data, and you won't be able to tell the difference.</p>

				<h3>The diff</h3>

				<PromptBlock code={STEP4_PROMPT} />
			</section>

			<!-- Step 5 -->
			<section>
				<h2>Step 5 — The allocation pass</h2>
				<p>You now have more material than fits. This is where a resume writer earns most of the fee: deciding what makes the page, how much room each job gets, and what collapses to a single line.</p>
				<p>It's also the only step that looks at your resume <strong>as a document</strong>. The interrogation is deep and blind — it can't see that the number you landed on appears twice more further down, or that six bullets in a row now end the same way. Each one is true. Together they read like they came off a machine.</p>
				<p><strong>This prompt reads, it doesn't write.</strong> Nothing it produces goes on your page. Everything it flags goes back through Step 3.</p>

				<PromptBlock code={STEP5_PROMPT} />

				<p>It can only see shape, not truth — it has no way to know whether a number is real, only whether the page full of them looks like something a person wrote. That part is still your call.</p>

				<h3>Don't skip your summary</h3>
				<p>It's the one block that isn't tied to any single role, so it slips past the intake and the allocation both — and it's usually where the vaguest writing on a resume lives. "Dynamic leader known for strategic planning" survives nowhere in this process.</p>
				<p>Run the short prompt from the top of this page on it, pasting the whole summary where the bullet goes. Same three questions, same test.</p>

				<h3>One layout check while you're here</h3>
				<p>If your resume uses two columns or a sidebar, copy the whole thing and paste it into a plain text editor. Can you still tell which bullets belong to which job? If the roles run together, a parser may read it the same way — and keywords that land under the wrong employer don't help you.</p>
			</section>

			<!-- Step 6 -->
			<section>
				<h2>Step 6 — The room <em>(Gate 3)</em></h2>
				<p>No prompt here. Step 3 already did the prep work — it refuses to write a bullet you can't back up, and it tells you which ones are still missing a baseline, a consequence, or a mechanism. This is where you find out whether the rest hold up.</p>
				<p>Everything above happens at your desk. This happens in front of a person, and it's the reason none of the earlier steps can be gamed.</p>
				<p>A keyword you don't have gets you into a room where someone asks about it. A number you can't explain becomes the question they remember. A title that overstated your scope holds up on paper for about ninety seconds.</p>
				<p><strong>So the check is simple.</strong> Go bullet by bullet and answer two things out loud: <em>how did I get that number</em>, and <em>what exactly did I do</em>. Not in your head — out loud, to a wall if nobody's around. Start with the ones Step 3 flagged as incomplete. The bullets you stumble on are the ones an interviewer will find, and you now know which they are before anyone else does.</p>
				<p>If saying them out loud is where this falls apart — the bullet is true, you just can't tell it well under pressure — that's a different problem from anything on this page.</p>
				<p>That's what I built <strong><a href="https://mockinterview.tech">mockinterview.tech</a></strong> for. It does to your interview answers what Step 3 did to your bullets: asks until the real story is on the table, ready for any interview room.</p>
			</section>
		{/if}
	</div>
</div>

<style lang="scss">
	@import '../../lib/styles/colors.scss';

	.page {
		background: $bg-warm;
	}

	.wrap {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 6% 40px;
	}

	.hero {
		padding-top: 120px;
	}

	h1 {
		font-size: 42px;
		font-weight: 800;
		color: $text-dark;
		margin: 0 0 20px;
	}

	h2 {
		font-size: 26px;
		font-weight: 800;
		color: $text-dark;
		margin: 56px 0 16px;
	}

	h3 {
		font-size: 19px;
		font-weight: 700;
		color: $text-dark;
		margin: 32px 0 12px;
		text-align: left;
	}

	.lede {
		font-size: 19px;
		font-weight: 600;
		color: $text-dark;
	}

	.highlight {
		font-weight: 700;
		text-shadow: 0 0 6px rgba(255, 217, 61, 0.9), 0 0 14px rgba(255, 217, 61, 0.6);
	}

	p {
		font-size: 16px;
		line-height: 1.7;
		color: $text-medium;
		margin: 0 0 16px;
	}

	strong {
		color: $text-dark;
	}

	a {
		color: $primary;
		font-weight: 600;
	}

	.caption {
		font-style: italic;
		color: $text-light;
		font-size: 14px;
		margin-top: -8px;
	}

	.callout {
		background: $bg-peach;
		border-left: 3px solid $primary;
		border-radius: 0 12px 12px 0;
		padding: 4px 20px;
		margin: 20px 0;

		p {
			color: $text-medium;
		}
	}

	.before-after {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		margin: 20px 0;
	}

	.ba-card {
		flex: 1;
		min-width: 220px;
		background: $white;
		border-radius: $card-radius;
		box-shadow: $card-shadow;
		padding: 20px;
	}

	.ba-label {
		display: block;
		font-weight: 700;
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: $primary;
		margin-bottom: 8px;
	}

	blockquote {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: $text-dark;
	}

	/* Intro's teaser fades toward its bottom, with extra blank space to fade into */
	.gate-tease.pre-fold {
		mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 60%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 60%);
		padding-bottom: 120px;
		margin-bottom: -120px;
	}

	/* Blur ramps up in steps instead of snapping on, so the cutoff feels gradual */
	.blur-1 { filter: blur(0.3px); }
	.blur-2 { filter: blur(0.6px); }
	.blur-3 { filter: blur(1px); }
	.blur-4 { filter: blur(1.5px); }
	.blur-5 { filter: blur(2.2px); }
	.blur-6 { filter: blur(3px); }
	.blur-7 { filter: blur(4px); }
	.blur-8 { filter: blur(5px); }
	.blur-9 { filter: blur(6.5px); }
	.blur-10 { filter: blur(8px); }

	/* ── The fold ── */
	.fold {
		text-align: center;
		max-width: 620px;
		margin: 48px auto;
		padding: 40px 32px;
		background: $gradient-warm;
		border-radius: $card-radius;
		box-shadow: 0 12px 40px rgba(139, 92, 246, 0.25);
	}

	.fold h2 {
		margin: 0 0 24px;
		font-size: 24px;
		color: $white;
	}

	.fold-bullets {
		list-style: none;
		padding: 0;
		margin: 0 0 28px;
		text-align: left;
		display: inline-block;
	}

	.fold-bullets li {
		color: rgba(255, 255, 255, 0.85);
		font-size: 16px;
		line-height: 1.7;
		margin-bottom: 10px;

		strong {
			color: $white;
		}
	}

	.fold-form {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
	}

	/*
		Honeypot. Moved off-screen rather than display:none — plenty of bots skip
		fields that are explicitly hidden, and this one is only useful if they
		fill it in. Zero size so it can't affect the flex layout.
	*/
	.hp-field {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.fold-form input {
		flex: 1;
		min-width: 220px;
		max-width: 320px;
		margin: 0;
		padding: 14px 18px;
		border-radius: 50px;
		border: none;
		background: $white;
		font-size: 15px;
		font-family: inherit;
		box-sizing: border-box;
	}

	.fold-form button {
		margin: 0;
		background: $white;
		color: $primary-dark;
		border: none;
		border-radius: 50px;
		padding: 14px 26px;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
		box-shadow: 0 0 0 3px rgba(255, 217, 61, 0.5), 0 6px 20px rgba(255, 217, 61, 0.45);
		transition: transform 0.15s, box-shadow 0.15s;

		&:hover {
			transform: translateY(-1px);
			box-shadow: 0 0 0 4px rgba(255, 217, 61, 0.65), 0 8px 26px rgba(255, 217, 61, 0.6);
		}

		&:disabled {
			opacity: 0.6;
			cursor: default;
		}
	}

	.fold-error {
		color: $white;
		font-weight: 600;
		margin: 16px 0 0;
	}

	.fold-done {
		color: $white;
		font-size: 18px;
		font-weight: 600;
		margin: 0;
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 32px;
		}
		h2 {
			font-size: 22px;
		}
		.hero {
			padding-top: 90px;
		}
		.fold {
			padding: 32px 0;
		}
	}
</style>
