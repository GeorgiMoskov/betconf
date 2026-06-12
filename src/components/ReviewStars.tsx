import type { CSSProperties } from 'react'
import { useState } from 'react'

interface ReviewStarsProps {
  /** Score on a 0–10 scale. */
  value: number
  /** Visual size. */
  size?: 'sm' | 'md'
}

/** Read-only 5-star display for a 0–10 score (supports half stars). */
export function ReviewStars({ value, size = 'sm' }: ReviewStarsProps) {
  return (
    <span
      className={`review-stars review-stars--${size}`}
      role="img"
      aria-label={`${(value / 2).toFixed(1)} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const pct = Math.max(0, Math.min(1, value / 2 - i)) * 100
        return (
          <span className="review-star" key={i} aria-hidden="true">
            <span className="review-star__base">★</span>
            <span className="review-star__fill" style={{ width: `${pct}%` } as CSSProperties}>
              ★
            </span>
          </span>
        )
      })}
    </span>
  )
}

interface StarRatingInputProps {
  /** Current score on a 0–10 scale (0 = unset). */
  value: number
  onChange: (value: number) => void
  label: string
}

/** Interactive 5-star input with half-step precision, mapped to a 0–10 score. */
export function StarRatingInput({ value, onChange, label }: StarRatingInputProps) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value

  return (
    <span className="star-input" role="radiogroup" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => {
        const halfVal = i * 2 + 1
        const fullVal = i * 2 + 2
        const pct = Math.max(0, Math.min(1, shown / 2 - i)) * 100
        return (
          <span className="star-input__star" key={i}>
            <span className="star-input__base" aria-hidden="true">
              ★
            </span>
            <span
              className="star-input__fill"
              style={{ width: `${pct}%` } as CSSProperties}
              aria-hidden="true"
            >
              ★
            </span>
            <button
              type="button"
              className="star-input__half star-input__half--left"
              onMouseEnter={() => setHover(halfVal)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(halfVal)}
              aria-label={`${halfVal / 2} stars for ${label}`}
            />
            <button
              type="button"
              className="star-input__half star-input__half--right"
              onMouseEnter={() => setHover(fullVal)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(fullVal)}
              aria-label={`${fullVal / 2} stars for ${label}`}
            />
          </span>
        )
      })}
      <span className="star-input__value">{shown > 0 ? (shown / 2).toFixed(1) : '–'}</span>
    </span>
  )
}
