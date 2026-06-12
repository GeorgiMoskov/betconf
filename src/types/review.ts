/**
 * Audience reviews for a past talk. A review scores every rating category
 * (0–10) and may carry an optional written comment. Reviews feed back into the
 * talk's, conference's, and speaker's effective ratings.
 */

/** Map of rating-category label -> score (0–10). */
export type CategoryScores = Record<string, number>

/** A single review shown on a talk's event page. */
export interface Review {
  id: string
  /** Display name of the reviewer. */
  author: string
  /** ISO date (YYYY-MM-DD) the review was left. */
  date: string
  /** Per-category scores (0–10), keyed by category label. */
  scores: CategoryScores
  /** Optional free-text comment. */
  comment?: string
  /** True when authored by the currently signed-in user. */
  mine?: boolean
}

/**
 * A review authored by the signed-in user, persisted in the account store.
 * Carries the conference/speaker ids so ratings can be re-aggregated without
 * re-resolving the talk.
 */
export interface UserReview {
  talkId: string
  conferenceId: string
  speakerId: string
  /** ISO date (YYYY-MM-DD) the review was submitted. */
  date: string
  scores: CategoryScores
  comment?: string
}
