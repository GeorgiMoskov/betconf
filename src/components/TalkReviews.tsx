import { useMemo, useState } from 'react'
import type { ConferenceTalk } from '../types/speaker'
import type { Review } from '../types/review'
import { RATING_CATEGORIES, overallRating, overallTier } from '../lib/ratings'
import { aggregateCategories, getTalkReviews, reviewOverall } from '../lib/reviews'
import { useAccountStore } from '../store/accountStore'
import { RatingBars } from './RatingBars'
import { ReviewStars, StarRatingInput } from './ReviewStars'

interface TalkReviewsProps {
  talk: ConferenceTalk
  /** Whether the talk is in the user's calendar (gates reviewing). */
  inCalendar: boolean
  /** Whether the talk's edition is still upcoming (no community reviews yet). */
  upcoming?: boolean
}

const reviewDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatReviewDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return reviewDateFormatter.format(new Date(year, month - 1, day))
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function todayISO(): string {
  const now = new Date()
  const yy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

export function TalkReviews({ talk, inCalendar, upcoming = false }: TalkReviewsProps) {
  const reviews = useAccountStore((state) => state.reviews)
  const saveReview = useAccountStore((state) => state.saveReview)
  const removeReview = useAccountStore((state) => state.removeReview)

  const myReview = reviews.find((r) => r.talkId === talk.id)
  const shown = useMemo(() => getTalkReviews(talk, reviews), [talk, reviews])
  const aggregate = useMemo(() => aggregateCategories(shown), [shown])
  const overall = overallRating(aggregate)

  return (
    <section className="talk-reviews">
      <header className="talk-reviews__head">
        <h2 className="talk-reviews__title">
          {upcoming ? 'Your review' : 'Audience reviews'}
        </h2>
        <span className="talk-reviews__count">
          {shown.length} {shown.length === 1 ? 'review' : 'reviews'}
        </span>
      </header>

      {upcoming && (
        <p className="talk-reviews__upcoming-note">
          This talk hasn&apos;t happened yet — ratings and comments open once it&apos;s done.
        </p>
      )}

      {overall !== null && shown.length > 0 && (
        <div className="talk-reviews__summary">
          <div className="talk-reviews__score">
            <span className="talk-reviews__score-value">{overall.toFixed(1)}</span>
            <span className="talk-reviews__score-max">/ 10</span>
            <ReviewStars value={overall} size="md" />
            <span
              className={`talk-reviews__tier talk-reviews__tier--${overallTier(overall).toLowerCase()}`}
            >
              {overallTier(overall)}
            </span>
          </div>
          <div className="talk-reviews__bars">
            <RatingBars title="Category breakdown" categories={aggregate} />
          </div>
        </div>
      )}

      {inCalendar && !upcoming ? (
        <ReviewForm
          key={myReview ? 'edit' : 'new'}
          existing={myReview?.scores}
          existingComment={myReview?.comment}
          onSubmit={(scores, comment) =>
            saveReview({
              talkId: talk.id,
              conferenceId: talk.conferenceId,
              speakerId: talk.speakerId,
              date: todayISO(),
              scores,
              comment: comment.trim() || undefined,
            })
          }
          onRemove={myReview ? () => removeReview(talk.id) : undefined}
        />
      ) : !inCalendar ? (
        <div className="talk-reviews__locked">
          <span className="talk-reviews__locked-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <rect x="5" y="10.5" width="14" height="9" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          Add this talk to your calendar to share your own review.
        </div>
      ) : null}

      <ul className="review-list" aria-label="Community reviews">
        {shown.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ul>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const overall = reviewOverall(review)
  return (
    <li className={`review-card${review.mine ? ' review-card--mine' : ''}`}>
      <div className="review-card__head">
        <span className="review-card__avatar" aria-hidden="true">
          {initials(review.author)}
        </span>
        <div className="review-card__who">
          <span className="review-card__author">
            {review.author}
            {review.mine && <span className="review-card__badge">Your review</span>}
          </span>
          <span className="review-card__date">{formatReviewDate(review.date)}</span>
        </div>
        <span className="review-card__score">
          <ReviewStars value={overall} />
          <span className="review-card__score-value">{overall.toFixed(1)}</span>
        </span>
      </div>

      <ul className="review-card__cats" aria-label="Category scores">
        {RATING_CATEGORIES.map((category) => (
          <li className="review-card__cat" key={category}>
            <span className="review-card__cat-label">{category}</span>
            <span className="review-card__cat-value">{(review.scores[category] ?? 0).toFixed(0)}</span>
          </li>
        ))}
      </ul>

      {review.comment && <p className="review-card__comment">{review.comment}</p>}
    </li>
  )
}

interface ReviewFormProps {
  existing?: Record<string, number>
  existingComment?: string
  onSubmit: (scores: Record<string, number>, comment: string) => void
  onRemove?: () => void
}

export function ReviewForm({ existing, existingComment, onSubmit, onRemove }: ReviewFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const category of RATING_CATEGORIES) {
      init[category] = existing?.[category] ?? 0
    }
    return init
  })
  const [comment, setComment] = useState(existingComment ?? '')
  const [saved, setSaved] = useState(false)

  const allRated = RATING_CATEGORIES.every((c) => (scores[c] ?? 0) > 0)
  const isEditing = Boolean(onRemove)

  const handleSubmit = () => {
    if (!allRated) {
      return
    }
    onSubmit(scores, comment)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }

  return (
    <form
      className="review-form"
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <span className="review-form__title">{isEditing ? 'Update your review' : 'Leave a review'}</span>
      <p className="review-form__hint">Rate all five categories. A written comment is optional.</p>

      <ul className="review-form__cats">
        {RATING_CATEGORIES.map((category) => (
          <li className="review-form__cat" key={category}>
            <span className="review-form__cat-label">{category}</span>
            <StarRatingInput
              label={category}
              value={scores[category] ?? 0}
              onChange={(value) => setScores((prev) => ({ ...prev, [category]: value }))}
            />
          </li>
        ))}
      </ul>

      <label className="review-form__comment-label" htmlFor="review-comment">
        Comment <span className="review-form__optional">(optional)</span>
      </label>
      <textarea
        id="review-comment"
        className="review-form__comment"
        placeholder="What stood out? What could have been better?"
        value={comment}
        rows={3}
        onChange={(event) => setComment(event.target.value)}
      />

      <div className="review-form__actions">
        <button type="submit" className="review-form__submit" disabled={!allRated}>
          {isEditing ? 'Update review' : 'Submit review'}
        </button>
        {onRemove && (
          <button type="button" className="review-form__remove" onClick={onRemove}>
            Remove
          </button>
        )}
        {!allRated && (
          <span className="review-form__note">Rate every category to submit.</span>
        )}
        {saved && allRated && (
          <span className="review-form__saved" role="status">
            ✓ Saved
          </span>
        )}
      </div>
    </form>
  )
}
