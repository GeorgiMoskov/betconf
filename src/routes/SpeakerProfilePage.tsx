import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { AppHeader } from '../components/AppHeader'
import {
  SpeakerAchievements,
  SpeakerPhoto,
  SpeakerRating,
  SpeakerSocials,
  SpeakerTags,
} from '../components/SpeakerMedia'
import { getSpeakerById, getSpeakerRank } from '../data/reactSummitSpeakers'
import { getSpeakerConferences } from '../data/conferenceCatalog'
import { ratingTier } from '../lib/speakerHelpers'
import { aggregateSpeakerReviews, effectiveSpeakerRating } from '../lib/reviews'
import { useAccountStore } from '../store/accountStore'
import { SpeakerConferencesPanel } from '../components/SpeakerConferencesPanel'
import { RatingBars } from '../components/RatingBars'
import { EarningsLog } from '../components/EarningsLog'

export function SpeakerProfilePage() {
  const { speakerId } = useParams<{ speakerId: string }>()
  const navigate = useNavigate()
  const speaker = speakerId ? getSpeakerById(speakerId) : undefined
  const reviews = useAccountStore((state) => state.reviews)

  if (!speaker) {
    return (
      <div className="conferences">
        <AppHeader />
        <main className="conferences__content">
          <div className="speaker-profile__notfound">
            <h1>Speaker not found</h1>
            <p>We couldn&apos;t find the speaker you were looking for.</p>
            <Button themeColor="primary" onClick={() => navigate('/speakers')}>
              Back to all speakers
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const rank = getSpeakerRank(speaker.id)
  const isTopThree = rank > 0 && rank <= 3
  const location = [speaker.company, speaker.country].filter(Boolean).join(' · ')
  const conferences = getSpeakerConferences(speaker.id)
  const { rating: effectiveRating, count: reviewCount } = effectiveSpeakerRating(
    speaker.rating,
    conferences.past,
    reviews,
  )
  const displayRating = effectiveRating ?? speaker.rating
  const tier = ratingTier(displayRating)
  const overallRatings = aggregateSpeakerReviews(conferences.past, reviews).categories
  const hasRatings = conferences.past.some((talk) => typeof talk.rating === 'number')

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content speaker-profile">
        <button
          type="button"
          className="speaker-profile__back"
          onClick={() => navigate('/speakers')}
        >
          ← All speakers
        </button>

        <section className="speaker-profile__hero">
          <div className="speaker-profile__media">
            <SpeakerPhoto
              name={speaker.name}
              photoUrl={speaker.photoUrl}
              className="speaker-profile__photo"
            />
            <SpeakerRating rating={displayRating} size="lg" />
          </div>

          <div className="speaker-profile__intro">
            <div className="speaker-profile__rankrow">
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
              <span className={`speaker-profile__tier speaker-profile__tier--${tier.tone}`}>
                {tier.label} · {displayRating.toFixed(2)} / 10
              </span>
            </div>

            <h1 className="speaker-profile__name">{speaker.name}</h1>
            {location && <p className="speaker-profile__meta">{location}</p>}
            {speaker.role && <p className="speaker-profile__role">{speaker.role}</p>}

            <div className="speaker-profile__field">
              <span className="speaker-profile__field-label">Skills</span>
              <SpeakerTags tags={speaker.tags} className="speaker-profile__tags" />
            </div>

            {speaker.achievements.length > 0 && (
              <div className="speaker-profile__field">
                <span className="speaker-profile__field-label">Achievements</span>
                <SpeakerAchievements
                  achievements={speaker.achievements}
                  className="speaker-profile__hero-badges"
                />
              </div>
            )}

            <div className="speaker-profile__field">
              <span className="speaker-profile__field-label">Social media</span>
              <SpeakerSocials socials={speaker.socials} />
            </div>
          </div>
        </section>

        <div className="speaker-profile__columns">
          <section className="speaker-profile__grid">
            <article className="speaker-profile__panel speaker-profile__panel--expertise">
              <h2 className="speaker-profile__panel-title">About</h2>
              <p className="speaker-profile__bio">{speaker.bio}</p>
              <p className="speaker-profile__expertise">{speaker.expertise}</p>
            </article>

            {speaker.talk && (
              <article className="speaker-profile__panel speaker-profile__panel--talk">
                <h2 className="speaker-profile__panel-title">Talk</h2>
                <p className="speaker-profile__talk">{speaker.talk}</p>
              </article>
            )}
          </section>

          <div className="speaker-profile__right">
            {hasRatings && (
              <article className="speaker-profile__panel speaker-profile__panel--ratings">
                <RatingBars title="Overall visitors rating" categories={overallRatings} />
                {reviewCount > 0 && (
                  <p className="speaker-profile__reviews-count">
                    Based on {reviewCount} community review{reviewCount === 1 ? '' : 's'}
                  </p>
                )}
              </article>
            )}

            <SpeakerConferencesPanel conferences={conferences} />

            <EarningsLog
              speakerId={speaker.id}
              conferences={conferences}
              totalPoints={speaker.rankingPoints}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
