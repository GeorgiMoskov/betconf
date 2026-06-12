import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { AppHeader } from '../components/AppHeader'
import { SpeakerPhoto, SpeakerRating } from '../components/SpeakerMedia'
import { HypeBadge } from '../components/HypeBadge'
import { getConferenceById } from '../data/conferenceCatalog'
import { effectiveEditionRating } from '../lib/reviews'
import { useAccountStore } from '../store/accountStore'
import { useToastStore } from '../store/toastStore'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}

export function ConferencePage() {
  const { conferenceId } = useParams<{ conferenceId: string }>()
  const navigate = useNavigate()
  const detail = conferenceId ? getConferenceById(conferenceId) : undefined
  const editionId = detail?.edition.id ?? ''

  const isFavourite = useAccountStore((state) => state.favourites.includes(editionId))
  const isRegistered = useAccountStore((state) => state.registered.includes(editionId))
  const toggleFavourite = useAccountStore((state) => state.toggleFavourite)
  const toggleRegistered = useAccountStore((state) => state.toggleRegistered)
  const calendar = useAccountStore((state) => state.calendar)
  const addTalk = useAccountStore((state) => state.addTalk)
  const removeTalk = useAccountStore((state) => state.removeTalk)
  const reviews = useAccountStore((state) => state.reviews)
  const notify = useToastStore((state) => state.notify)

  if (!detail) {
    return (
      <div className="conferences">
        <AppHeader />
        <main className="conferences__content">
          <div className="speaker-profile__notfound">
            <h1>Conference not found</h1>
            <p>We couldn&apos;t find the conference you were looking for.</p>
            <Button themeColor="primary" onClick={() => navigate('/speakers')}>
              Back to all speakers
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const { edition, talks, speakers } = detail
  const calendarTalkIds = new Set(calendar.map((event) => event.talkId))
  const { rating: effectiveRating, count: reviewCount } = effectiveEditionRating(
    talks,
    edition.rating,
    reviews,
  )

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content conference-page">
        <button
          type="button"
          className="speaker-profile__back"
          onClick={() => navigate('/conferences')}
        >
          ← All conferences
        </button>

        <section className="conference-page__hero">
          <div className="conference-page__intro">
            <div className="conference-page__topline">
              <span className="conference-page__brand">{edition.brand}</span>
              <span
                className={`conf-card__status conf-card__status--${
                  edition.upcoming ? 'upcoming' : 'past'
                }`}
              >
                {edition.upcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>
            <h1 className="conference-page__name">{edition.name}</h1>
            <p className="conference-page__meta">
              {edition.location} · {formatDate(edition.startDate)}
            </p>
            {edition.description && (
              <p className="conference-page__description">{edition.description}</p>
            )}
            {edition.hype && (
              <div className="conference-page__hype">
                <HypeBadge hype={edition.hype} size="md" />
              </div>
            )}

            {edition.technologies.length > 0 && (
              <ul className="conference-page__stack" aria-label="Technologies">
                {edition.technologies.map((tech) => (
                  <li key={tech} className="event-row__chip">
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            <div className="conference-page__actions">
              {edition.upcoming && (
                <button
                  type="button"
                  className={`conf-action conf-action--register${
                    isRegistered ? ' conf-action--registered' : ''
                  }`}
                  onClick={() => toggleRegistered(edition.id)}
                  aria-pressed={isRegistered}
                >
                  <span className="conf-action__icon" aria-hidden="true">
                    {isRegistered ? '✓' : '＋'}
                  </span>
                  <span>{isRegistered ? 'Registered' : 'Register'}</span>
                </button>
              )}
              <button
                type="button"
                className={`conf-action conf-action--fav${
                  isFavourite ? ' conf-action--faved' : ''
                }`}
                onClick={() => toggleFavourite(edition.id)}
                aria-pressed={isFavourite}
              >
                <span className="conf-action__icon" aria-hidden="true">
                  {isFavourite ? '★' : '☆'}
                </span>
                {isFavourite ? 'Saved to favourites' : 'Add to favourites'}
              </button>
            </div>
          </div>

          <div className="conference-page__rating">
            {typeof effectiveRating === 'number' ? (
              <>
                <SpeakerRating rating={effectiveRating} size="lg" />
                {reviewCount > 0 && (
                  <span className="conference-page__rating-reviews">
                    {reviewCount} review{reviewCount === 1 ? '' : 's'}
                  </span>
                )}
              </>
            ) : (
              <span className="conference-page__rating-tbd">
                <span className="conference-page__rating-tbd-mark" aria-hidden="true">
                  ★
                </span>
                <span className="conference-page__rating-tbd-label">Rating TBD</span>
              </span>
            )}
          </div>
        </section>

        <div className="conference-page__columns">
          <section className="speaker-profile__panel">
            <h2 className="speaker-profile__panel-title">
              Talks <span className="conference-page__count">{talks.length}</span>
            </h2>
            <ul className="conference-talks">
              {talks.map((talk) => {
                const inCalendar = calendarTalkIds.has(talk.id)
                return (
                  <li key={talk.id} className="conference-talk">
                    <div className="conference-talk__main">
                      <Link className="conference-talk__title" to={`/talks/${talk.id}`}>
                        {talk.title}
                      </Link>
                      <Link
                        className="conference-talk__speaker"
                        to={`/speakers/${talk.speakerId}`}
                      >
                        {speakers.find((s) => s.id === talk.speakerId)?.name ?? talk.speakerId}
                      </Link>
                      <ul className="talk-meta" aria-label="When">
                        <li className="talk-meta__pill">
                          <span className="talk-meta__icon" aria-hidden="true">
                            📅
                          </span>
                          {formatDate(talk.date)}
                        </li>
                        <li className="talk-meta__pill">
                          <span className="talk-meta__icon" aria-hidden="true">
                            🕒
                          </span>
                          {formatTime(talk.time)}
                        </li>
                      </ul>
                      <p className="conference-talk__desc">{talk.description}</p>
                      <ul className="talk-tags" aria-label="Tech stack">
                        {talk.tags.map((tag) => (
                          <li key={tag} className="talk-tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="conference-talk__aside">
                      {typeof talk.rating === 'number' && (
                        <span className="event-row__rating" title="Rating earned">
                          ★ {talk.rating.toFixed(2)}
                        </span>
                      )}
                      <button
                          type="button"
                          className={`conference-talk__cal${
                            inCalendar ? ' conference-talk__cal--on' : ''
                          }`}
                          onClick={() => {
                            if (inCalendar) {
                              removeTalk(talk.id)
                              return
                            }
                            const wasRegistered = isRegistered
                            addTalk({
                              talkId: talk.id,
                              conferenceId: edition.id,
                              conferenceName: edition.name,
                              title: talk.title,
                              date: talk.date,
                              time: talk.time,
                              location: edition.location,
                              speakerId: talk.speakerId,
                            })
                            notify(
                              'Added to your calendar',
                              wasRegistered
                                ? edition.name
                                : `You're now registered for ${edition.name}`,
                            )
                          }}
                          aria-pressed={inCalendar}
                          title={inCalendar ? 'Remove from calendar' : 'Add to calendar'}
                        >
                          <svg
                            className="conference-talk__cal-icon"
                            viewBox="0 0 24 24"
                            width="15"
                            height="15"
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
                            {inCalendar ? (
                              <path
                                d="M8.5 14.5l2.5 2.5 4.5-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            ) : (
                              <path
                                d="M12 12.5v4M10 14.5h4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            )}
                          </svg>
                          <span>{inCalendar ? 'In calendar' : 'Add to calendar'}</span>
                        </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="speaker-profile__panel">
            <h2 className="speaker-profile__panel-title">
              Speakers <span className="conference-page__count">{speakers.length}</span>
            </h2>
            <ul className="conference-speakers">
              {speakers.map((speaker) => (
                <li key={speaker.id} className="conference-speaker">
                  <Link className="conference-speaker__link" to={`/speakers/${speaker.id}`}>
                    <SpeakerPhoto
                      name={speaker.name}
                      photoUrl={speaker.photoUrl}
                      className="conference-speaker__photo"
                    />
                    <span className="conference-speaker__info">
                      <span className="conference-speaker__name">{speaker.name}</span>
                      <span className="conference-speaker__company">{speaker.company}</span>
                    </span>
                    <span className="conference-speaker__rating">
                      <SpeakerRating rating={speaker.rating} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
