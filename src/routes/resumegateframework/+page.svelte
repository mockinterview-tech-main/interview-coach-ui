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

	const TEASER_PROMPT = `You are a professional resume writer. Your job right now is NOT to
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

Useful probing questions, drawn from how a coach actually drills:
- "Compared to what? What was normal before?"
- "What breaks if this doesn't happen? Who notices?"
- "Was that protecting revenue you already had, or winning revenue you didn't?"
- "Did you decide the approach, or carry out someone else's decision?"
- "How many systems, or people, were involved?"

ALSO ASK FOR THESE TWO - they are what make a bullet impossible to "steal" by my competitors, so
I can stand out from other resumes:

NAME THE SPECIFIC THING. Ask what the system, tool, product, team, or
framework was actually called. Use the real name if it isn't confidential - it
is both un-copyable and a term a recruiter may search for.

WHAT MADE IT HARD. Ask what the constraint, trade-off, or friction was, e.g. a
legacy system nobody had touched in years, two teams that disagreed, a
deadline set before the scope was known. "Delivered on time" is a claim
anyone can make; "delivered on time despite X" is a claim only I can.
Seniority signals reflect what I had to navigate.

THE TEST FOR EVERY ANSWER I GIVE YOU:
Could this statement also be true of a stranger's project? If yes, it is not specific
enough. Ask again - do not accept it and move on.

Say the verdict out loud every time, in a few words, before your next
question: "that could be anyone's - still too general," or "that one's only
yours." If you don't say it, I have no way to know whether you ran it.

A NUMBER IS NOT AUTOMATICALLY AN OUTCOME.
"Ran 200+ standups," "managed 20 campaigns," "filed 3,000 bugs" are counts of
activity, not measures of change. If my number counts things I did rather than
what moved because I did them, ask me what actually changed - revenue, customer satisfaction, man hour saved, foundational setup for future opportunities, etc.

HARD RULES:
- Never invent, assume, or fill in any of the three items. If I haven't told
  you, it stays empty. A plausible guess is a failure, not a help.
- Do NOT rewrite a bullet until you have all three from my own words.
  Not a draft, not a "here's roughly what it might look like."
- If I try to move on early, say what's still missing and ask again.

IF I DON'T HAVE EXACT NUMBERS or objective evidence:

Estimating from memory is fine - I lived it and can back it up. Inventing one
for me is not.

- Ask me to estimate, then ask HOW I got there. "We handled roughly 80-100 a
  week, so a third is about 25-30" is a real answer. "Around 30%" with no basis
  behind it is not - push back and ask what it's based on.
- Write estimates hedged: "~30%", "roughly 25", "about two quarters."
- If I have no number at all, ask for a concrete consequence instead. "The client
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
Rewrite the bullet. Include nothing I didn't tell you — no invented numbers, no
inflated scope, no added causation.

If I genuinely don't remember something, write the bullet with what I did give
you AND say which is missing: baseline, consequence, or mechanism. Don't hide
the gap.`;

	const TARGET_PROMPT = `You are a career strategist. Do not reassure me and do not flatter me.

Here is my resume:
[PASTE or ATTACH RESUME]

I am considering applying for: [TARGET ROLE — or write "not sure" if you
don't know]
My company-assigned title is: [YOUR CURRENT TITLE]

IF I WROTE "not sure" ABOVE, SETTLE THAT BEFORE ANYTHING ELSE.
Read my resume and propose 2-3 job families my work could plausibly support.
For each, say in one line what in my resume points to it. Then ask me to pick
one, and don't go any further until I have. Everything below depends on having
a target, so guessing one for me would waste the whole exercise.

There may be a disconnect between my title and the work I actually did.
Company titles are naming conventions, not descriptions of work. Use my resume
to know which projects and roles existed, then probe behind it — don't assume
what's on the page is the whole story, and don't assume anything missing
didn't happen.

FIRST, BEFORE ANY QUESTIONS: read every title on my resume. There are two
kinds — the headline under my name, which I wrote about myself, and the job
title on each position I've listed, which an employer gave me. Tell me whether
they agree. If my headline already claims the title I'm targeting but not one
of the jobs beneath it carries that title, say so plainly. A recruiter reads
the headline, looks down for confirmation, and doesn't find it — and I probably
overlook that myself.

If I don't have a headline at all, say so — plenty of resumes go straight from
contact details into experience. Then tell me what my most recent job title is
signalling on its own, because with no headline that title is the first thing
anyone reads, whether I meant it to be or not.

SECOND, NAME THE JOB BEFORE YOU JUDGE MY FIT FOR IT.
List the 5-8 responsibilities that role typically carries — what someone in
that job is actually accountable for week to week. Keep it to what the role
generally involves across companies. Do NOT tell me what level or seniority bar
I'd have to clear: that varies by company, you may not know it,
and a confident guess there costs me months. Responsibilities you can name.
Bars you can't.

Then use that list as the thing we're checking my experience against, and show
it to me so I can tell you if you've got the role wrong.

Interrogate me about what I actually owned. One question at a time.

Probe specifically for the difference between OWNING an outcome and
PARTICIPATING in it:
- Who made the call when there was a disagreement — was it me?
- What happened if it went wrong, and who answered for it?
- Did I set the direction, or execute a direction someone else set?
- What did I own that nobody else owned?

Ask about scope: how many teams, systems, or dollars.
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

1. Go back to the responsibility list you wrote at the start. For each one, say
   which of my actual experiences maps to it, quoting what I told you — and
   say plainly which ones nothing I've said maps to.
2. Only if my evidence clearly fits a different job family better than the
   target we settled on at the start: say so and name it. If it fits, skip
   this — don't manufacture an alternative to look useful.
3. For each unmapped responsibility: whether it's missing from my resume but
   present in my history, or genuinely missing from my history. Those need
   different fixes and only I can tell you which it is if you're unsure — ask.
   For the ones missing from my resume only: tell me which job they belong
   under, so I can take that piece of work through the interrogation prompt.
   For the ones missing from my history: say what evidence would close each
   one. Do not tell me whether to keep aiming at this role — that's mine to
   decide, and I need to know what closing the gap would cost before I can.

Do not score me, rank me, or tell me whether I'm ready. Show me the mapping and
let me draw the conclusion.

If my work supports a role my title doesn't say:
- What functional title would describe the work honestly on my resume. Keep it
  at the same level as my real title. Translating what the job was called is
  normal; promoting me a rung is not, and that is the thing employment
  verification actually catches.
- Which of my experiences carry the strongest signal for that role
- Which to lead with, and which to shrink

Be honest even if the answer is that I'm not there yet. Telling me what I want
to hear costs me months.`;

	const POSTING_PROMPT = `Here is a job description:

[PASTE THE JOB DESCRIPTION]

List every specifically named thing in it — tools, technologies, platforms,
certifications, methodologies, and products or domains. Names only: not
responsibilities, not adjectives, not soft skills.

Then tell me one thing: does this posting name enough specific things for a
recruiter to search on, or is it mostly generic responsibilities?

If it's thin, tell me to go gather comparable postings from the same company.

Don't pad a short list to be encouraging. If it's thin, say so.`;

	const INTERROGATION_PROMPT = `You are a professional resume writer running an intake session with
me. Your job right now is NOT to write anything. It is to get the real story
of one job out of my head and onto the table.

THE ROLE WE'RE WORKING ON:
Company: [COMPANY]
My title: [TITLE]
Dates: [DATES]
I'm targeting: [TARGET ROLE]

What's currently on my resume for this job, if anything:
[PASTE ALL EXISTING BULLETS FOR THIS JOB — or write "nothing yet"]

Work I know is missing from the page:
[LIST ANYTHING STEP 1 SURFACED — or write "not applied"]

HOW TO RUN THIS:

Ask me one question at a time. Never batch. Wait for my answer.

Start with the arc of the job, not the bullets:
- What was I hired to do?
- What did I inherit — what state was it in when I arrived?
- What was different by the time I left?
- What was I the person for? What came to me that didn't come to anyone else?

Then work through the specific pieces of work one at a time.

If a bullet I already had uses a vague word — "performance," "efficiency,"
"engagement," "impact" — your first question on that piece of work is what I
actually meant by it. Everything else depends on the answer.

For each piece of work, collect three things:

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
- "How many systems, or people, were involved?"

ALSO ASK FOR THESE TWO — they are what make a bullet impossible to "steal," so
I can stand out from other resumes:

NAME THE SPECIFIC THING. Ask what the system, tool, product, team, or
framework was actually called. Use the real name if it isn't confidential —
it is both un-copyable and a term a recruiter may search for.

WHAT MADE IT HARD. Ask what the constraint, trade-off, or friction was. A
legacy system nobody had touched in years, two teams that disagreed, a
deadline set before the scope was known. "Delivered on time" is a claim
anyone can make; "delivered on time despite X" is a claim only I can.
Seniority signals reflect what I had to navigate.

ONLY IF I WROTE "not applied" ABOUT MISSING WORK ABOVE:
That means I skipped the target check, so do a short version of it before you
finish — ask me what I built that didn't exist before, what I replaced or
turned around, what I killed, who I developed, and what crises I was pulled
into. If I gave you a list up top, don't ask again; work from that one.

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

1. Write every bullet my material supports — not just the best few. Include the
   ones I will probably end up cutting. Choosing which ones make the page is my
   job, later, and I can only choose from what you give me.
2. Use only what I gave you. No invented numbers, no inflated scope, no added
   causation.
3. NO FACT MAY CARRY TWO BULLETS. If the same achievement appears twice in
   different words, that's one bullet, not two. If the material only supports
   one bullet, write one.
4. Mark any bullet that is still missing a baseline, a consequence, or a
   mechanism, and say which.

If I genuinely don't remember something, write the bullet with what I did give
you AND say which is missing: baseline, consequence, or mechanism. Don't hide
the gap.`;

	const DIFF_PROMPT = `I'm targeting this role:

[PASTE THE TARGET JOB DESCRIPTION]

Here are comparable postings for that role at a similar title and level:

[PASTE COMPARABLE POSTINGS — or write "none, the posting above is detailed
enough" and work from that one alone]

And here is my resume:

[PASTE or ATTACH RESUME]

Do this, in order:

1. Across everything I gave you — the target posting and any comparables —
   extract every specifically named tool, technology, platform, certification,
   methodology, and domain term. Names only — not verbs, not adjectives, not
   responsibilities.

2. If I gave you comparables, group the terms from step 1 by how many postings
   each one appears in. Terms in most postings are this company's shared
   vocabulary. Terms in only one are narrower — that might mean they belong to
   that specific team, or just that one posting was written more precisely than
   the rest. Don't drop those; tell me which group each term is in and let me
   judge. If I didn't give you comparables, skip this grouping.

3. If I gave you comparables, tell me which terms from step 1 appear in the
   comparables but NOT in the target posting. These matter most — the recruiter
   may well search on them even though they never wrote them down.

4. Now compare against my resume. Two lists — these you CAN determine:
   - Terms from the postings that already appear on my resume
   - Terms from the postings that do NOT appear on my resume

5. For that second list, do NOT guess whether I have the experience — you have
   no way to know. Ask me. Go through them in small batches and ask which ones
   I've actually done.

6. For the ones I confirm, split them in two:
   - Work that IS on my resume under a different name: tell me exactly where to
     swap the wording, using the posting's exact term. If they write
     "Kubernetes," I write "Kubernetes," not "K8s."
   - Work that is NOT on my resume at all: don't place these anywhere. Tell me
     which job it belongs under, and that I need to run the interrogation
     prompt on that piece of work before the term can go on the page. A term
     with no bullet underneath it is padding.

RULES:
- Never assume I have or don't have an experience. My resume is the only thing
  you can see, and it is incomplete — that's the entire point of this exercise.
- Never suggest I add a term I haven't confirmed. If I tell you I haven't done
  it, it doesn't go on the page.
- Do NOT rewrite my sentences to sound like the postings. Copy their
  vocabulary, never their phrasing — a resume that reads like the job
  description fed back is a known red flag.`;

	const ALLOCATION_PROMPT = `Here is my full resume:

[PASTE ENTIRE RESUME AFTER STEP 2'S EDIT]

I'm targeting: [TARGET ROLE]

Do NOT rewrite anything. Do not propose replacement wording. Do not add,
estimate, or infer any fact that is not already on the page. Read this the way
a recruiter reads it — as one document, top to bottom, in a single pass.

Report only what you can actually see:

1. REPEATED NUMBERS. List every number and percentage in order, and flag any
   value that shows up more than once. Don't read anything into it — the same
   figure on two different outcomes is usually a copy-paste slip, and it's mine
   to check. Two projects genuinely landing near the same result is normal, so
   don't tell me my numbers look invented.

2. REPEATED LANGUAGE. Which verbs, phrases, and claims show up more than once
   across roles. If something repeats because I really did do it at every job,
   don't tell me to find synonyms — differently-worded generic bullets are
   still generic. Tell me which instances need their own specifics instead.

3. TENSE. Where it shifts inside a single role.

4. THE SAME CLAIM TWICE. Which bullets are making substantially the same point
   in different words.

5. WHAT'S EARNING ITS SPACE. Given my target, which bullets carry the
   strongest signal for it and which are taking up room without doing work.
   Tell me which role's section is contributing least, and which role deserves
   more space than it currently has.

6. THE STRANGER TEST, AT PAGE SCALE. Which bullets could sit on the resume of
   anyone with my title. List them worst first.

7. SECTION ORDER. List my sections in the order they appear, and tell me how
   much text sits above the first job in my experience section. Report only
   what you can see in what I pasted — you cannot know my font, margins, or
   where my page actually breaks, so do not guess at those.

8. WHAT TO COLLAPSE. Older roles that no longer support my target should
   shrink to a line or fold into an "Earlier career" block. But do NOT decide
   this by job title — decide it by what's inside. If an older role contains
   work my target role actually needs, keep that part and collapse the rest,
   even if the title looks unrelated. Tell me which roles to collapse, and
   which pieces to lift out of them first.

Don't rewrite anything — tell me what to change and I'll make the edits myself.
For anything you flag, name the specific bullet and the job it sits under, so I
know which piece of work to run back through the interrogation prompt.

Then rank everything you flagged across all eight checks, worst first, and tell
me the three to fix before I send this anywhere.`;

	const SUMMARY_PROMPT = `Here is my finished experience section:

[PASTE YOUR EXPERIENCE SECTION]

I'm targeting: [TARGET ROLE]

Write my executive summary. It's 3-5 lines, and its only job is to intrigue a
person enough to keep reading the page below it.

RULES:
- Every claim must already appear in the Experience section. Compress
  what's there — do not add a fact, a number, or a scope I didn't write. The
  one exception is my total years of experience, which you can count from my
  dates.
- Pick the 2-3 highlights that matter most for my target role — not
  necessarily the most recent ones.
- Name specifics. If a system, product, or scale is named below, name it here.
- No character adjectives. "Dynamic," "results-driven," "proven track record"
  say nothing and cost me lines I need.
- Open with what I am, not what I'm skilled at.

Give me three versions leading on different highlights. Then tell me which
claim in each is doing the most work, and which line I could cut without
losing anything.`;
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
			<p>Below is the one idea that popular resume prompts are missing: <span class="highlight">a good one asks you questions before it writes anything, and won't fill in what you haven't told it</span>. Try it on a single bullet and you'll see the difference in about three exchanges.</p>
		</section>

		<!-- The Gate map -->
		<section>
			<h2>The Gate map</h2>
			<p><strong>🚪 Gate 0 - Target.</strong> Are you aiming at the right role, and is the work that proves it actually on the page?</p>
			<p><strong>🚪 Gate 1 - Filter.</strong> Do you show up in the search a recruiter runs in the ATS?</p>
			<p><strong>🚪 Gate 2 - Skim.</strong> Does a human believe in your bullets? Are those bullets "stealable" by your competitors?</p>
			<p><strong>🚪 Gate 3 - Defense.</strong> Can you back it up out loud in the interview room?</p>

			<p class="gate-summary"><strong>Gate 0 is content</strong>, <strong>Gate 1 is vocabulary</strong>, <strong>Gate 2 is whether the writing is believable</strong>, and <strong>Gate 3 is whether you can defend it out loud</strong>.</p>
		</section>

		<!-- Find your problematic gate -->
		<section>
			<h2>Find your problematic gate</h2>
			<p>❌ <strong>No callbacks at all</strong> → Gate 0 or 1. Your signal doesn't match your substance.</p>
			<p>❌ <strong>Screened, then silence</strong> → Gate 2. They read you and didn't believe it.</p>
			<p>❌ <strong>Interviews, no offers</strong> → Gate 3. The page promised more than you delivered - your storytelling failed.</p>
			<p>The trap is treating all these symptoms as if it's a Gate 1 problem - more keywords, tighter formatting, another prompt off LinkedIn. If you're wrong at Gate 0, better keywords only make you fail faster; If you are stuck at Gate 3, you need to fix your stories.</p>
		</section>

		<!-- Try it on one bullet -->
		<section>
			<h2>Try it on one bullet</h2>
			<p><strong>Resume rewrite is a conversation, even with LLM.</strong> Most resume prompts work the same way - you paste, it produces, you're done in a single exchange. <b>That single turn is the problem</b>. An LLM model can only rewrite what's on your page, and the thing that makes a bullet believable <b>is in your head</b> - the model has no way to reach. It can't stop and ask you, so it AI-slops back. It doesn't know the difference between a thin bullet VS a thin career.</p>

			<p>Mine is built to ask first and rewrite the bullet at the end. Paste any bullet, straight off your current resume.</p>

			<PromptBlock code={TEASER_PROMPT} />


			<p><strong>If it starts writing before it has asked you anything</strong>, stop it and say: <em>"Don't write anything yet. Ask me one question at a time until you have all three."</em> That's usually enough to get it back. It's the prompt slipping, not you — and it's worth knowing that this one talks back, so it costs more messages than a paste-and-go prompt does.</p>

			<p><strong>If it comes back saying the bullet isn't ready</strong>, that's the tool working, not failing. You've just found out which line on your resume can't survive being asked about, which is better learned here than in the room.</p>
		</section>

		<!-- See how transformation happens -->
		<section>
			<h2>See how transformation happens</h2>
			<div class="before-after">
				<div class="ba-card before">
					<div class="ba-label">Before the prompt</div>
					<p>"Improved performance by 10%."</p>
					<div class="before-cost">
						<p class="cost-line">&#129335; Could be true of <strong>others' project</strong></p>
						<p class="cost-line severe">&#9888;&#65039; A recruiter could not easily remember</p>
					</div>
				</div>
				<div class="ba-arrow" aria-hidden="true">&#10132;</div>
				<div class="ba-card after">
					<div class="ba-label">After running the prompt</div>
					<p>"Cut service response latency 10% to hold new SLA commitments to the existing clients, protecting ~$200K of at-risk revenue."</p>
				</div>
			</div>
			<br>
			<p>Same project. Same number. What sits between them is questions being answered — what "performance" actually meant, why 10% mattered, what would have broken if missed it, and what that was worth. None of them were on the resume before, because nobody had ever asked.</p>
		</section>

		<!-- What this prompt won't do -->
		<section>
			<h2>What this prompt won't do</h2>
			<p>It won't hear your hesitation. It won't notice the thing you're steering around. It won't know your industry's tells.</p>
			<p>That part still takes a person. I'd rather tell you that up front than let you find out at the wrong moment.</p>
		</section>

		<!-- The fold -->
		<section class="fold">
			{#if !unlocked}
				<h2>Like the outcome with just one bullet? <br>Below has the whole method.</h2>
				<ul class="fold-bullets">
					<li><strong>The target check</strong> — <em>if not sure your title matches what you did</em></li>
					<li><strong>The keyword gap</strong> — the terms a thin posting may have left out</li>
					<li><strong>The full interrogation</strong> — role by role, not line by line</li>
					<li><strong>The allocation pass</strong> — what makes the cut, and what shrinks</li>
					<li><strong>The room</strong> — how to construct impactful stories</li>
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
			<h2>The gate map tells you where you're dying. This is the order you fix it in.</h2>
			<p>The 4 gates above are a diagnosis. They aren't a to-do list, and gate numbers aren't the running order. What follows is.</p>
			<p>It mirrors <span class:blur-1={!unlocked}>how a professional resume writer actually runs an intake:</span> <span class:blur-2={!unlocked}>settle the target first,</span> <span class:blur-3={!unlocked}>because everything downstream</span> <span class:blur-4={!unlocked}>gets edited against it.</span> <span class:blur-5={!unlocked}>Then go role by role</span> <span class:blur-6={!unlocked}>and deliberately collect more context.</span> <span class:blur-7={!unlocked}>Only then decide what makes the page,</span> <span class:blur-8={!unlocked}>and how much room each role gets.</span></p>

			<p class="flow-lead" class:blur-9={!unlocked}>5 steps, but not all the same kind of work.</p>

			<ol class="flow-steps">
				<li class="build" class:blur-10={!unlocked}>
					<span class="flow-num">1</span>
					<div class="flow-body">
						<span class="flow-name">The target check</span><span class="flow-gate">Gate 0</span>
						<p>Settle what role you're aiming at, and surface the work that never made it onto the page.</p>
					</div>
				</li>
				<li class="build" class:blur-12={!unlocked}>
					<span class="flow-num">2</span>
					<div class="flow-body">
						<span class="flow-name">The interrogation</span><span class="flow-gate">Gate 2</span>
						<p>Role by role, get the real story out of your head as bullets.</p>
					</div>
				</li>
				{#if unlocked}
					<li class="build">
						<span class="flow-num">3</span>
						<div class="flow-body">
							<span class="flow-name">The allocation pass</span>
							<p>Read the whole page at once: what duplicates, what earns its space, and what shrinks.</p>
						</div>
					</li>
					<li class="tailor">
						<span class="flow-num">4</span>
						<div class="flow-body">
							<span class="flow-name">The vocabulary gap</span><span class="flow-gate">Gate 1</span>
							<p>Check whether the target JD names enough specifics to work from, then add only the terms you confirm you've actually earned.</p>
						</div>
					</li>
					<li class="room">
						<span class="flow-num">5</span>
						<div class="flow-body">
							<span class="flow-name">The room</span><span class="flow-gate">Gate 3</span>
							<p>Say the bullets out loud and find the ones you can't defend, in storytelling format.</p>
						</div>
					</li>
				{/if}
			</ol>

			{#if unlocked}
				<div class="flow-legend">
					<p><span class="dot build"></span><strong>1, 2 and 3 build the resume</strong> — you do these once.</p>
					<p><span class="dot tailor"></span><strong>4 tailors it</strong> — run it again for every job you apply to.</p>
					<p><span class="dot room"></span><strong>5 is the one that isn't at your desk</strong> — it's your interview prep.</p>
				</div>
				<br>
				<p><strong>Steps 1 to 3 build your main resume</strong> — one strong document that shows your competencies against what the target role generally involves. That's a finished thing in its own right. Step 4 is what you run each time you apply to something specific, and it needs a real posting to work from.</p>
			{/if}
		</section>

		{#if unlocked}
			<!-- Step 1 -->
			<section>
				<h2>Step 1 — The target check <em>(Gate 0 - Target)</em></h2>
				<div class="callout">
					<p>Run this (1) if you're not sure your title reflects what you actually did, (2) if you're getting calls for the wrong kind of role, or (3) if you know the role you want but aren't sure your resume proves you can do it. Skip it only if you're confident on all three. This step is about <strong>content</strong> — whether the evidence exists and made it onto the page.</p>
				</div>
				<p><strong>Why it interrogates instead of just reading your resume.</strong> Your resume was written from where you've been. If you're aiming somewhere else, the work that proves you belong there is usually thin on the page or missing from it entirely - you may have left off because it didn't feel impressive from the inside. So this prompt asks from the target role's perspective, not your resume's, and it goes looking for what isn't there.</p>
				<p><strong>And why it won't give you a verdict.</strong> It has one resume and your answers. It doesn't know what the market currently rewards, how thin is too thin, or which gaps close in three months versus three years. So it lays out your evidence against what the role asks for and leaves the conclusion to you. Any prompt that confidently tells you to abandon a target is guessing.</p>

				<PromptBlock code={TARGET_PROMPT} />

				<div class="callout">
					<p><strong>Keep the list of work that's in your history but never made it onto your page</strong>, and let Step 2 below turn them into bullets — it's a writing problem. The things you haven't actually done are experience gaps, and no prompt fixes those.</p>
					<p><strong>If your title turns out to be the problem</strong>, I wrote about how far you can go renaming it — and where the line is — <a href="https://lnkd.in/p/gkhuadsm" target="_blank" rel="noopener">here</a>.</p>
					<p><strong>Your official title doesn't disappear.</strong> Your resume is a marketing document that describes your work, so the functional title belongs there — at the same level as the real one. The exact HR-assigned one belongs anywhere you're certifying that it's true — the application form, the background check. Same company, same dates, real title in that field. The moment you're most likely to get stuck: an application form that auto-fills from the resume. Correct the title field, then use the description box underneath it to state your functional role. Both end up on your profile, and nobody can call it a discrepancy.</p>
				</div>

				<h3>Before you move on</h3>
				<p>When Step 1 is done you should be holding four items:</p>
				<ol class="step-output">
					<li><strong>A settled target.</strong> One role, either the one you named or the one you picked from what it proposed.</li>
					<li><strong>That role's responsibilities</strong> — the 5-8 it listed, which is the yardstick everything gets measured against from here.</li>
					<li><strong>A list of work that's in your history but not on your page</strong> — including any job that isn't on the resume at all. Plain descriptions, not bullets; Step 2 is what turns them into bullets. This is the one Step 2 needs.</li>
					<li><strong>A list of things you haven't done</strong>, and what evidence would close each one. Nothing on this page fixes those — that's a decision about what you're aiming at, and it's yours.</li>
				</ol>
				<p>Step 2 works one job at a time, so item 3 is the thing to have open when you start. If it came back empty, you still run Step 2 — it fixes the bullets you already have, not just the ones you're adding.</p>
			</section>

			<!-- Step 2 -->
			<section>
				<h2>Step 2 — The interrogation <em>(Gate 2 - Skim)</em></h2>
				<p>This is the one the first prompt is a preview of.</p>
				<p><strong>One role at a time, not one line at a time.</strong> A resume writer doesn't go bullet by bullet, because a bullet is the <em>output</em> of the conversation. Bullet-by-bullet can only sharpen the sentence in front of it. Working a whole role gets you the context those sentences came from — including, if you ran Step 1, the pieces it told you were missing.</p>
				<p>You'll get back more bullets than you need. Selection happens in Step 3, not here.</p>

				<PromptBlock code={INTERROGATION_PROMPT} />

				<div class="callout">
					<p><strong>Repeat for each job you're keeping.</strong> Start with the most recent and most relevant. Older jobs need less — Step 3 will tell you how much less.</p>
				</div>

				<h3>Before you move on</h3>
				<p>When you've been through the jobs you're keeping, you should be holding three items:</p>
				<ol class="step-output">
					<li><strong>More bullets than fit</strong>, for every job you interrogated. That's the prompt working — it was told to write all of them, not the best few.</li>
					<li><strong>Bullets it marked incomplete</strong>, with which piece is missing — a baseline, a consequence, or a mechanism. Those are the ones you couldn't fully answer, and they're the ones an interviewer would find.</li>
					<li><strong>A manually updated resume</strong> with every bullet pasted in, not just your favourites. Step 3 reads that file, not this conversation, so anything you leave out is invisible to it.</li>
				</ol>
				<p>Don't cut anything yet, and don't fix the incomplete ones by filling the gap yourself. Step 3 decides what stays; the incomplete ones either get answered honestly or come off the page.</p>
			</section>
			<!-- Step 3 -->
			<section>
				<h2>Step 3 — The allocation pass</h2>
				<p>You now have more material than fits. This is where a resume writer earns most of the fee: deciding what makes the page, how much room each job gets, and what collapses to a single line.</p>
				<p>It's also the only step that looks at your resume <strong>as a whole document</strong>. Step 2 sees one job at a time — within a role it catches itself repeating, but it never saw your other jobs. Most people interrogate the recent roles properly and leave the older ones as they were. Those bullets are still on the page, and this is where they finally get read.</p>
				<p><strong>It reads, it doesn't write.</strong> Nothing it hands you goes on your resume. Most of what it finds, you just fix manually. But if it tells you a bullet could be anyone's, that one needs more out of your head, and Step 2 is where that happens.</p>

				<PromptBlock code={ALLOCATION_PROMPT} />

				<div class="callout">
					<p><strong>It can only see what's on the page, not whether it's true.</strong> It can tell you the same figure turns up twice; it can't tell you whether either one is real. That part is still your call.</p>
				</div>

				<h3>How to arrange your sections</h3>
				<p>The prompt can see what order they're in. It can't see your font, your margins, or where the page breaks — so this part is yours. The top of page 1 is where a person decides whether to keep reading; everything else a search finds anyway.</p>
				<ol class="structure-order">
					<li><strong>Name and contact</strong> — one line, no image or fancy coloring.</li>
					<li><strong>A 3–5 line executive summary</strong>, if you keep one — your best 2-3 achievements, as the hook.</li>
					<li><strong>Experience</strong> — most recent first. This is what recruiters came for.</li>
					<li><strong>Skills, certifications, education</strong> — below the Experience, not above it.</li>
				</ol>
				<p>A grid of skills, competencies, or certifications above your first job wastes your best space on terms an ATS would have found no matter where they are on the page.</p>
				<p><strong>Do this by hand.</strong> Don't ask an LLM to reformat — it may reword your bullets while it reorders them.</p>

				<h3>One quick layout check</h3>
				<p>Two columns or a sidebar? Paste the whole thing into a plain text editor. Can you still tell which bullets belong to which job? If you can't, a parser may not either, and keywords under the wrong job don't help you.</p>

				<h3>Now if you want to write the Executive Summary</h3>
				<p>Last, because a summary compresses the page — you can't write it until the page is settled. Every claim in it has to already exist in Experience, except your years of experience (if you want to start with that).</p>

				<PromptBlock code={SUMMARY_PROMPT} />

				<h3>Before you move on</h3>
				<p>You should now have:</p>
				<ol class="step-output">
					<li><strong>A resume you'd be willing to send.</strong> Cut down, reordered, nothing on it you can't defend. This is your main version — it isn't aimed at any particular job posting yet.</li>
					<li><strong>The three fixes it ranked</strong>, done. If any are still open, they're still open on every application you make from here.</li>
				</ol>
				<p>Save this version separately before you go on. Step 4 tailors a <em>copy</em> for one specific posting — you don't want to overwrite the main version every time you apply somewhere.</p>
			</section>

			<!-- Step 4 -->
			<section>
				<h2>Step 4 — The vocabulary gap <em>(Gate 1 - Filter)</em></h2>
				<div class="callout">
					<p><strong>From here on, you're tailoring.</strong> Steps 1 to 3 built the resume once. This one you run again for each job you apply to.</p>
					<p><strong>Two stages, and the first one often ends it.</strong> Stage 1 is a single paste that tells you whether the posting already carries the vocabulary you need. Only if the posting is thin, you go gather comparables in Stage 2.</p>
					<p><strong>This one needs a real posting.</strong> If you haven't picked a job yet, you're done for now — Steps 1 to 3 leave you with a finished resume. Vocabulary without a target is guessing at which words matter, so come back when you're applying to something.</p>
				</div>
				<p><strong>Why this comes after the interrogation and not before.</strong> Run this diff on a thin resume and it will report <strong>false gaps</strong> — terms you actually have, flagged as missing only because you hadn't written that work down yet. Add them and you've put keywords on your page with no evidence underneath. Fill the page in Step 2 first, then compare.</p>
				<p><strong>Why it refuses to add anything you haven't confirmed.</strong> You're not hunting for more keywords. You're finding out what they call the things you've <strong>already done</strong>, so your real experience is written in the words they'll search for.</p>
				<p>That distinction is the whole difference between this method and the keyword prompts going around. Padding your page with terms you don't own gets you past the search and killed on the read — and if it somehow survives that, it becomes the question you can't answer in the room. A recruiter often isn't only searching based on the JD; they have their internal strings, built from the posting plus intake notes from the hiring manager. If a JD is thin (too generic), comparable postings are how you recover the part of that vocabulary you can actually see.</p>

				<h3>Stage 1 — is this posting thin?</h3>
				<p>Most job postings carry the vocabulary their own recruiter will search on — but watch out for the ones that don't. Sometimes the JD is just written lazily. One paste tells you which kind you're looking at.</p>

				<PromptBlock code={POSTING_PROMPT} />

				<p><strong>If it comes back with a solid list</strong>, the posting already carries what the recruiter will search on. Skip Stage 2 and go straight to the <b>diff prompt below</b> — you just need to know which of those terms are missing from your resume.</p>
				<p><strong>If it's thin</strong>, do Stage 2 first. The diff runs either way; comparables are how you feed it when the posting won't.</p>

				<h3>Stage 2 — finding the comparables <em>(only if the posting was thin)</em></h3>
				<p>Search <strong>"[company name] [your target title]"</strong> on LinkedIn Jobs, Indeed, or the company's own careers page.</p>
				<p>Open the two or three postings closest to the role you want. Copy the full text of each, requirements section included.</p>
				<p><strong>Two or three is enough.</strong> You're looking for the words they repeat, not a complete survey.</p>
				<p><strong>Same company first.</strong> Same recruiters means similar internal vocabulary, so those terms are closer to what actually goes in their search box than a competitor's posting would be. If that company only has the one opening, use close competitors instead.</p>
				<p><strong>Don't ask the model to go find the postings for you.</strong> When it can't, it won't say so — it will generate a plausible composite from training data, and you won't be able to tell the difference.</p>

				<h3>The diff</h3>

				<PromptBlock code={DIFF_PROMPT} />

				<h3>Before you move on</h3>
				<p>You should now have:</p>
				<ol class="step-output">
					<li><strong>A manually tailored copy for this posting</strong> — same evidence as your main, some of it renamed to the words this employer uses.</li>
					<li><strong>A list of terms you confirmed but couldn't place</strong>, because the work isn't written down anywhere yet. Those need the interrogation prompt before the term can go on the page. Don't paste them in bare.</li>
				</ol>
				<p>Then repeat Step 4 for the next job you apply to. Steps 1 to 3 you don't do again — the main is built.</p>
			</section>

			<!-- Step 5 -->
			<section>
				<h2>Step 5 — The room <em>(Gate 3 - Defense)</em></h2>
				<p>No prompt here. Step 2 already did the prep work — it refuses to write a bullet you can't back up, and it tells you which ones are still missing a baseline, a consequence, or a mechanism. This is where you find out whether the rest hold up.</p>
				<p>Everything about your resume happens at your desk. Storytelling based on your resume happens in front of a person, and it's the reason none of the earlier steps can be gamed.</p>
				<p><strong>Bring a question with you.</strong> Some postings never say what the team is actually building or what problem the role exists to solve. If yours didn't, that's your first question in the screen — <em>what is this team working on right now?</em> It reads as interest, and the answer tells you which of your work to lead with for every round after that.</p>
				<p><strong>Don't lie or inflate.</strong> A keyword you don't have gets you into a room where someone asks about it. A number you can't explain becomes the hesitation they remember. A title that overstated your scope falls apart the moment someone asks what you actually owned.</p>
				<p><strong>So the check is simple.</strong> Go bullet by bullet and answer two things out loud: <em>how did I get that number</em>, and <em>what exactly did I do</em>. Not in your head — out loud. Start with the ones Step 2 flagged as incomplete. The bullets you stumble on are the ones an interviewer will find, and you now know which they are before anyone else does.</p>
				<p>If saying them out loud is where things fall apart — the bullet is true, you just can't do storytelling well under pressure.</p>
				<p>That's what I built <strong><a href="https://mockinterview.tech">mockinterview.tech</a></strong> for. It does to your interview narratives what Step 2 did to your bullets: <span class="highlight">asks until the real story is on the table, ready for any room you walk into</span>.</p>
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

	/*
		Same visual language as the "From Rambling to Remarkable" block on the
		homepage — dashed pink for the weak version, white card for the one that
		survives. Values mirrored from src/routes/+page.svelte so the two blocks
		stay recognisably the same idea; if that one changes, change this too.
	*/
	/*
		The six-step overview. Colour does the work the old prose was doing:
		coral steps build the resume once, violet steps get repeated per
		application. The legend names the split rather than relying on the
		reader holding "1, 3, 5 and 6" in their head while they scan.
	*/
	/* "Before you move on" — what a step leaves you holding for the next one */
	.step-output {
		margin: 12px 0 16px;
		padding-left: 22px;
		color: $text-medium;
		line-height: 1.7;

		li {
			margin-bottom: 6px;
		}

		strong {
			color: $text-dark;
		}
	}

	.structure-order {
		margin: 12px 0 16px;
		padding-left: 22px;
		color: $text-medium;
		line-height: 1.7;

		strong {
			color: $text-dark;
		}
	}

	/* The one-line restatement of what each gate is actually about. */
	.gate-summary {
		margin-top: 18px;
		padding: 14px 18px;
		background: $bg-peach;
		border-radius: $card-radius;
		color: $text-medium;
		line-height: 1.6;

		strong {
			color: $text-dark;
		}
	}

	.flow-lead {
		font-weight: 700;
		color: $text-dark;
		margin: 28px 0 14px;
	}

	.flow-steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;

		li {
			display: flex;
			align-items: flex-start;
			gap: 14px;
		}
	}

	.flow-num {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: 700;
		color: $white;
		margin-top: 1px;

		li.build & {
			background: $primary;
		}
		li.tailor & {
			background: $secondary;
		}
		/* Step 6 is neither building nor tailoring — it's the only one that
		   doesn't happen at your desk, so it gets its own weight. */
		li.room & {
			background: $text-dark;
		}
	}

	.flow-body {
		p {
			margin: 2px 0 0;
			color: $text-medium;
			line-height: 1.55;
		}
	}

	.flow-name {
		font-weight: 700;
		color: $text-dark;
	}

	.flow-gate {
		margin-left: 8px;
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		background: $bg-peach;
		color: $text-light;
		white-space: nowrap;
	}

	.flow-legend {
		margin: 20px 0 0;

		p {
			display: flex;
			align-items: baseline;
			gap: 8px;
			margin: 0 0 6px;
			font-size: 15px;
			color: $text-medium;
		}

		.dot {
			flex-shrink: 0;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			transform: translateY(1px);

			&.build {
				background: $primary;
			}
			&.tailor {
				background: $secondary;
			}
			&.room {
				background: $text-dark;
			}
		}
	}

	.before-after {
		display: flex;
		align-items: stretch;
		gap: 20px;
		margin-top: 24px;

		@media (max-width: 960px) {
			flex-direction: column;
			align-items: center;
		}
	}

	.ba-card {
		flex: 1;
		border-radius: $card-radius;
		padding: 18px 20px;
		text-align: left;

		&.before {
			background: #fff5f5;
			border: 2px dashed #ffcaca;

			p {
				font-style: italic;
				color: #999;
				font-size: 15px;
				line-height: 1.55;
				margin: 0;
			}

			.before-cost {
				margin-top: 12px;
				padding-top: 10px;
				border-top: 1px solid #ffcaca;

				.cost-line {
					font-style: normal;
					font-size: 14px;
					font-weight: 600;
					color: $text-medium;
					margin: 0 0 4px;
					line-height: 1.45;

					&:last-child {
						margin-bottom: 0;
					}

					strong {
						color: #e53e3e;
					}

					&.severe {
						color: #e53e3e;
						font-weight: 700;
					}
				}
			}
		}

		&.after {
			background: white;
			box-shadow: $card-shadow;
			border: 2px solid #e8f5e9;

			p {
				margin: 0;
				font-size: 15px;
				line-height: 1.55;
				color: $text-dark;
			}
		}
	}

	.ba-label {
		font-weight: 700;
		font-size: 16px;
		margin-bottom: 10px;
		color: $text-dark;
	}

	.ba-arrow {
		display: flex;
		align-items: center;
		font-size: 32px;
		color: $primary;
		flex-shrink: 0;

		@media (max-width: 960px) {
			transform: rotate(90deg);
		}
	}

	blockquote {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: $text-dark;
	}

	/* Intro's teaser fades toward its bottom, with extra blank space to fade into */
	.gate-tease.pre-fold {
		mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 92%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 92%);
		/*
			The mask clips to the border box, and a blur halo bleeds outside it —
			so pad on every side to give the halo room, then pull the same amount
			back with negative margins so layout doesn't shift.
		*/
		padding: 0 40px 80px;
		margin: 0 -40px -80px;
	}

	/*
		Blur ramps up in steps instead of snapping on, so the cutoff feels
		gradual. Twelve stops on a roughly exponential curve — small increments
		while text is still readable, bigger ones once it isn't.
	*/
	.blur-1 { filter: blur(0.1px); }
	.blur-2 { filter: blur(0.14px); }
	.blur-3 { filter: blur(0.19px); }
	.blur-4 { filter: blur(0.26px); }
	.blur-5 { filter: blur(0.35px); }
	.blur-6 { filter: blur(0.47px); }
	.blur-7 { filter: blur(0.64px); }
	.blur-8 { filter: blur(0.86px); }
	.blur-9 { filter: blur(1.16px); }
	.blur-10 { filter: blur(1.57px); }
	.blur-11 { filter: blur(1.9px); }
	.blur-12 { filter: blur(2.5px); }

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
