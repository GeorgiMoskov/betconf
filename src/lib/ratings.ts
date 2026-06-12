import type { ConferenceTalk } from '../types/speaker'

export const RATING_CATEGORIES = [
  'Expertise',
  'Practical Impact',
  'Clarity & Ease of Understanding',
  'Energy & Engagement',
  'Innovation',
] as const

export interface CategoryRating {
  label: string
  value: number
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Deterministic per-category ratings for a single talk. */
export function categoryRatings(talk: ConferenceTalk): CategoryRating[] {
  const base = typeof talk.rating === 'number' ? talk.rating : 8
  return RATING_CATEGORIES.map((label) => {
    const offset = (hashString(`${talk.id}-${label}`) % 161) / 100 - 0.8
    const value = Math.max(0, Math.min(10, base + offset))
    return { label, value: Math.round(value * 10) / 10 }
  })
}

/** Average per-category ratings across a set of talks. */
export function averageCategoryRatings(talks: ConferenceTalk[]): CategoryRating[] {
  const rated = talks.filter((talk) => typeof talk.rating === 'number')
  if (rated.length === 0) {
    return RATING_CATEGORIES.map((label) => ({ label, value: 0 }))
  }
  const totals = new Map<string, number>()
  for (const talk of rated) {
    for (const { label, value } of categoryRatings(talk)) {
      totals.set(label, (totals.get(label) ?? 0) + value)
    }
  }
  return RATING_CATEGORIES.map((label) => ({
    label,
    value: Math.round(((totals.get(label) ?? 0) / rated.length) * 10) / 10,
  }))
}

/** Mean of a set of category ratings. */
export function overallRating(categories: CategoryRating[]): number | null {
  if (categories.length === 0) return null
  const sum = categories.reduce((total, c) => total + c.value, 0)
  return Math.round((sum / categories.length) * 10) / 10
}

export function overallTier(value: number): string {
  if (value >= 9) return 'Amazing'
  if (value >= 8) return 'Great'
  return 'Good'
}
