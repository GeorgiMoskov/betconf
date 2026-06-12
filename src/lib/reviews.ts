import type { ConferenceTalk } from '../types/speaker'
import type { Review, UserReview } from '../types/review'
import { RATING_CATEGORIES, type CategoryRating } from './ratings'
import { generateDummyReviews } from '../data/reviews'

/** A rating value paired with the number of reviews it was derived from. */
export interface RatingResult {
  rating: number | undefined
  count: number
}

/** How strongly the curated speaker rating resists being moved by reviews. */
const SPEAKER_BLEND_WEIGHT = 12

/** Mean of a review's per-category scores (0–10). */
export function reviewOverall(review: Review): number {
  const sum = RATING_CATEGORIES.reduce((acc, c) => acc + (review.scores[c] ?? 0), 0)
  return sum / RATING_CATEGORIES.length
}

/** Convert the signed-in user's stored review into a displayable Review. */
export function userReviewToReview(review: UserReview): Review {
  return {
    id: `${review.talkId}-mine`,
    author: 'You',
    date: review.date,
    scores: review.scores,
    comment: review.comment,
    mine: true,
  }
}

/**
 * All reviews shown for a talk: the seeded community reviews plus the user's
 * own review (pinned first) when present.
 */
export function getTalkReviews(talk: ConferenceTalk, userReviews: UserReview[]): Review[] {
  const dummy = generateDummyReviews(talk)
  const mine = userReviews.find((r) => r.talkId === talk.id)
  return mine ? [userReviewToReview(mine), ...dummy] : dummy
}

/** Average each rating category across a set of reviews. */
export function aggregateCategories(reviews: Review[]): CategoryRating[] {
  if (reviews.length === 0) {
    return RATING_CATEGORIES.map((label) => ({ label, value: 0 }))
  }
  return RATING_CATEGORIES.map((label) => {
    const sum = reviews.reduce((acc, r) => acc + (r.scores[label] ?? 0), 0)
    return { label, value: Math.round((sum / reviews.length) * 10) / 10 }
  })
}

/** Effective rating for a single talk = mean of all its reviews' overalls. */
export function effectiveTalkRating(
  talk: ConferenceTalk,
  userReviews: UserReview[],
): RatingResult {
  const reviews = getTalkReviews(talk, userReviews)
  if (reviews.length === 0) {
    return { rating: talk.rating, count: 0 }
  }
  const avg = reviews.reduce((acc, r) => acc + reviewOverall(r), 0) / reviews.length
  return { rating: Math.round(avg * 100) / 100, count: reviews.length }
}

/**
 * Effective rating for a conference edition = mean of its past talks' effective
 * ratings. `count` is the total number of reviews across those talks.
 */
export function effectiveEditionRating(
  talks: ConferenceTalk[],
  baseline: number | undefined,
  userReviews: UserReview[],
): RatingResult {
  const past = talks.filter((t) => !t.upcoming && typeof t.rating === 'number')
  if (past.length === 0) {
    return { rating: baseline, count: 0 }
  }
  let sum = 0
  let count = 0
  for (const talk of past) {
    const result = effectiveTalkRating(talk, userReviews)
    if (typeof result.rating === 'number') {
      sum += result.rating
    }
    count += result.count
  }
  return { rating: Math.round((sum / past.length) * 100) / 100, count }
}

/**
 * Effective speaker rating: the curated rating gently blended with the user's
 * own reviews on the speaker's past talks. Community (seeded) reviews are not
 * folded into the number, but they are counted for the review-count badge.
 */
export function effectiveSpeakerRating(
  baseRating: number,
  pastTalks: ConferenceTalk[],
  userReviews: UserReview[],
): RatingResult {
  let count = 0
  for (const talk of pastTalks) {
    count += getTalkReviews(talk, userReviews).length
  }
  const mine = userReviews.filter((u) => pastTalks.some((t) => t.id === u.talkId))
  if (mine.length === 0) {
    return { rating: baseRating, count }
  }
  const sumMine = mine.reduce((acc, u) => acc + reviewOverall(userReviewToReview(u)), 0)
  const blended =
    (baseRating * SPEAKER_BLEND_WEIGHT + sumMine) / (SPEAKER_BLEND_WEIGHT + mine.length)
  return { rating: Math.round(blended * 100) / 100, count }
}

/**
 * Aggregate per-category ratings across every review of a speaker's past talks,
 * for the speaker profile's "Overall visitors rating" bars.
 */
export function aggregateSpeakerReviews(
  pastTalks: ConferenceTalk[],
  userReviews: UserReview[],
): { categories: CategoryRating[]; count: number } {
  const all: Review[] = []
  for (const talk of pastTalks) {
    all.push(...getTalkReviews(talk, userReviews))
  }
  return { categories: aggregateCategories(all), count: all.length }
}
