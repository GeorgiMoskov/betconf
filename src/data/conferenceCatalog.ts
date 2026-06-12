import type {
  ConferenceEdition,
  ConferenceTalk,
  ReactSummitSpeaker,
  SpeakerConferences,
} from '../types/speaker'
import { getSpeakerById, REACT_SUMMIT_SPEAKERS } from './reactSummitSpeakers'

/**
 * A single coherent catalog of conferences and talks, derived deterministically
 * from the speaker line-up. Building it once at module load means a speaker's
 * history, a conference page, and a talk page all reference the same data: a
 * talk listed on a speaker's profile resolves to a talk page whose speaker is
 * that speaker, and whose conference lists that talk.
 *
 * The real data will eventually come from the conference/CFP systems.
 *
 * IMPORTANT: this module imports from `reactSummitSpeakers.ts`, which must NOT
 * import this module back (avoids a circular import).
 */

interface ConferenceBrand {
  name: string
  location: string
}

/** Pool of well-known JS/React conference brands. */
const CONFERENCES: ConferenceBrand[] = [
  { name: 'React Summit', location: 'Amsterdam, NL' },
  { name: 'React Summit US', location: 'New York, US' },
  { name: 'React Advanced', location: 'London, UK' },
  { name: 'JSNation', location: 'Amsterdam, NL' },
  { name: 'React Day Berlin', location: 'Berlin, DE' },
  { name: 'React Native EU', location: 'Wrocław, PL' },
  { name: 'React Conf', location: 'Las Vegas, US' },
  { name: 'Next.js Conf', location: 'San Francisco, US' },
  { name: 'JSConf EU', location: 'Berlin, DE' },
  { name: 'CityJS', location: 'London, UK' },
  { name: 'React Paris', location: 'Paris, FR' },
  { name: 'React Norway', location: 'Larvik, NO' },
  { name: 'Render ATL', location: 'Atlanta, US' },
  { name: 'epicWeb Conf', location: 'Park City, US' },
]

/** Short editorial blurb per conference brand, used to build descriptions. */
const BRAND_BLURBS: Record<string, string> = {
  'React Summit':
    'The biggest React conference in the world, bringing the core community together for deep dives into the framework and its ecosystem.',
  'React Summit US':
    'The US edition of the flagship React Summit, gathering North America’s React community for two days of talks and hallway track.',
  'React Advanced':
    'An advanced-level gathering for senior engineers pushing React to its limits in production-grade applications.',
  JSNation:
    'A vendor-neutral celebration of everything JavaScript, from the language internals to the tooling that powers the modern web.',
  'React Day Berlin':
    'Berlin’s home for the React community, mixing framework deep dives with the engineering culture of one of Europe’s biggest tech hubs.',
  'React Native EU':
    'Europe’s dedicated React Native event, focused on shipping truly native cross-platform apps from a single codebase.',
  'React Conf':
    'The official React conference, where the team and the community share what’s next for the library and its surrounding tools.',
  'Next.js Conf':
    'The annual gathering of the Next.js community, covering the full-stack React framework from rendering strategies to the edge.',
  'JSConf EU':
    'A legendary, community-run conference exploring the culture and craft of JavaScript beyond any single framework.',
  CityJS:
    'A travelling celebration of the JavaScript community, packing world-class speakers into a single high-energy day.',
  'React Paris':
    'France’s premier React event, blending framework talks with design, performance, and developer-experience themes.',
  'React Norway':
    'A cozy seaside React conference known for its single-track, high-signal program and tight-knit community.',
  'Render ATL':
    'Atlanta’s culture-forward engineering conference, mixing cutting-edge frontend content with a celebration of community.',
  'epicWeb Conf':
    'A focused, full-stack web conference for developers who care about building robust, well-tested products end to end.',
}

/** Pool of talk titles to draw from. */
const TALK_TITLES: string[] = [
  'Rethinking State Management in 2026',
  'Server Components in Production',
  'The Future of React Performance',
  'Building Resilient Design Systems',
  'Edge Rendering at Scale',
  'Type-Safe APIs End to End',
  'Animations That Feel Native',
  'Shipping Accessible UIs by Default',
  'AI-Assisted Frontend Workflows',
  'Streaming UI and Suspense Patterns',
  'Micro-Frontends Without the Pain',
  'From Monolith to Islands Architecture',
  'Testing React the Right Way',
  'Real-Time Apps with WebSockets',
  'Optimizing the Critical Rendering Path',
  'Composable Architecture for Large Teams',
]

/** Editorial description per talk title. */
const TALK_DESCRIPTIONS: Record<string, string> = {
  'Rethinking State Management in 2026':
    'A practical tour of modern state patterns — from signals to server state — and how to pick the right tool without over-engineering your app.',
  'Server Components in Production':
    'Hard-won lessons from shipping React Server Components at scale, covering data fetching, streaming boundaries, and the pitfalls to avoid.',
  'The Future of React Performance':
    'Where React performance is heading: the compiler, automatic memoization, and what it means for the way we write components today.',
  'Building Resilient Design Systems':
    'How to grow a design system that survives redesigns and reorgs, balancing tokens, accessibility, and developer ergonomics.',
  'Edge Rendering at Scale':
    'Running rendering at the edge for millions of users — caching strategies, cold starts, and keeping latency low across regions.',
  'Type-Safe APIs End to End':
    'Eliminating the gap between client and server with end-to-end type safety, from the database schema all the way to the UI.',
  'Animations That Feel Native':
    'Crafting interface motion that feels effortless, using the platform, spring physics, and interruptible gestures.',
  'Shipping Accessible UIs by Default':
    'Baking accessibility into your components and workflow so inclusive UIs become the path of least resistance, not an afterthought.',
  'AI-Assisted Frontend Workflows':
    'How AI tooling is reshaping the day-to-day of frontend work, and where it genuinely speeds you up versus where it gets in the way.',
  'Streaming UI and Suspense Patterns':
    'Designing responsive interfaces with streaming and Suspense, so users see meaningful content as fast as possible.',
  'Micro-Frontends Without the Pain':
    'A pragmatic approach to splitting a large frontend across teams without drowning in build complexity and runtime overhead.',
  'From Monolith to Islands Architecture':
    'Incrementally migrating a heavy SPA to an islands architecture, shipping less JavaScript while keeping the parts that need interactivity.',
  'Testing React the Right Way':
    'A confident testing strategy for React apps — what to test, what to skip, and how to keep your suite fast and trustworthy.',
  'Real-Time Apps with WebSockets':
    'Building collaborative, real-time experiences with WebSockets, covering reconnection, presence, and conflict resolution.',
  'Optimizing the Critical Rendering Path':
    'Squeezing first-paint and interactivity metrics by mastering the critical rendering path, from the network to the main thread.',
  'Composable Architecture for Large Teams':
    'Patterns for keeping a large codebase composable and maintainable as more teams contribute to the same product.',
}

/** Talk start-time slots throughout a conference day. */
const TALK_TIMES: string[] = [
  '09:30',
  '10:15',
  '11:00',
  '11:45',
  '13:30',
  '14:15',
  '15:00',
  '15:45',
  '16:30',
]

/** Extra tech-stack pills mixed in with the speaker's own tags. */
const EXTRA_STACK: string[] = [
  'TypeScript',
  'Vite',
  'Node.js',
  'GraphQL',
  'Tailwind',
  'Vitest',
  'Playwright',
  'Zustand',
  'tRPC',
  'Webpack',
]

function seed(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Build a URL-safe slug fragment. */
function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function pick<T>(items: T[], n: number): T {
  return items[Math.abs(n) % items.length]
}

/** Deterministically build the tech stack for one talk. */
function stackFor(speaker: ReactSummitSpeaker, n: number): string[] {
  const base = speaker.tags.slice(0, 2)
  const extra = pick(EXTRA_STACK, n)
  return [...new Set([...base, extra])].slice(0, 3)
}

const CURRENT_YEAR = 2026

/** A speaker is "top-rated" once they reach the Legendary tier. */
const TOP_RATED_MIN = 9.5

/** Map a count of top-rated attendees to a hype level (0 → none). */
function hypeFor(topRatedCount: number): ConferenceEdition['hype'] {
  if (topRatedCount >= 4) return 'exceptional'
  if (topRatedCount >= 2) return 'great'
  if (topRatedCount >= 1) return 'good'
  return undefined
}

const talksById = new Map<string, ConferenceTalk>()
const editionsById = new Map<string, ConferenceEdition>()
const talkIdsByEdition = new Map<string, string[]>()
const conferencesBySpeaker = new Map<string, SpeakerConferences>()

/** Lazily create (or fetch) the conference edition a talk belongs to. */
function ensureEdition(brand: ConferenceBrand, year: number): ConferenceEdition {
  const id = `${slug(brand.name)}-${year}`
  const existing = editionsById.get(id)
  if (existing) {
    return existing
  }

  // All talks of an edition share a coherent start month, derived from the id.
  const editionSeed = seed(id)
  const month = 1 + (editionSeed % 12)
  const day = 4 + (editionSeed % 22)
  const startDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const edition: ConferenceEdition = {
    id,
    brand: brand.name,
    name: `${brand.name} ${year}`,
    description: BRAND_BLURBS[brand.name] ?? `A gathering of the ${brand.name} community.`,
    location: brand.location,
    year,
    startDate,
    rating: undefined,
    technologies: [],
    upcoming: year >= CURRENT_YEAR,
  }
  editionsById.set(id, edition)
  talkIdsByEdition.set(id, [])
  return edition
}

/** Build one talk for a speaker at a given conference edition. */
function buildTalk(
  speaker: ReactSummitSpeaker,
  edition: ConferenceEdition,
  index: number,
  upcoming: boolean,
): ConferenceTalk {
  const talkSeed = seed(`${speaker.id}-talk-${edition.id}-${index}`)
  const ratingSeed = seed(`${speaker.id}-rating-${edition.id}-${index}`)
  const title = pick(TALK_TITLES, talkSeed)
  // Day within the edition's month, varying per speaker.
  const day = 4 + (talkSeed % 22)
  const date = `${edition.year}-${edition.startDate.slice(5, 7)}-${String(day).padStart(2, '0')}`
  const time = pick(TALK_TIMES, talkSeed)
  const tags = stackFor(speaker, talkSeed)

  return {
    id: `${slug(title)}-${edition.id}-${speaker.id}`,
    conferenceId: edition.id,
    conferenceName: edition.name,
    speakerId: speaker.id,
    title,
    description: TALK_DESCRIPTIONS[title] ?? `A deep dive into ${title.toLowerCase()}.`,
    date,
    time,
    location: edition.location,
    tags,
    rating: upcoming ? undefined : Math.round((7.6 + (ratingSeed % 240) / 100) * 100) / 100,
    upcoming,
  }
}

/** Register a talk into the catalog, wiring it to its edition. */
function registerTalk(talk: ConferenceTalk): void {
  talksById.set(talk.id, talk)
  const ids = talkIdsByEdition.get(talk.conferenceId)
  if (ids) {
    ids.push(talk.id)
  }
  const edition = editionsById.get(talk.conferenceId)
  if (edition) {
    edition.technologies = [...new Set([...edition.technologies, ...talk.tags])]
  }
}

// --- Build the catalog once, iterating the ranked speaker line-up. ---
for (const speaker of REACT_SUMMIT_SPEAKERS) {
  const base = seed(speaker.id)
  const upcomingCount = 2 + (base % 3) // 2–4 upcoming
  const pastCount = 4 + (base % 5) // 4–8 past
  // One talk per (speaker, edition).
  const usedEditions = new Set<string>()

  const upcoming: ConferenceTalk[] = []
  for (let i = 0; i < upcomingCount; i += 1) {
    const brand = pick(CONFERENCES, seed(`${speaker.id}-up-conf-${i}`))
    const year = CURRENT_YEAR + (i % 2) // 2026 / 2027
    const edition = ensureEdition(brand, year)
    if (usedEditions.has(edition.id)) {
      continue
    }
    usedEditions.add(edition.id)
    const talk = buildTalk(speaker, edition, i, true)
    registerTalk(talk)
    upcoming.push(talk)
  }

  const past: ConferenceTalk[] = []
  for (let i = 0; i < pastCount; i += 1) {
    const brand = pick(CONFERENCES, seed(`${speaker.id}-past-conf-${i}`))
    const year = 2025 - ((base + i) % 4) // 2022–2025
    const edition = ensureEdition(brand, year)
    if (usedEditions.has(edition.id)) {
      continue
    }
    usedEditions.add(edition.id)
    const talk = buildTalk(speaker, edition, 100 + i, false)
    registerTalk(talk)
    past.push(talk)
  }

  upcoming.sort((a, b) => a.date.localeCompare(b.date))
  past.sort((a, b) => b.date.localeCompare(a.date))
  conferencesBySpeaker.set(speaker.id, { upcoming, past })
}

// Finalize edition ratings = average of their past talk ratings.
for (const edition of editionsById.values()) {
  const ids = talkIdsByEdition.get(edition.id) ?? []
  const ratings = ids
    .map((id) => talksById.get(id)?.rating)
    .filter((r): r is number => typeof r === 'number')
  if (ratings.length > 0) {
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    edition.rating = Math.round(avg * 100) / 100
  }

  // Hype = how many distinct top-rated speakers attend this edition.
  const speakerIds = new Set(
    ids.map((id) => talksById.get(id)?.speakerId).filter((sid): sid is string => Boolean(sid)),
  )
  let topRated = 0
  for (const sid of speakerIds) {
    const speaker = getSpeakerById(sid)
    if (speaker && speaker.rating >= TOP_RATED_MIN) {
      topRated += 1
    }
  }
  edition.hype = hypeFor(topRated)

  // Enrich the brand blurb with an edition-specific sentence.
  const topTech = edition.technologies.slice(0, 3)
  const techPhrase =
    topTech.length >= 2
      ? `${topTech.slice(0, -1).join(', ')} and ${topTech[topTech.length - 1]}`
      : topTech[0]
  const hypeSentence =
    edition.hype === 'exceptional'
      ? edition.upcoming
        ? ' Expect an exceptional line-up of the industry’s most highly-rated speakers.'
        : ' It drew an exceptional line-up of the industry’s most highly-rated speakers.'
      : edition.hype === 'great'
        ? edition.upcoming
          ? ' Several top-rated speakers are on the bill this year.'
          : ' Several top-rated speakers shared the stage that year.'
        : ''
  if (techPhrase) {
    const when = edition.upcoming ? 'will explore' : 'explored'
    edition.description += ` The ${edition.year} edition in ${edition.location} ${when} ${techPhrase}.${hypeSentence}`
  }

  // Propagate the hype level down to each of the edition's talks.
  for (const id of ids) {
    const talk = talksById.get(id)
    if (talk) {
      talk.hype = edition.hype
    }
  }
}

/** A speaker's upcoming + past conference appearances. */
export function getSpeakerConferences(speakerId: string): SpeakerConferences {
  return conferencesBySpeaker.get(speakerId) ?? { upcoming: [], past: [] }
}

export interface ConferenceDetail {
  edition: ConferenceEdition
  talks: ConferenceTalk[]
  speakers: ReactSummitSpeaker[]
}

/** Resolve a conference edition with its talks and distinct speakers. */
export function getConferenceById(id: string): ConferenceDetail | undefined {
  const edition = editionsById.get(id)
  if (!edition) {
    return undefined
  }
  const talks = (talkIdsByEdition.get(id) ?? [])
    .map((talkId) => talksById.get(talkId))
    .filter((talk): talk is ConferenceTalk => Boolean(talk))
    .sort((a, b) => a.date.localeCompare(b.date))

  const speakers: ReactSummitSpeaker[] = []
  const seen = new Set<string>()
  for (const talk of talks) {
    if (seen.has(talk.speakerId)) {
      continue
    }
    seen.add(talk.speakerId)
    const speaker = getSpeakerById(talk.speakerId)
    if (speaker) {
      speakers.push(speaker)
    }
  }

  return { edition, talks, speakers }
}

/** Every conference edition in the catalog, resolved with its talks and speakers. */
export function getAllConferences(): ConferenceDetail[] {
  const details: ConferenceDetail[] = []
  for (const id of editionsById.keys()) {
    const detail = getConferenceById(id)
    if (detail) {
      details.push(detail)
    }
  }
  return details
}

export interface TalkDetail {
  talk: ConferenceTalk
  edition: ConferenceEdition
  speaker: ReactSummitSpeaker | undefined
}

/** Resolve a talk with its conference edition and host speaker. */
export function getTalkById(id: string): TalkDetail | undefined {
  const talk = talksById.get(id)
  if (!talk) {
    return undefined
  }
  const edition = editionsById.get(talk.conferenceId)
  if (!edition) {
    return undefined
  }
  return { talk, edition, speaker: getSpeakerById(talk.speakerId) }
}
