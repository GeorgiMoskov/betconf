import type { CalendarEvent } from '../store/accountStore'
import type { UserReview } from '../types/review'
import type { ConferenceTalk } from '../types/speaker'
import { categoryRatings } from '../lib/ratings'
import { getAllConferences } from './conferenceCatalog'

/**
 * Seed data so a fresh visitor lands on a populated account: a few registered
 * conferences (past and upcoming), some favourites, a handful of attended talks
 * on the calendar and a couple of reviews. This also gives them a starting pool
 * of FireRaven coins to spend in the merch store.
 *
 * Built deterministically from the live catalog so every id resolves correctly.
 */
export interface AccountDefaults {
  favourites: string[]
  registered: string[]
  calendar: CalendarEvent[]
  reviews: UserReview[]
  /** Just the events pinned to "today" (subset of `calendar`). */
  todayEvents: CalendarEvent[]
  /** Just the attended past-conference events (subset of `calendar`). */
  pastEvents: CalendarEvent[]
}

/** Short, upbeat review comments cycled across the seeded reviews. */
const REVIEW_COMMENTS = [
  'Easily the highlight of the day — practical and inspiring.',
  'Clear, well-paced and packed with takeaways I used the next week.',
  'Great energy on stage and the demos actually worked. Loved it.',
  'Deep technical content without losing the room. Brilliant.',
  'Walked away with a whole new mental model. Highly recommend.',
]

/** Turn a past talk into a stored user review with realistic scores. */
function reviewFromTalk(talk: ConferenceTalk, index: number): UserReview {
  const scores = Object.fromEntries(
    categoryRatings(talk).map(({ label, value }) => [label, value]),
  )
  return {
    talkId: talk.id,
    conferenceId: talk.conferenceId,
    speakerId: talk.speakerId,
    date: talk.date,
    scores,
    comment: REVIEW_COMMENTS[index % REVIEW_COMMENTS.length],
  }
}

/** Turn a talk into a calendar entry (an attended event). */
function calendarFromTalk(talk: ConferenceTalk, overrides?: Partial<CalendarEvent>): CalendarEvent {
  return {
    talkId: talk.id,
    conferenceId: talk.conferenceId,
    conferenceName: talk.conferenceName,
    title: talk.title,
    date: talk.date,
    time: talk.time,
    location: talk.location,
    speakerId: talk.speakerId,
    ...overrides,
  }
}

/** Local YYYY-MM-DD key for a date (matches the catalog's ISO date strings). */
function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Start times for the talks scheduled on "today". */
const TODAY_TIMES = ['09:30', '11:00', '13:30', '15:45']

/** Build the default account state from the conference catalog. */
export function buildAccountDefaults(): AccountDefaults {
  const all = [...getAllConferences()].sort((a, b) =>
    a.edition.id.localeCompare(b.edition.id),
  )
  const past = all.filter((detail) => !detail.edition.upcoming)
  const upcoming = all.filter((detail) => detail.edition.upcoming)

  // Registered: a mix of conferences already attended and ones still ahead.
  const registeredPast = past.slice(0, 3)
  const registeredUpcoming = upcoming.slice(0, 3)
  const registered = [...registeredPast, ...registeredUpcoming].map(
    (detail) => detail.edition.id,
  )

  // Favourites: a few upcoming editions the visitor is eyeing.
  const favourites = upcoming.slice(3, 7).map((detail) => detail.edition.id)

  // A handful of talks scheduled for "today", so the calendar lands on a day
  // with a real agenda. Built from upcoming talks (real ids → working links)
  // but pinned to today's date with staggered start times.
  const todayKey = dateKey(new Date())
  const seenTitles = new Set<string>()
  const upcomingTalks = registeredUpcoming
    .flatMap((detail) => detail.talks.filter((talk) => talk.upcoming))
    .filter((talk) => {
      if (seenTitles.has(talk.title)) {
        return false
      }
      seenTitles.add(talk.title)
      return true
    })
  const todayEvents = upcomingTalks
    .slice(0, TODAY_TIMES.length)
    .map((talk, index) =>
      calendarFromTalk(talk, { date: todayKey, time: TODAY_TIMES[index] }),
    )

  // Calendar: today's agenda plus talks attended at past conferences.
  const pastTalks = registeredPast.flatMap((detail) =>
    detail.talks.filter((talk) => !talk.upcoming),
  )
  const pastEvents = pastTalks.slice(0, 8).map((talk) => calendarFromTalk(talk))
  const calendar = [...todayEvents, ...pastEvents]

  // Reviews: a handful left on those attended talks.
  const reviews = pastTalks.slice(0, 5).map(reviewFromTalk)

  return { favourites, registered, calendar, reviews, todayEvents, pastEvents }
}
