import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog } from '@progress/kendo-react-dialogs'
import type { ConferenceTalk, SpeakerConferences } from '../types/speaker'
import { categoryRatings } from '../lib/ratings'
import { HypeBadge } from './HypeBadge'
import { RatingBars } from './RatingBars'
import { RatingTimeline } from './RatingTimeline'

interface SpeakerConferencesPanelProps {
  conferences: SpeakerConferences
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

function TalkRow({ talk }: { talk: ConferenceTalk }) {
  const showRatings = typeof talk.rating === 'number'

  return (
    <li className="event-row">
      <div className="event-row__main">
        <div className="event-row__head">
          <Link className="event-row__talk" to={`/talks/${talk.id}`}>
            {talk.title}
          </Link>
        </div>

        <div className="event-row__confline">
          <Link className="event-row__conf" to={`/conferences/${talk.conferenceId}`}>
            {talk.conferenceName}
          </Link>
          {talk.hype && <HypeBadge hype={talk.hype} size="sm" />}
        </div>

        <div className="event-row__meta">
          <span className="event-row__date">{formatDate(talk.date)}</span>
          <span className="event-row__dot" aria-hidden="true">
            ·
          </span>
          <span className="event-row__location">{talk.location}</span>
        </div>
      </div>

      {showRatings && <RatingBars title="Visitors rating" categories={categoryRatings(talk)} />}
    </li>
  )
}

interface ConferenceSectionProps {
  title: string
  talks: ConferenceTalk[]
  defaultOpen?: boolean
}

function ConferenceSection({ title, talks, defaultOpen = true }: ConferenceSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = `confs-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={`events-section${open ? ' events-section--open' : ''}`}>
      <button
        type="button"
        className="events-section__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="events-section__title">
          {title}
          <span className="events-section__count">{talks.length}</span>
        </span>
        <span className="events-section__chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="events-section__body" id={panelId}>
          {talks.length === 0 ? (
            <p className="events-section__empty">No {title.toLowerCase()}.</p>
          ) : (
            <ul className="events-section__list">
              {talks.map((talk) => (
                <TalkRow key={talk.id} talk={talk} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

interface PastStats {
  talks: number
  conferences: number
  avgRating: number | null
  bestRating: number | null
}

function computePastStats(talks: ConferenceTalk[]): PastStats {
  const ratings = talks
    .map((talk) => talk.rating)
    .filter((rating): rating is number => typeof rating === 'number')
  const conferences = new Set(talks.map((talk) => talk.conferenceId)).size
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 100) / 100
    : null
  const bestRating = ratings.length ? Math.max(...ratings) : null
  return { talks: talks.length, conferences, avgRating, bestRating }
}

function PastConferencesDialog({
  talks,
  onClose,
}: {
  talks: ConferenceTalk[]
  onClose: () => void
}) {
  const stats = computePastStats(talks)
  const [tab, setTab] = useState<'events' | 'timeline'>('events')

  return (
    <Dialog
      title="Explore past events & statistics"
      onClose={onClose}
      className="past-dialog"
      width={920}
    >
      <div className="past-dialog__body">
        <ul className="past-stats" aria-label="Statistics">
          <li className="past-stat">
            <span className="past-stat__value">{stats.talks}</span>
            <span className="past-stat__label">Talks given</span>
          </li>
          <li className="past-stat">
            <span className="past-stat__value">{stats.conferences}</span>
            <span className="past-stat__label">Conferences</span>
          </li>
          <li className="past-stat">
            <span className="past-stat__value past-stat__value--avg">
              {stats.avgRating !== null ? stats.avgRating.toFixed(2) : '—'}
            </span>
            <span className="past-stat__label">Avg rating</span>
          </li>
          <li className="past-stat">
            <span className="past-stat__value past-stat__value--best">
              {stats.bestRating !== null ? stats.bestRating.toFixed(2) : '—'}
            </span>
            <span className="past-stat__label">Best rating</span>
          </li>
        </ul>

        <div className="past-tabs" role="tablist" aria-label="View">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'events'}
            className={`past-tab${tab === 'events' ? ' past-tab--active' : ''}`}
            onClick={() => setTab('events')}
          >
            Events
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'timeline'}
            className={`past-tab${tab === 'timeline' ? ' past-tab--active' : ''}`}
            onClick={() => setTab('timeline')}
          >
            Rating timeline
          </button>
        </div>

        {tab === 'events' ? (
          talks.length === 0 ? (
            <p className="events-section__empty">No past conferences.</p>
          ) : (
            <ul className="events-section__list past-dialog__list">
              {talks.map((talk) => (
                <TalkRow key={talk.id} talk={talk} />
              ))}
            </ul>
          )
        ) : (
          <div className="past-dialog__timeline">
            <RatingTimeline talks={talks} />
          </div>
        )}
      </div>
    </Dialog>
  )
}

export function SpeakerConferencesPanel({ conferences }: SpeakerConferencesPanelProps) {
  const [pastOpen, setPastOpen] = useState(false)

  return (
    <aside className="events-panel" aria-label="Conference appearances">
      <button type="button" className="events-explore" onClick={() => setPastOpen(true)}>
        <span className="events-explore__main">
          <span className="events-explore__icon" aria-hidden="true">
            📊
          </span>
          <span className="events-explore__text">
            <span className="events-explore__title">Explore past events &amp; statistics</span>
            <span className="events-explore__sub">{conferences.past.length} past conferences</span>
          </span>
        </span>
        <span className="events-explore__arrow" aria-hidden="true">
          →
        </span>
      </button>

      <ConferenceSection title="Upcoming conferences" talks={conferences.upcoming} />

      {pastOpen && (
        <PastConferencesDialog talks={conferences.past} onClose={() => setPastOpen(false)} />
      )}
    </aside>
  )
}
