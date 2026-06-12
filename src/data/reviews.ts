import type { ConferenceTalk } from '../types/speaker'
import type { CategoryScores, Review } from '../types/review'
import { RATING_CATEGORIES } from '../lib/ratings'

/** Plausible attendee names used to attribute the seeded community reviews. */
const AUTHORS: string[] = [
  'Mara Jensen',
  'Diego Ferraro',
  'Priya Nair',
  'Tomás Oliveira',
  'Hannah Kessler',
  'Wei Lin',
  'Olu Adebayo',
  'Sofia Marchetti',
  'Lucas Bauer',
  'Aisha Rahman',
  'Niklas Berg',
  'Camille Dubois',
  'Ravi Menon',
  'Greta Sandberg',
  'Marco Bianchi',
  'Yuki Tanaka',
  'Elena Popova',
  'Daniel Okafor',
  'Ingrid Holm',
  'Pablo Reyes',
  'Sara Lindqvist',
  'Arjun Kapoor',
  'Noah Whitfield',
  'Lina Haddad',
]

/** Glowing comments for the highest-scoring reviews. */
const COMMENTS_GLOWING: string[] = [
  'Easily the highlight of the conference. The live demos were flawless and the pacing kept the whole room engaged from start to finish.',
  'A masterclass. The speaker took a genuinely hard topic and made it feel obvious — I left with three things I could apply on Monday.',
  'Exceptional delivery and depth. You can tell this came from real production scars, not just theory. The Q&A alone was worth the ticket.',
  'One of the best talks I have seen in years. Clear narrative, gorgeous slides, and not a single wasted minute.',
  'Brilliant. The balance of high-level intuition and concrete code examples was perfect for a mixed-experience audience.',
  'I came in skeptical and left a convert. The before/after benchmarks made the case impossible to argue with.',
]

/** Solid, broadly positive comments. */
const COMMENTS_SOLID: string[] = [
  'Really strong session with practical takeaways. A couple of the middle sections ran long, but the core ideas landed well.',
  'Great content and a confident speaker. Would have loved a bit more time on the edge cases, but no complaints overall.',
  'Clear and well-structured. The examples were relatable and the slides were easy to follow even from the back of the room.',
  'Solid talk that respected the audience\u2019s time. Picked up a few patterns I had not considered before.',
  'Engaging and well-researched. The opening story hooked me and the takeaways were genuinely useful.',
  'Good mix of theory and practice. The demo had a small hiccup but the speaker recovered gracefully.',
]

/** Constructive comments for the lower-scoring reviews. */
const COMMENTS_CONSTRUCTIVE: string[] = [
  'Interesting ideas, but it tried to cover too much. I would have preferred fewer topics explored in more depth.',
  'Good fundamentals, though the pace felt rushed near the end and the final demo was hard to follow.',
  'Useful for beginners, but as a senior engineer I was hoping for more advanced material and trade-off discussion.',
  'The content was solid; the delivery could be tightened. A clearer through-line would have helped it land harder.',
  'Decent overview, but several claims could have used real benchmarks to back them up.',
]

function hash(value: string): number {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0
  }
  return h
}

function pick<T>(items: T[], n: number): T {
  return items[Math.abs(n) % items.length]
}

/** Add `days` to an ISO date string (YYYY-MM-DD). */
function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + days)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(10, Math.round(value)))
}

/**
 * Deterministically generate seeded community reviews for a past talk. The
 * per-category scores are centred on the talk's baseline rating with small
 * symmetric variation, so the aggregate mean stays close to that baseline.
 * Returns an empty list for upcoming or unrated talks. Results are memoised
 * per talk id so repeated calls (e.g. across grid cards) stay cheap.
 */
const cache = new Map<string, Review[]>()

export function generateDummyReviews(talk: ConferenceTalk): Review[] {
  if (talk.upcoming || typeof talk.rating !== 'number') {
    return []
  }
  const cached = cache.get(talk.id)
  if (cached) {
    return cached
  }
  const baseline = talk.rating
  const root = hash(talk.id)
  const count = 3 + (root % 4) // 3–6 reviews

  const reviews: Review[] = []
  for (let i = 0; i < count; i += 1) {
    const rSeed = hash(`${talk.id}-review-${i}`)
    // Symmetric per-review offset in roughly [-0.7, +0.7] so the mean ≈ baseline.
    const reviewOffset = ((rSeed % 15) / 10 - 0.7)
    const target = baseline + reviewOffset

    const scores: CategoryScores = {}
    for (const category of RATING_CATEGORIES) {
      const cSeed = hash(`${talk.id}-${i}-${category}`)
      const catOffset = (cSeed % 13) / 10 - 0.6 // [-0.6, +0.6]
      scores[category] = clampScore(target + catOffset)
    }

    const overall =
      RATING_CATEGORIES.reduce((sum, c) => sum + scores[c], 0) / RATING_CATEGORIES.length

    // Choose a comment pool by sentiment; ~70% of reviews carry a comment.
    let comment: string | undefined
    const hasComment = rSeed % 10 < 7
    if (hasComment) {
      const pool =
        overall >= 8.5
          ? COMMENTS_GLOWING
          : overall >= 7
            ? COMMENTS_SOLID
            : COMMENTS_CONSTRUCTIVE
      comment = pick(pool, hash(`${talk.id}-comment-${i}`))
    }

    reviews.push({
      id: `${talk.id}-dummy-${i}`,
      author: pick(AUTHORS, hash(`${talk.id}-author-${i}`)),
      date: addDays(talk.date, 1 + (rSeed % 14)),
      scores,
      comment,
    })
  }

  // Most recent first.
  reviews.sort((a, b) => b.date.localeCompare(a.date))
  cache.set(talk.id, reviews)
  return reviews
}
