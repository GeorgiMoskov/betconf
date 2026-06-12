import { useMemo, useState } from 'react'
import type { SpeakerConferences } from '../types/speaker'
import {
  buildEarningsLog,
  groupEarningsByMonth,
  cumulativeEarnings,
  EARNING_META,
} from '../lib/earnings'
import type { EarningType } from '../lib/earnings'
import { EarningsTimeline } from './EarningsTimeline'

interface EarningsLogProps {
  speakerId: string
  conferences: SpeakerConferences
  /** Total ranking points the log should add up to. */
  totalPoints: number
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
})

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

/** Visual tone applied per earning type (drives accent colour). */
const TYPE_TONE: Record<EarningType, string> = {
  'open-source': 'os',
  'conference-talk': 'talk',
  'rating-8': 'rating',
  'rating-9': 'rating',
  'rating-10': 'top',
  recognition: 'top',
  book: 'book',
  article: 'article',
}

type FilterKey = 'all' | 'talk' | 'rating' | 'os' | 'article' | 'book' | 'recognition'

/** Maps each earning type to a coarse, user-facing filter category. */
const FILTER_FOR: Record<EarningType, Exclude<FilterKey, 'all'>> = {
  'conference-talk': 'talk',
  'rating-8': 'rating',
  'rating-9': 'rating',
  'rating-10': 'rating',
  'open-source': 'os',
  article: 'article',
  book: 'book',
  recognition: 'recognition',
}

const FILTER_LABELS: Record<Exclude<FilterKey, 'all'>, string> = {
  talk: 'Talks',
  rating: 'Ratings',
  os: 'Open source',
  article: 'Articles',
  book: 'Books',
  recognition: 'Recognition',
}

/** Order filter chips appear in. */
const FILTER_ORDER: Exclude<FilterKey, 'all'>[] = [
  'talk',
  'rating',
  'os',
  'article',
  'book',
  'recognition',
]

export function EarningsLog({ speakerId, conferences, totalPoints }: EarningsLogProps) {
  const [view, setView] = useState<'list' | 'timeline'>('list')
  const [filter, setFilter] = useState<FilterKey>('all')

  const events = useMemo(
    () => buildEarningsLog(speakerId, conferences, totalPoints),
    [speakerId, conferences, totalPoints],
  )

  const counts = useMemo(() => {
    const map = new Map<FilterKey, number>()
    for (const event of events) {
      const key = FILTER_FOR[event.type]
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return map
  }, [events])

  const visibleEvents = useMemo(
    () => (filter === 'all' ? events : events.filter((event) => FILTER_FOR[event.type] === filter)),
    [events, filter],
  )

  const groups = useMemo(() => groupEarningsByMonth(visibleEvents), [visibleEvents])
  const cumulative = useMemo(() => cumulativeEarnings(events), [events])

  if (events.length === 0) {
    return null
  }

  const activeFilters = FILTER_ORDER.filter((key) => (counts.get(key) ?? 0) > 0)

  return (
    <article className="speaker-profile__panel earnings-log">
      <div className="earnings-log__header">
        <div className="earnings-log__heading">
          <h2 className="speaker-profile__panel-title">Earnings log</h2>
          <span className="earnings-log__count">{events.length} events</span>
        </div>
        <span className="earnings-log__total">
          <span className="earnings-log__total-value">
            {totalPoints.toLocaleString('en-US')}
          </span>
          <span className="earnings-log__total-label">pts</span>
        </span>
      </div>

      <div className="earnings-log__views" role="tablist" aria-label="Earnings view">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'list'}
          className={`earnings-view${view === 'list' ? ' earnings-view--active' : ''}`}
          onClick={() => setView('list')}
        >
          List
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'timeline'}
          className={`earnings-view${view === 'timeline' ? ' earnings-view--active' : ''}`}
          onClick={() => setView('timeline')}
        >
          Points timeline
        </button>
      </div>

      {view === 'timeline' ? (
        <div className="earnings-log__chart">
          <EarningsTimeline points={cumulative} />
        </div>
      ) : (
        <>
          <div className="earnings-log__filters" role="group" aria-label="Filter by event type">
            <button
              type="button"
              className={`earnings-chip${filter === 'all' ? ' earnings-chip--active' : ''}`}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
              <span className="earnings-chip__count">{events.length}</span>
            </button>
            {activeFilters.map((key) => (
              <button
                key={key}
                type="button"
                className={`earnings-chip${filter === key ? ' earnings-chip--active' : ''}`}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {FILTER_LABELS[key]}
                <span className="earnings-chip__count">{counts.get(key)}</span>
              </button>
            ))}
          </div>

          <div className="earnings-log__viewport">
            <div className="earnings-log__scroll">
              {groups.length === 0 ? (
                <p className="earnings-log__empty">No matching events.</p>
              ) : (
                groups.map((group) => (
                  <section key={group.key} className="earnings-group">
                    <header className="earnings-group__header">
                      <span className="earnings-group__month">{group.label}</span>
                      <span className="earnings-group__points">
                        +{group.points.toLocaleString('en-US')}
                      </span>
                    </header>
                    <ul className="earnings-log__list">
                      {group.events.map((event) => (
                        <li
                          key={event.id}
                          className={`earnings-row earnings-row--${TYPE_TONE[event.type]}`}
                        >
                          <span className="earnings-row__icon" aria-hidden="true">
                            {EARNING_META[event.type].icon}
                          </span>
                          <span className="earnings-row__body">
                            <span className="earnings-row__label">{event.label}</span>
                            {event.detail && (
                              <span className="earnings-row__detail">{event.detail}</span>
                            )}
                          </span>
                          <span className="earnings-row__date">{formatDate(event.date)}</span>
                          <span className="earnings-row__points">
                            +{event.points.toLocaleString('en-US')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </article>
  )
}
