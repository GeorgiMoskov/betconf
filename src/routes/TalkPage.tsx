import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { AppHeader } from '../components/AppHeader'
import { SpeakerPhoto } from '../components/SpeakerMedia'
import { TalkReviews } from '../components/TalkReviews'
import { TalkResources } from '../components/TalkResources'
import { getTalkById } from '../data/conferenceCatalog'
import { useAccountStore } from '../store/accountStore'
import { useToastStore } from '../store/toastStore'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
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

export function TalkPage() {
  const { talkId } = useParams<{ talkId: string }>()
  const navigate = useNavigate()
  const detail = talkId ? getTalkById(talkId) : undefined
  const editionId = detail?.edition.id ?? ''
  const currentTalkId = detail?.talk.id ?? ''

  const isRegistered = useAccountStore((state) => state.registered.includes(editionId))
  const inCalendar = useAccountStore((state) =>
    state.calendar.some((event) => event.talkId === currentTalkId),
  )
  const addTalk = useAccountStore((state) => state.addTalk)
  const removeTalk = useAccountStore((state) => state.removeTalk)
  const notify = useToastStore((state) => state.notify)

  if (!detail) {
    return (
      <div className="conferences">
        <AppHeader />
        <main className="conferences__content">
          <div className="speaker-profile__notfound">
            <h1>Talk not found</h1>
            <p>We couldn&apos;t find the talk you were looking for.</p>
            <Button themeColor="primary" onClick={() => navigate('/speakers')}>
              Back to all speakers
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const { talk, edition, speaker } = detail

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content talk-page">
        <button
          type="button"
          className="speaker-profile__back"
          onClick={() => navigate(-1)}
        >
          <svg className="speaker-profile__back-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <section className="talk-page__hero">
          <Link className="talk-page__conf" to={`/conferences/${edition.id}`}>
            {edition.name}
          </Link>
          <h1 className="talk-page__title">{talk.title}</h1>

          <div className="talk-page__badges">
            <span
              className={`conf-card__status conf-card__status--${
                edition.upcoming ? 'upcoming' : 'past'
              }`}
            >
              {edition.upcoming ? 'Upcoming' : 'Past'}
            </span>
            {edition.upcoming && isRegistered && (
              <span className="talk-page__registered">
                <span aria-hidden="true">✓</span> Registered
              </span>
            )}
            {typeof talk.rating === 'number' && (
              <span className="event-row__rating" title="Rating earned">
                ★ {talk.rating.toFixed(2)}
              </span>
            )}
          </div>

          <p className="talk-page__description">{talk.description}</p>

          <ul className="talk-meta" aria-label="When and where">
            <li className="talk-meta__pill">
              <svg className="talk-meta__svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <rect x="3" y="4.5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 9h18M8 2.5v4M16 2.5v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {formatDate(talk.date)}
            </li>
            <li className="talk-meta__pill">
              <svg className="talk-meta__svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {formatTime(talk.time)}
            </li>
            <li className="talk-meta__pill">
              <svg className="talk-meta__svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {talk.location}
            </li>
          </ul>

          <div className="talk-page__actions">
              <button
                type="button"
                className={`conference-talk__cal talk-page__cal${
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
                <svg className="conference-talk__cal-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 9h18M8 2.5v4M16 2.5v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  {inCalendar ? (
                    <path d="M8.5 14.5l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M12 12.5v4M10 14.5h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  )}
                </svg>
                <span>{inCalendar ? 'In calendar' : 'Add to calendar'}</span>
              </button>
          </div>

          <ul className="talk-tags" aria-label="Tech stack">
            {talk.tags.map((tag) => (
              <li key={tag} className="talk-tag">
                {tag}
              </li>
            ))}
          </ul>
        </section>

        {speaker && (
          <section className="speaker-profile__panel">
            <h2 className="speaker-profile__panel-title">Speaker</h2>
            <Link className="talk-page__speaker" to={`/speakers/${speaker.id}`}>
              <SpeakerPhoto
                name={speaker.name}
                photoUrl={speaker.photoUrl}
                className="talk-page__speaker-photo"
              />
              <span className="talk-page__speaker-info">
                <span className="talk-page__speaker-name">{speaker.name}</span>
                <span className="talk-page__speaker-company">
                  {[speaker.company, speaker.country].filter(Boolean).join(' · ')}
                </span>
              </span>
            </Link>
          </section>
        )}

        <TalkResources talk={talk} />

        {(!edition.upcoming || inCalendar) && (
          <TalkReviews talk={talk} inCalendar={inCalendar} upcoming={edition.upcoming} />
        )}
      </main>
    </div>
  )
}
