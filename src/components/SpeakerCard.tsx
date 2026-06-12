import type { ReactSummitSpeaker } from '../types/speaker'
import {
  SpeakerAchievements,
  SpeakerPhoto,
  SpeakerRating,
  SpeakerSocials,
  SpeakerTags,
} from './SpeakerMedia'
import { getSpeakerConferences } from '../data/conferenceCatalog'
import { effectiveSpeakerRating } from '../lib/reviews'
import { useAccountStore } from '../store/accountStore'

interface SpeakerCardProps {
  speaker: ReactSummitSpeaker
  rank: number
  onSelect: (speaker: ReactSummitSpeaker) => void
}

export function SpeakerCard({ speaker, rank, onSelect }: SpeakerCardProps) {
  const location = [speaker.company, speaker.country].filter(Boolean).join(' · ')
  const isTopThree = rank <= 3

  const reviews = useAccountStore((state) => state.reviews)
  const pastTalks = getSpeakerConferences(speaker.id).past
  const { rating: effectiveRating, count: reviewCount } = effectiveSpeakerRating(
    speaker.rating,
    pastTalks,
    reviews,
  )

  return (
    <article className="speaker-card">
      <div className="speaker-card__rankbar">
        <span
          className={`speaker-rank${isTopThree ? ` speaker-rank--top speaker-rank--${rank}` : ''}`}
          title={`Rank #${rank}`}
        >
          <span className="speaker-rank__hash">#</span>
          {rank}
        </span>
        <span className="speaker-points" title="Ranking points">
          <span className="speaker-points__value">
            {speaker.rankingPoints.toLocaleString('en-US')}
          </span>
          <span className="speaker-points__label">pts</span>
        </span>
      </div>

      <button
        type="button"
        className="speaker-card__main"
        onClick={() => onSelect(speaker)}
        aria-label={`View details for ${speaker.name}`}
      >
        <div className="speaker-card__media">
          <SpeakerPhoto
            name={speaker.name}
            photoUrl={speaker.photoUrl}
            className="speaker-card__photo"
          />
          <SpeakerRating rating={effectiveRating ?? speaker.rating} />
        </div>
        <h3 className="speaker-card__name">{speaker.name}</h3>
        {location && <p className="speaker-card__meta">{location}</p>}
        {speaker.role && <p className="speaker-card__role">{speaker.role}</p>}
        {reviewCount > 0 && (
          <span className="speaker-card__reviews">
            <span className="speaker-card__reviews-star" aria-hidden="true">
              ★
            </span>
            {reviewCount} review{reviewCount === 1 ? '' : 's'}
          </span>
        )}

        <SpeakerAchievements
          achievements={speaker.achievements}
          className="speaker-card__badges"
        />

        {speaker.talk && <p className="speaker-card__talk">{speaker.talk}</p>}

        <SpeakerTags tags={speaker.tags} className="speaker-card__tags" />
      </button>

      <SpeakerSocials socials={speaker.socials} />
    </article>
  )
}
