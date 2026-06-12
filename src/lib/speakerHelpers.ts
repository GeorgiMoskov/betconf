import type { SocialType } from '../types/speaker'
import type { AchievementId, ConferenceHype } from '../types/speaker'

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

/** Short label shown for each social link type. */
export const SOCIAL_LABELS: Record<SocialType, string> = {
  github: 'GitHub',
  twitter: 'X',
  bluesky: 'Bluesky',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  website: 'Website',
  gitnation: 'GitNation',
}

/** How an achievement badge is presented. `kind` drives its colour treatment. */
export interface AchievementMeta {
  /** Full label, used in tooltips / dialog. */
  label: string
  /** Compact label shown on the badge itself. */
  short: string
  /** Visual family: an award medal or a milestone tier. */
  kind: 'award' | 'milestone'
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementMeta> = {
  'best-speaker-2025': { label: 'Best Speaker 2025', short: 'Best ’25', kind: 'award' },
  'best-speaker-2024': { label: 'Best Speaker 2024', short: 'Best ’24', kind: 'award' },
  'best-speaker-2023': { label: 'Best Speaker 2023', short: 'Best ’23', kind: 'award' },
  'conferences-10': { label: '10+ Conferences', short: '10+', kind: 'milestone' },
  'conferences-50': { label: '50+ Conferences', short: '50+', kind: 'milestone' },
  'conferences-100': { label: '100+ Conferences', short: '100+', kind: 'milestone' },
}

/** Qualitative label + tone for a rating, used by the rating UI. */
export function ratingTier(rating: number): { label: string; tone: 'elite' | 'great' | 'good' } {
  if (rating >= 9.5) return { label: 'Legendary', tone: 'elite' }
  if (rating >= 9.0) return { label: 'Outstanding', tone: 'great' }
  return { label: 'Excellent', tone: 'good' }
}

/**
 * Weighted achievement score for sorting. Awards count more than milestones,
 * and higher conference tiers count more than lower ones.
 */
export function achievementScore(achievements: AchievementId[]): number {
  const weights: Record<AchievementId, number> = {
    'best-speaker-2025': 100,
    'best-speaker-2024': 90,
    'best-speaker-2023': 80,
    'conferences-100': 30,
    'conferences-50': 20,
    'conferences-10': 10,
  }
  return achievements.reduce((total, id) => total + weights[id], 0)
}

/** How a hype level is presented: fire-emoji count, label and tooltip. */
export interface HypeMeta {
  /** Number of fire emojis to render. */
  fires: number
  /** Short word shown on the badge. */
  label: string
  /** Tooltip explaining what the level means. */
  tooltip: string
}

export const HYPE_META: Record<ConferenceHype, HypeMeta> = {
  good: {
    fires: 1,
    label: 'Good',
    tooltip: 'Some top-rated speakers are attending this conference',
  },
  great: {
    fires: 2,
    label: 'Great',
    tooltip: 'Multiple top-rated speakers are attending this conference',
  },
  exceptional: {
    fires: 3,
    label: 'Exceptional',
    tooltip: 'A lot of top-rated speakers are attending this conference',
  },
}


