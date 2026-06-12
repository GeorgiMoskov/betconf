import type { SpeakerConferences } from '../types/speaker'
import { categoryRatings, overallRating } from './ratings'

export type EarningType =
  | 'open-source'
  | 'conference-talk'
  | 'rating-8'
  | 'rating-9'
  | 'rating-10'
  | 'recognition'
  | 'book'
  | 'article'

export interface EarningEvent {
  id: string
  /** ISO date (YYYY-MM-DD). */
  date: string
  type: EarningType
  /** Headline shown on the row. */
  label: string
  /** Optional secondary detail (conference name, company, etc.). */
  detail?: string
  points: number
}

interface EarningMeta {
  label: string
  icon: string
  points: number
}

export const EARNING_META: Record<EarningType, EarningMeta> = {
  'open-source': { label: 'Open source contribution', icon: '⌥', points: 40 },
  'conference-talk': { label: 'Spoke at a conference', icon: '🎤', points: 60 },
  'rating-8': { label: 'Rated above 8.0', icon: '⭐', points: 30 },
  'rating-9': { label: 'Rated above 9.0', icon: '🌟', points: 60 },
  'rating-10': { label: 'Perfect 10.00 rating', icon: '🏆', points: 120 },
  recognition: { label: 'Special recognition', icon: '🎖️', points: 90 },
  book: { label: 'Released a book', icon: '📘', points: 150 },
  article: { label: 'Published an article', icon: '✍️', points: 25 },
}

const RECOGNITION_COMPANIES = ['Meta', 'Vercel', 'Google', 'Uber', 'Amazon', 'Netflix', 'Stripe']

const OPEN_SOURCE_PROJECTS = [
  'React',
  'Next.js',
  'TanStack Query',
  'Vite',
  'Remix',
  'TypeScript',
  'Zustand',
]

const ARTICLE_TOPICS = [
  'Server Components in depth',
  'Mastering Suspense',
  'Type-safe data fetching',
  'Scaling design systems',
  'The future of bundlers',
  'Edge rendering patterns',
]

const BOOK_TITLES = [
  'Patterns of Modern React',
  'Production-Grade Frontend',
  'The Pragmatic Component',
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length]
}

/** Build a deterministic, date-sorted earnings log for a speaker. */
export function buildEarningsLog(
  speakerId: string,
  conferences: SpeakerConferences,
  targetPoints?: number,
): EarningEvent[] {
  const events: EarningEvent[] = []

  // Conference + rating derived events (anchored to real past talks).
  for (const talk of conferences.past) {
    events.push({
      id: `talk-${talk.id}`,
      date: talk.date,
      type: 'conference-talk',
      label: EARNING_META['conference-talk'].label,
      detail: talk.conferenceName,
      points: EARNING_META['conference-talk'].points,
    })

    if (typeof talk.rating !== 'number') continue
    const overall = overallRating(categoryRatings(talk))
    if (overall === null) continue

    let ratingType: EarningType | null = null
    if (overall >= 10) ratingType = 'rating-10'
    else if (overall >= 9) ratingType = 'rating-9'
    else if (overall >= 8) ratingType = 'rating-8'

    if (ratingType) {
      events.push({
        id: `rating-${talk.id}`,
        date: talk.date,
        type: ratingType,
        label: EARNING_META[ratingType].label,
        detail: `${talk.conferenceName} · ${overall.toFixed(2)} / 10`,
        points: EARNING_META[ratingType].points,
      })
    }
  }

  // Synthetic milestones, deterministically seeded from the speaker id.
  const seed = hashString(speakerId)

  const openSourceCount = 2 + (seed % 2) // 2–3
  for (let i = 0; i < openSourceCount; i += 1) {
    const s = hashString(`${speakerId}-os-${i}`)
    const project = pick(OPEN_SOURCE_PROJECTS, s)
    events.push({
      id: `os-${i}`,
      date: synthDate(s),
      type: 'open-source',
      label: EARNING_META['open-source'].label,
      detail: `${project} core`,
      points: EARNING_META['open-source'].points,
    })
  }

  const articleCount = 2 + (seed % 3) // 2–4
  for (let i = 0; i < articleCount; i += 1) {
    const s = hashString(`${speakerId}-article-${i}`)
    events.push({
      id: `article-${i}`,
      date: synthDate(s),
      type: 'article',
      label: EARNING_META.article.label,
      detail: pick(ARTICLE_TOPICS, s),
      points: EARNING_META.article.points,
    })
  }

  const recognitionCount = seed % 3 // 0–2
  for (let i = 0; i < recognitionCount; i += 1) {
    const s = hashString(`${speakerId}-rec-${i}`)
    events.push({
      id: `rec-${i}`,
      date: synthDate(s),
      type: 'recognition',
      label: EARNING_META.recognition.label,
      detail: `by ${pick(RECOGNITION_COMPANIES, s)}`,
      points: EARNING_META.recognition.points,
    })
  }

  if (seed % 3 === 0) {
    const s = hashString(`${speakerId}-book`)
    events.push({
      id: 'book-0',
      date: synthDate(s),
      type: 'book',
      label: EARNING_META.book.label,
      detail: `“${pick(BOOK_TITLES, s)}”`,
      points: EARNING_META.book.points,
    })
  }

  events.sort((a, b) => b.date.localeCompare(a.date))

  // Scale the points so the log sums exactly to the speaker's ranking points.
  if (typeof targetPoints === 'number' && events.length > 0) {
    const rawTotal = events.reduce((sum, event) => sum + event.points, 0)
    if (rawTotal > 0) {
      const factor = targetPoints / rawTotal
      let allocated = 0
      for (const event of events) {
        event.points = Math.max(5, Math.round(event.points * factor))
        allocated += event.points
      }
      // Absorb the rounding remainder into the largest earning.
      const diff = targetPoints - allocated
      if (diff !== 0) {
        const idx = events.reduce(
          (best, event, i, arr) => (event.points > arr[best].points ? i : best),
          0,
        )
        events[idx].points = Math.max(5, events[idx].points + diff)
      }
    }
  }

  return events
}

export interface EarningGroup {
  /** Stable key, e.g. "2025-11". */
  key: string
  /** Display label, e.g. "November 2025". */
  label: string
  events: EarningEvent[]
  /** Points earned within this month. */
  points: number
}

const groupFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

/** Group date-sorted earnings into month/year buckets (preserving order). */
export function groupEarningsByMonth(events: EarningEvent[]): EarningGroup[] {
  const groups: EarningGroup[] = []
  const index = new Map<string, EarningGroup>()

  for (const event of events) {
    const [year, month, day] = event.date.split('-').map(Number)
    const key = `${year}-${String(month).padStart(2, '0')}`
    let group = index.get(key)
    if (!group) {
      group = {
        key,
        label: groupFormatter.format(new Date(year, month - 1, day)),
        events: [],
        points: 0,
      }
      index.set(key, group)
      groups.push(group)
    }
    group.events.push(event)
    group.points += event.points
  }

  return groups
}

export interface CumulativePoint {
  /** Stable key, e.g. "2025-11". */
  key: string
  /** Short display label, e.g. "Nov 2025". */
  label: string
  /** ISO date for the last day of the bucket month. */
  date: string
  /** Running total of points up to and including this month. */
  total: number
  /** Points gained within this month. */
  gained: number
}

const pointFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })

/**
 * Cumulative point totals per month, oldest → newest, for charting how a
 * speaker's points grew over time.
 */
export function cumulativeEarnings(events: EarningEvent[]): CumulativePoint[] {
  const monthly = new Map<string, number>()
  for (const event of events) {
    const [year, month] = event.date.split('-')
    const key = `${year}-${month}`
    monthly.set(key, (monthly.get(key) ?? 0) + event.points)
  }

  const keys = [...monthly.keys()].sort()
  let running = 0
  return keys.map((key) => {
    const gained = monthly.get(key) ?? 0
    running += gained
    const [year, month] = key.split('-').map(Number)
    return {
      key,
      label: pointFormatter.format(new Date(year, month - 1, 1)),
      date: `${key}-01`,
      total: running,
      gained,
    }
  })
}

/** Deterministic ISO date spread across 2023-01 .. 2025-12. */
function synthDate(seed: number): string {
  const year = 2023 + (seed % 3)
  const month = (Math.floor(seed / 3) % 12) + 1
  const day = (Math.floor(seed / 36) % 28) + 1
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
