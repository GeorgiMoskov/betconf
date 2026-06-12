import { Link } from 'react-router-dom'
import type { MouseEvent } from 'react'
import type { ConferenceDetail } from '../data/conferenceCatalog'
import { SpeakerPhoto } from './SpeakerMedia'
import { HypeBadge } from './HypeBadge'
import { useAccountStore } from '../store/accountStore'
import { effectiveEditionRating } from '../lib/reviews'

interface ConferenceCardProps {
  conference: ConferenceDetail
}

const MAX_VISIBLE_SPEAKERS = 4
const MAX_VISIBLE_TECH = 4

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
  const { edition, talks, speakers } = conference
  const visibleSpeakers = speakers.slice(0, MAX_VISIBLE_SPEAKERS)
  const speakerOverflow = speakers.length - visibleSpeakers.length
  const visibleTech = edition.technologies.slice(0, MAX_VISIBLE_TECH)
  const techOverflow = edition.technologies.length - visibleTech.length

  const isFavourite = useAccountStore((state) => state.favourites.includes(edition.id))
  const toggleFavourite = useAccountStore((state) => state.toggleFavourite)
  const reviews = useAccountStore((state) => state.reviews)
  const { rating: effectiveRating, count: reviewCount } = effectiveEditionRating(
    talks,
    edition.rating,
    reviews,
  )

  const handleFavourite = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleFavourite(edition.id)
  }

  return (
    <article className="conf-card">
      <button
        type="button"
        className={`conf-card__fav${isFavourite ? ' conf-card__fav--on' : ''}`}
        onClick={handleFavourite}
        aria-pressed={isFavourite}
        aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      >
        <span aria-hidden="true">{isFavourite ? '★' : '☆'}</span>
      </button>
      <Link className="conf-card__link" to={`/conferences/${edition.id}`}>
        <div className="conf-card__top">
          <div className="conf-card__topline">
            <span
              className={`conf-card__status conf-card__status--${
                edition.upcoming ? 'upcoming' : 'past'
              }`}
            >
              {edition.upcoming ? 'Upcoming' : 'Past'}
            </span>
            {edition.hype && <HypeBadge hype={edition.hype} size="sm" />}
          </div>
          {typeof effectiveRating === 'number' && (
            <div className="conf-card__rating">
              <span className="conf-card__rating-value">{effectiveRating.toFixed(2)}</span>
              <span className="conf-card__rating-scale">/ 10</span>
            </div>
          )}
        </div>

        <div className="conf-card__body">
          <span className="conf-card__brand">{edition.brand}</span>
          <h3 className="conf-card__title">{edition.name}</h3>
          <ul className="conf-card__meta" aria-label="When and where">
            <li className="conf-card__meta-item">
              <svg
                className="conf-card__meta-icon"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="4.5"
                  width="18"
                  height="16"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3 9h18M8 2.5v4M16 2.5v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="conf-card__date">{formatDate(edition.startDate)}</span>
            </li>
            <li className="conf-card__meta-item">
              <svg
                className="conf-card__meta-icon"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <path
                  d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <span className="conf-card__location">{edition.location}</span>
            </li>
          </ul>

          {visibleTech.length > 0 && (
            <ul className="conf-card__tech" aria-label="Technologies">
              {visibleTech.map((tech) => (
                <li key={tech} className="conf-card__pill">
                  {tech}
                </li>
              ))}
              {techOverflow > 0 && (
                <li className="conf-card__pill conf-card__pill--more">+{techOverflow}</li>
              )}
            </ul>
          )}
        </div>

        <div className="conf-card__footer">
          <div className="conf-card__avatars">
            {visibleSpeakers.map((speaker) => (
              <span key={speaker.id} className="conf-card__avatar" title={speaker.name}>
                <SpeakerPhoto name={speaker.name} photoUrl={speaker.photoUrl} />
              </span>
            ))}
            {speakerOverflow > 0 && (
              <span
                className="conf-card__avatar conf-card__avatar--more"
                title={`${speakerOverflow} more speakers`}
              >
                +{speakerOverflow}
              </span>
            )}
          </div>
          <span className="conf-card__counts">
            <span className="conf-card__count-value">{speakers.length}</span>
            <span className="conf-card__count-label">
              speaker{speakers.length === 1 ? '' : 's'}
            </span>
            <span className="conf-card__dot" aria-hidden="true">
              ·
            </span>
            <span className="conf-card__count-value">{talks.length}</span>
            <span className="conf-card__count-label">talk{talks.length === 1 ? '' : 's'}</span>
            {reviewCount > 0 && (
              <>
                <span className="conf-card__dot" aria-hidden="true">
                  ·
                </span>
                <span className="conf-card__count-value">{reviewCount}</span>
                <span className="conf-card__count-label">
                  review{reviewCount === 1 ? '' : 's'}
                </span>
              </>
            )}
          </span>
        </div>
      </Link>
    </article>
  )
}
