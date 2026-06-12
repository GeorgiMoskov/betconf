import type { CSSProperties } from 'react'
import type { CategoryRating } from '../lib/ratings'
import { overallRating, overallTier } from '../lib/ratings'

interface RatingBarsProps {
  title: string
  categories: CategoryRating[]
}

export function RatingBars({ title, categories }: RatingBarsProps) {
  const overall = overallRating(categories)

  return (
    <div className="event-ratings-block">
      <span className="event-ratings__title">{title}</span>
      <ul className="event-ratings" aria-label="Rating breakdown">
        {categories.map((category) => (
          <li className="event-ratings__row" key={category.label}>
            <span className="event-ratings__label">{category.label}</span>
            <span className="event-ratings__track">
              <span
                className="event-ratings__fill"
                style={{ '--bar-val': `${category.value * 10}%` } as CSSProperties}
              />
            </span>
            <span className="event-ratings__num">{category.value.toFixed(1)}</span>
          </li>
        ))}
      </ul>
      {overall !== null && (
        <div className="event-ratings__overall">
          <span
            className={`event-ratings__tier event-ratings__tier--${overallTier(overall).toLowerCase()}`}
          >
            {overallTier(overall)}
          </span>
          <span className="event-ratings__overall-value">
            <span className="event-ratings__overall-star" aria-hidden="true">
              ★
            </span>
            {overall.toFixed(1)}
            <span className="event-ratings__overall-max">/ 10</span>
          </span>
        </div>
      )}
    </div>
  )
}
