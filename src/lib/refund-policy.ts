// Single source of truth for the auto-refund threshold, shared by the client
// (to show a truthful confirm message when leaving) and the server (to make the
// actual refund decision in /api/abandon). Keeping the numbers here — not copied
// into each file — guarantees the message the user sees matches what the server does.

export const AUTO_REFUND_MAX_DURATION_MS = 3 * 60 * 1000; // 3 minutes
export const AUTO_REFUND_MAX_STAR_SECTIONS = 1; // fewer than 2 STAR sections filled

/**
 * A session qualifies for an auto-refund only if it ended early AND barely
 * progressed — i.e. no real value was delivered. Clicking "Finish" is a
 * deliberate completion and is handled separately (never refunded).
 */
export function isRefundEligible(durationMs: number, starSectionsFilled: number): boolean {
  return durationMs < AUTO_REFUND_MAX_DURATION_MS
    && starSectionsFilled <= AUTO_REFUND_MAX_STAR_SECTIONS;
}
