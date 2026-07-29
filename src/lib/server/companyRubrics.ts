/**
 * Company / archetype rubric sets.
 *
 * WHY: Different company bars need different probing.
 *
 * HOW IT'S USED:
 *  - During the session the coach probes against these SILENTLY (never names the
 *    rubric to the user — that invites performing to the rubric).
 *  - In the end-of-session summary, strengths/growth are framed against them so
 *    the takeaway is specific to where they're actually interviewing.
 *  - If no company is mentioned, none of this applies and the generic rubrics in
 *    the coach prompt are used unchanged.
 *
 * EDITING: this is data, not logic. To add a company, copy an entry and change
 * `aliases`, `label`, and `signals`. No other file needs to change.
 *
 * HOW THE TARGET IS IDENTIFIED: the STAR extractor reads the whole conversation each
 * turn and captures the company the user says they're INTERVIEWING AT, which is then
 * stored on the session. `aliases` are matched against that captured name — never
 * against the raw transcript. This matters: a transcript is dominated by the user's
 * PAST employer (they spend the session telling a story about it), and the coach's own
 * example prompts name companies too, so scanning text could not reliably tell target
 * from noise.
 *
 * CONFIDENCE: each entry is tagged. `documented` = the company publishes the
 * framework and trains interviewers on it. `reported` = consistent across multiple
 * interview-prep sources but not official. `inferred` = reasonable domain judgment,
 * thin sourcing — REVIEW THESE FIRST. A confidently-wrong claim is worse for a
 * paying candidate than generic advice.
 */

export interface CompanyRubric {
  /** Lowercase names matched against the extractor-captured company. Include common aliases. */
  aliases: string[];
  /** Short human label, used in the summary framing. */
  label: string;
  /** How well-sourced this entry is. See CONFIDENCE note above. */
  confidence: 'documented' | 'reported' | 'inferred';
  /** Interpreted signals — what "good" looks like in an ANSWER, not marketing copy. */
  signals: string;
}

export const COMPANY_RUBRICS: Record<string, CompanyRubric> = {
  amazon: {
    aliases: ['amazon', 'aws'],
    label: 'Amazon',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: Each interviewer is assigned specific Leadership Principles. A Bar
Raiser (external to the team, holds veto power) picks the 1-2 most important LPs and asks
3-5 behavioral questions on each, with relentless follow-ups. The follow-ups exist to test
whether the candidate actually did this or is reciting a polished summary — surface answers
get probed until they either show depth or run out of detail.

- OWNERSHIP: Speaks in "I" for decisions, not just execution. Owns outcomes beyond formal
  scope, including what went badly. "That was another team's problem" is disqualifying.
- DIVE DEEP: Can go two or three levels below the summary — real numbers, root cause, what
  the data actually said. Skeptical when metrics and anecdotes disagree. "We improved
  performance" fails; this is the LP most often used to break a weak story.
- BIAS FOR ACTION: Made a call under incomplete information; can explain what they knew,
  what they assumed, and why waiting was the worse option. Calculated speed, not recklessness.
- CUSTOMER OBSESSION: Ties work to real customer impact, not an internal metric or a ship date.
- DELIVER RESULTS: Quantified outcome tied back to the original goal.
- INVENT AND SIMPLIFY: Found a simpler path rather than adding process.
- HAVE BACKBONE; DISAGREE AND COMMIT: Respectfully challenged a decision even when
  uncomfortable — then committed fully once decision was made by the person accountable. Both halves required.
- EARN TRUST: Listened attentively, has empathy especially during conflict, spoke candidly, and was self-critical about their own
  role. Blaming others reads badly against this one.
- ARE RIGHT, A LOT: Strong judgment; sought diverse perspectives and worked to disconfirm
  their own beliefs.`,
  },

  google: {
    aliases: ['google', 'alphabet', 'youtube', 'deepmind'],
    label: 'Google',
    confidence: 'reported',
    signals: `
SOURCING CAVEAT: unlike the other entries here, this is NOT from a first-party values page.
Google's careers site publishes only EEO content; the four-dimension framework below comes
from secondary sources (prep sites, plus Google's own re:Work / "Work Rules!" material).
EXCEPTION — for this entry only: because sourcing is weaker, treat these as a SUPPLEMENT to the generic rubrics rather than a replacement. Where they conflict, prefer the generic rubrics.

HOW THEY EVALUATE: Four separately scored dimensions in every loop — General Cognitive
Ability, Leadership, Googleyness, and Role-Related Knowledge. Each interviewer submits a
score on a four-point scale plus written justification. Behavioral answers feed the
Googleyness and Leadership scores, so a story must serve both.

- EMERGENT LEADERSHIP: Led without formal authority — stepped up because the situation
  needed it, then stepped back. Title-based authority is explicitly NOT what they score.
- COMFORT WITH AMBIGUITY: Made progress when the problem, the data, or the direction was
  unclear. Can describe how they structured the ambiguity, not just that they survived it.
- RECEIVING FEEDBACK: Took critical feedback and visibly changed course if applicable. Defensiveness or
  "I explained why I was right" is a negative signal. Bonus point if using COIN or any framework to make feedback giving become objective instead of being emotional.
- CHALLENGING THE STATUS QUO: Pushed back when evidence supported it — with evidence, not
  instinct.
- USER FIRST: Chose the user over internal convenience when those conflicted.
- STRUCTURED PROBLEM SOLVING: Shows the reasoning path, not just the conclusion. This is
  what General Cognitive Ability is scoring.
- DOING THE RIGHT THING / CARING FOR THE TEAM: Ethical judgment and making others better.`,
  },

  meta: {
    aliases: ['meta', 'facebook', 'instagram', 'whatsapp'],
    label: 'Meta',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: Answers are read against Meta's six published values — Move Fast, Build
Awesome Things, Be Direct and Respect Your Colleagues, Focus on Long-Term Impact, Live in
the Future, and "Meta, Metamates, me". Behavioral rounds carry weight comparable to technical
ones. Vague answers score poorly; specificity and scale are the bar.

- MOVE FAST — The signal is compressing cycle time and shipping to
  LEARN, not raw speed. Treating a launch as the start of information-gathering scores well;
  "we shipped quickly" with no learning loop does not. Not afraid of ambiguity.
- LONG-TERM IMPACT: Chose the durable outcome over the quick win, and can say why.
- BE DIRECT: Had the hard conversation openly; resolved conflict with data rather than
  smoothing it over or escalating. Avoiding the conflict or not knowing / just guessing why other(s) came with disagreement are negative signals.
- MEASURABLE IMPACT AT SCALE: Quantified, and framed against a relatively large user base.
- SCOPE BEYOND ROLE: Took on unowned, ambiguous problems without waiting for assignment.
- BUILD AWESOME THINGS: Shipped something genuinely inspiring and ended with positive business outcome, not merely adequate.
- "META, METAMATES, ME": Took collective responsibility for company success and looked after
  teammates — company and team outcomes ahead of personal credit.`,
  },

  microsoft: {
    aliases: ['microsoft', 'azure'],
    label: 'Microsoft',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: Microsoft publishes THREE distinct frameworks — don't conflate them.
  1. Cultural attributes: Growth Mindset · Customer Obsessed · Diverse and Inclusive ·
     One Microsoft.
  2. Leadership Principles (all levels): Create Clarity · Generate Energy · Deliver Success.
  3. Manager model: Model · Coach · Care.
The central thing being screened is how the candidate behaves when they DON'T already have
the answer — "taking smart risks and learning from mistakes is how we move forward". Stories
involving learning from failure or mistake are actively valued rather than avoided.

- GROWTH MINDSET: Hit the limits of what they knew, took a calculated risk, and can describe what
  they learned and how their approach changed afterward. Naming what they got wrong is a
  positive here, not a liability. Potential is "nurtured, not pre-determined".
- CREATE CLARITY: Took a messy, ambiguous situation and made it legible for others —
  frameworks, written docs, shared definitions.
- GENERATE ENERGY: Created momentum and optimism through a hard stretch; brought others with
  them rather than pushing through alone.
- DELIVER SUCCESS: Got a real outcome, not just effort or activity.
- CUSTOMER OBSESSED: Approached the customer with "a beginner's mind" — went and understood
  the need rather than assuming it.
- MODEL / COACH / CARE: Led by example; developed others; held back on advice long enough to
  stay curious. Formally the manager model, but the behaviour is valued at every level.
- ONE MICROSOFT / INCLUSIVE COLLABORATION: Worked across org boundaries; brought in quieter
  voices; shared credit.`,
  },

  anthropic: {
    aliases: ['anthropic'],
    label: 'Anthropic',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: Anthropic publishes seven company values on its careers page, and runs a
distinct values/alignment round alongside technical rounds — candidates who pass technically
but fail that round reportedly do not get offers. It probes actual judgment and ethical
reasoning, not stated enthusiasm for the mission.

NOTE: this is NOT simply "slow and cautious". "Do the simple thing that works" is explicitly
empirical and pragmatic. The negative signal is unexamined speed — acting without having
reasoned about the downside — not speed itself.

Published values: Act for the global good · Hold light and shade · Be good to our users ·
Ignite a race to the top on safety · Do the simple thing that works · Be helpful, honest and
harmless · Put the mission first.

- HOLD LIGHT AND SHADE: Weighed real risks AND real benefits of the same decision, rather than
  being purely an optimist or purely a critic. Naming only upside, or only danger, both read thin.
- DO THE SIMPLE THING THAT WORKS: Chose the pragmatic, empirical solution over the elaborate
  one; measured impact by size of outcome, not sophistication of method.
- HELPFUL, HONEST, HARMLESS / LOW EGO: Kind and direct at once. States plainly what they got
  wrong and what they still don't know.
- SPEAKING UP, THEN COMMITTING: Raised a concern about a direction they believed was wrong —
  AND committed fully once the decision was made. Both halves required; a story ending in
  resentment or quiet non-compliance fails.
- CHANGING THEIR MIND: Genuinely updated a strongly-held view on evidence. Commonly probed
  directly ("tell me about a time you pushed back and lost"). Growth mindset.
- ACT FOR THE GLOBAL GOOD: Weighed consequences beyond the immediate user or business metric
  in an actual decision — demonstrated, not professed.
- PUT THE MISSION FIRST: Dropped their own scope or preference to do what the shared goal
  needed; took on urgent unglamorous work regardless of role.`,
  },

  openai: {
    aliases: ['openai'],
    label: 'OpenAI',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: OpenAI publishes both Values (what matters) and Operating Principles
(how they work) on its careers page.

VALUES: Humanity first · Act with humility · Feel the AGI · Ship joy.
OPERATING PRINCIPLES: Find a way · Creativity over control · Update quickly · Intense focus.

- FIND A WAY / AGENCY: Took ownership of an outcome without waiting for permission or a
  defined process; found a path when the official route was blocked. Ideas and initiative
  are expected regardless of title or tenure. Being resourceful.
- ACT WITH HUMILITY: Recognized the limits of their own knowledge; stayed open to new ideas,
  other perspectives, and the possibility of being wrong; folded feedback back into the work.
  Overconfidence is a negative signal.
- UPDATE QUICKLY: Started from a hypothesis and visibly changed approach on new information.
  Flexibility framed as a strength, not inconsistency — "we seek truth and adapt".
- CREATIVITY OVER CONTROL: Chose a creative, even imperfect solution over rigidity and
  control; reasoned from first principles rather than precedent or process.
- INTENSE FOCUS: Sustained hard, concentrated work on something that mattered; showed
  resilience, and made a hard prioritization call they can explain.
- FEEL THE AGI / RESPONSIBILITY: Held both the upside and the downside of powerful technology —
  rigor and discipline WITH boundless imagination, not caution alone.
- SHIP JOY: Built something people genuinely enjoyed using — optimism about what the work
  makes possible, plus stewardship of the mission.
- HUMANITY FIRST: Connected the work to benefit for people and society, not just the metric.`,
  },

  
  /* ── Domain archetypes — DISABLED ────────────────────────────────────────
   *
   * Disabled because none of these were backed by an actual evaluation rubric:
   *   - fintech/healthcare: sourcing described hiring COMPLIANCE OFFICERS and risk
   *     analysts — a different job family, not how a fintech scores a PM's stories.
   *   - enterprise SaaS / e-commerce: available material covered technical domain
   *     knowledge (architecture, migrations, funnel metrics), not behavioral signals.
   *     The signals below are synthesis, not sourced.
   *   - early-stage startup: directionally real (scrappiness, ambiguity, the
   *     big-company-polish concern) but advice-column material, not a rubric.
   *
   * WHY THIS MATTERS: a matched entry OVERRIDES the generic rubrics in claude.ts.
   * Those generics are validated by years of real coaching; these were a few web
   * searches. Enabling them would displace something better with something weaker.
   *
   * Re-enable individually only after rewriting from firsthand coaching experience.

  fintechRegulated: {
    aliases: ['fintech', 'payments', 'stripe', 'plaid', 'banking', 'insurance', 'healthcare', 'health tech', 'hipaa', 'medtech', 'life sciences'],
    label: 'Regulated industry (fintech / healthcare)',
    confidence: 'inferred',
    signals: `
- RISK-BASED JUDGMENT: Identified risk early and can explain the assessment, not just that a
  process was followed. Proactive risk-spotting beats reactive compliance.
- COMPLIANCE AS DESIGN CONSTRAINT: Embedded regulatory checkpoints into the product lifecycle
  rather than treating compliance as a gate at the end.
- CROSS-FUNCTIONAL WITH LEGAL/SECURITY: Worked with legal, security, and compliance partners
  as collaborators, not obstacles.
- INNOVATION VS REGULATION TRADE-OFF: Can articulate a specific decision where speed and
  regulatory boundaries conflicted, and how they resolved it.
- DATA STEWARDSHIP: Precision and care around sensitive data (HIPAA, PCI, financial records).
- ETHICAL JUDGMENT UNDER PRESSURE: Held the line when there was commercial pressure not to.`,
  },

  enterpriseSaas: {
    aliases: ['salesforce', 'workday', 'servicenow', 'sap', 'oracle', 'enterprise saas', 'b2b saas', 'enterprise cloud'],
    label: 'Enterprise SaaS / Cloud',
    confidence: 'inferred',
    signals: `
- BUYER VS USER DISTINCTION: Understands the buyer, the admin, and the end user are different
  people with conflicting needs.
- RELIABILITY AND TRUST: Weighed uptime, SLAs, migration risk, and backward compatibility.
  Enterprise customers punish breakage far more than they reward new features.
- LARGE-SCALE MIGRATION EXPERIENCE: Coordinated complex migrations across many services and
  stakeholders; can speak to sequencing and rollback.
- COMMERCIAL AWARENESS: Understands the revenue and retention consequence of a technical choice;
  worked across sales, support, and customer success.
- MATRIXED INFLUENCE: Drove outcomes through orgs they didn't control, with long decision cycles.`,
  },

  ecommerceMarketplace: {
    aliases: ['e-commerce', 'ecommerce', 'marketplace', 'shopify', 'etsy', 'instacart', 'doordash', 'uber', 'retail'],
    label: 'E-commerce / Marketplace',
    confidence: 'inferred',
    signals: `
- CUSTOMER-FIRST UNDER OPERATIONAL PRESSURE: Made the customer-protective call when it cost
  time or money.
- RELENTLESS PRIORITIZATION: Cut scope deliberately under deadline; can explain what was
  dropped and why that was safe.
- TWO-SIDED DYNAMICS: Understands that buyer and seller (or rider and driver) incentives
  conflict, and navigated that.
- FUNNEL AND METRICS FLUENCY: Comfortable with conversion, CTR, retention — ties work to them.
- DELIVERY UNDER URGENCY: Operated against peak events or seasonal deadlines with real stakes.
- LOGISTICS / REAL-WORLD COMPLEXITY: Handled the messiness where software meets physical
  operations.`,
  },

  earlyStageStartup: {
    aliases: ['early-stage startup', 'early stage startup', 'seed stage', 'series a', 'series b', 'yc ', 'y combinator'],
    label: 'Early-stage startup',
    confidence: 'inferred',
    signals: `
- SCRAPPINESS / GROUND-ZERO WORK: Built something from nothing with very limited resources;
  chose the 80% solution deliberately. Big-company polish without scrappiness is the specific
  concern founders screen for.
- COMFORT WITH AMBIGUITY: Made progress with no clear direction, no process, and no precedent —
  and wasn't frustrated by it.
- BREADTH BEYOND ROLE: Did whatever was needed well outside their job description.
- DIRECT PERSONAL OWNERSHIP: Drove the outcome personally. At this size there's no team to
  hide behind, so "we" answers land badly.
- SPEED WITH JUDGMENT: Shipped fast but can explain which corners were safe to cut.
- COLLABORATION WITH FOUNDERS: Works closely with founders daily — listening and low ego matter
  as much as capability.`,
  },

  /* ── Non-tech / public sector — DISABLED FOR NOW ──────────────────────────
   *
   * Deliberately commented out: the product is focused on tech first, where the
   * coaching expertise is. Leaving the researched drafts here so they're ready if
   * that changes.
   *
   * BEFORE RE-ENABLING, note the dependency: the GENERIC fallback rubrics in
   * claude.ts (DIVE DEEP, CUSTOMER OBSESSION, DELIVER RESULTS…) are tech-flavored.
   * A police or nursing candidate whose wording doesn't match an alias below would
   * fall through to those, which is worse than unhelpful. So enabling these also
   * requires a neutral rewrite of the generic set in claude.ts.
   *
   * These panels are often MORE formally rubric-driven than tech interviews:
   * fixed questions, independent per-panelist scoring, numeric scales.

  lawEnforcement: {
    aliases: ['police', 'oral board', 'law enforcement', 'sheriff', 'deputy', 'sergeant', 'trooper', 'corrections officer', 'firefighter', 'fire department', 'paramedic', 'emt'],
    label: 'Law enforcement / public safety oral board',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: A panel of 3-5 senior officers scores each candidate INDEPENDENTLY against
a standardized rubric, typically 5-7 competency areas on a 1-5 or 1-10 scale; the final score
is the average. Every candidate gets the same questions. Answers must be concrete and personal —
panels are explicitly screening for integrity and judgment, not polish.

- INTEGRITY AND ETHICS: Did the right thing when it was costly or unobserved. Reporting a peer,
  admitting a mistake, refusing a shortcut. This is usually the highest-weighted area and a
  single credibility problem here can end the process.
- JUDGMENT AND DECISION-MAKING: Made a sound call in a fast-moving or high-stakes situation;
  can explain the reasoning and the alternatives considered.
- STRESS TOLERANCE: Stayed effective under pressure, danger, hostility, or emotional strain —
  with a specific instance, not a claim of being "calm under pressure".
- COMMUNICATION: De-escalated, explained, or handled a difficult conversation. Clarity and
  composure in the ANSWER itself is also being scored.
- COMMUNITY ORIENTATION: Served or connected with a community, especially across difference;
  understands policing/service as a public trust.
- TEAMWORK AND DEPENDABILITY: Reliable to peers; supported the team; showed up when it was hard.
- MOTIVATION: A genuine, specific reason for this role and this department — not a generic
  "I want to help people".`,
  },

  government: {
    aliases: ['federal', 'civil service', 'government', 'public sector', 'state agency', 'county', 'municipal', 'usajobs', 'ksa', 'gs-'],
    label: 'Government / civil service panel',
    confidence: 'documented',
    signals: `
HOW THEY EVALUATE: Structured interview — every candidate is asked the identical set of
questions, and each panelist (usually 2-4: hiring manager, subject-matter expert, HR) scores
answers independently on a numerical rubric tied to published competencies. The process is
designed to be defensible and auditable, so unstructured charm counts for very little.

- MAPS TO THE STATED COMPETENCY: Answers should visibly hit the competency named in the job
  posting (the KSAs). Panels score against the written criteria, not overall impression.
- COMPLETE STAR STRUCTURE: Because scoring is per-answer, a missing Result or unclear personal
  Action directly loses points. Structure matters more here than in conversational interviews.
- PUBLIC SERVICE MOTIVATION: Connects the work to public benefit and stewardship of public
  resources.
- PROCESS AND COMPLIANCE JUDGMENT: Followed regulation and policy, and can explain a case where
  they navigated it thoughtfully rather than mechanically.
- STAKEHOLDER MANAGEMENT ACROSS BUREAUCRACY: Moved something forward across agencies or
  hierarchy with long decision cycles.
- ACCOUNTABILITY AND DOCUMENTATION: Kept records, was transparent, could withstand audit.`,
  },

  healthcareClinical: {
    aliases: ['nurse', 'nursing', 'rn ', 'clinical', 'hospital', 'patient care', 'physician', 'medical assistant', 'cna'],
    label: 'Healthcare / clinical',
    confidence: 'reported',
    signals: `
- PATIENT SAFETY FIRST: Escalated a concern, caught an error, or slowed something down to
  protect a patient — even when it was socially uncomfortable.
- CLINICAL JUDGMENT UNDER PRESSURE: Prioritized correctly with competing acute demands; can
  explain the triage reasoning.
- COMPASSION AND PATIENT ADVOCACY: Advocated for a patient's needs, including against the
  system or the schedule.
- TEAMWORK ACROSS HIERARCHY: Worked effectively with physicians, peers, and support staff;
  raised concerns upward respectfully.
- CULTURAL SENSITIVITY: Adapted care and communication across language, culture, or belief.
- ACCURACY AND DOCUMENTATION: Precision in handoffs, charting, and compliance.
- RESILIENCE: Recovered from an emotionally hard shift or outcome without disengaging.`,
  },

  education: {
    aliases: ['teacher', 'teaching', 'school district', 'principal', 'classroom', 'professor', 'educator', 'k-12'],
    label: 'Education',
    confidence: 'inferred',
    signals: `
- STUDENT OUTCOMES: Ties actions to measurable learning, growth, or engagement — not effort
  or activities alone.
- CLASSROOM MANAGEMENT: Handled a specific disruption or behavioral challenge, with what they
  did and why.
- EQUITY: Recognized and addressed a disparity in access, participation, or outcome for a
  specific group of students.
- FAMILY AND COMMUNITY ENGAGEMENT: Handled a difficult parent or guardian conversation and
  built a working partnership.
- DIFFERENTIATION: Adapted instruction for varied needs and levels within one room.
- COLLABORATION AND PROFESSIONAL GROWTH: Worked with colleagues; sought feedback and changed
  practice as a result.`,
  },

  * ──────────────────────────────────────────────────────────────────────── */
};

/**
 * Phrases that signal a company is the TARGET rather than a past employer.
 * Used to disambiguate "I worked at Google, now interviewing at Amazon".
 */
/**
 * Find the rubric set for the company the user is TARGETING.
 * No LLM call — costs nothing per turn. Returns null when no known company is
 * mentioned (→ the generic rubrics in claude.ts are used unchanged).
 *
 * Resolution order, for transcripts that mention more than one company:
 *   1. Mentions preceded by intent language ("interviewing at X") beat bare mentions,
 *      so a past employer doesn't shadow the actual target.
 *   2. Among equals, the LATEST mention wins — recency tracks the current focus.
 * Matching is word-boundary aware so "metadata" doesn't match "meta".
 */
/**
 * PRIMARY path: resolve a rubric from a clean company name that the STAR extractor
 * captured from the conversation (e.g. "Anthropic"). Far more reliable than scanning
 * a transcript, because the extractor understands "I was at Amazon, now interviewing
 * at Anthropic" — where keyword matching cannot tell target from past employer.
 * Returns null for a company we don't have a rubric for, which correctly falls back
 * to the generic rubrics.
 */
export function lookupCompanyRubric(companyName: string | null | undefined): CompanyRubric | null {
  if (!companyName) return null;
  const name = companyName.trim().toLowerCase();
  if (!name) return null;
  for (const entry of Object.values(COMPANY_RUBRICS)) {
    if (entry.aliases.some((a) => name === a || name.includes(a))) return entry;
  }
  return null;
}

