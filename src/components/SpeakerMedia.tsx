import { useId, useState } from 'react'
import type { AchievementId, SpeakerSocial } from '../types/speaker'
import { ACHIEVEMENTS, getInitials, ratingTier, SOCIAL_LABELS } from '../lib/speakerHelpers'
import { SocialIcon } from './SocialIcon'

interface SpeakerPhotoProps {
  name: string
  photoUrl: string
  className?: string
}

/** Photo with an initials fallback when the image is missing or fails to load. */
export function SpeakerPhoto({ name, photoUrl, className }: SpeakerPhotoProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(photoUrl) && !failed

  return (
    <div className={`speaker-photo${className ? ` ${className}` : ''}`}>
      {showImage ? (
        <img
          src={photoUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="speaker-photo__initials" aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}

interface SpeakerSocialsProps {
  socials: SpeakerSocial[]
}

export function SpeakerSocials({ socials }: SpeakerSocialsProps) {
  if (socials.length === 0) {
    return null
  }
  return (
    <ul className="speaker-socials" aria-label="Social links">
      {socials.map((social) => (
        <li key={`${social.type}-${social.url}`}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`speaker-socials__link speaker-socials__link--${social.type}`}
            title={SOCIAL_LABELS[social.type]}
            aria-label={SOCIAL_LABELS[social.type]}
          >
            <SocialIcon type={social.type} />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Number of poppy color variants defined in CSS (speaker-tag--0..N). */
const TAG_VARIANTS = 6

function tagVariant(tag: string): number {
  let hash = 0
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 31 + tag.charCodeAt(i)) % 997
  }
  return hash % TAG_VARIANTS
}

interface SpeakerTagsProps {
  tags: string[]
  className?: string
}

export function SpeakerTags({ tags, className }: SpeakerTagsProps) {
  if (tags.length === 0) {
    return null
  }
  return (
    <ul className={`speaker-tags${className ? ` ${className}` : ''}`} aria-label="Topics">
      {tags.map((tag) => (
        <li key={tag} className={`speaker-tag speaker-tag--${tagVariant(tag)}`}>
          {tag}
        </li>
      ))}
    </ul>
  )
}

/** Gradient stops for the rating ring, keyed by tier tone. */
const RATING_GRADIENTS: Record<'elite' | 'great' | 'good', [string, string]> = {
  elite: ['#ffe680', '#ff9d2f'],
  great: ['#9cc6ff', '#4f8cff'],
  good: ['#5af0c8', '#00b894'],
}

interface SpeakerRatingProps {
  rating: number
  /** Larger variant used inside the detail dialog. */
  size?: 'md' | 'lg'
}

/** Circular gauge showing the audience rating out of 10. */
export function SpeakerRating({ rating, size = 'md' }: SpeakerRatingProps) {
  const rawId = useId()
  const gradientId = `rating-${rawId.replace(/:/g, '')}`
  const { tone, label } = ratingTier(rating)
  const [from, to] = RATING_GRADIENTS[tone]

  const radius = 26
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(rating / 10, 1)) * circumference

  return (
    <div
      className={`speaker-rating speaker-rating--${tone} speaker-rating--${size}`}
      title={`${label} · ${rating.toFixed(2)} / 10`}
    >
      <svg viewBox="0 0 64 64" className="speaker-rating__ring" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle className="speaker-rating__track" cx="32" cy="32" r={radius} />
        <circle
          className="speaker-rating__fill"
          cx="32"
          cy="32"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="speaker-rating__center">
        <span className="speaker-rating__value">{rating.toFixed(2)}</span>
        <span className="speaker-rating__scale">/ 10</span>
      </span>
    </div>
  )
}

function AchievementIcon({ kind }: { kind: 'award' | 'milestone' }) {
  if (kind === 'award') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M6 3h12v2h3v3a4 4 0 0 1-4 4h-.35A6 6 0 0 1 13 15.91V18h3v2H8v-2h3v-2.09A6 6 0 0 1 7.35 12H7a4 4 0 0 1-4-4V5h3V3Zm0 4H5v1a2 2 0 0 0 1 1.72V7Zm12 0v2.72A2 2 0 0 0 19 8V7h-1Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm7 9a7 7 0 0 1-6 6.93V20h3v2H8v-2h3v-2.07A7 7 0 0 1 5 11h2a5 5 0 0 0 10 0h2Z" />
    </svg>
  )
}

interface SpeakerAchievementsProps {
  achievements: AchievementId[]
  className?: string
}

/** Row of earned achievement badges (awards + conference milestones). */
export function SpeakerAchievements({ achievements, className }: SpeakerAchievementsProps) {
  if (achievements.length === 0) {
    return null
  }
  return (
    <ul
      className={`speaker-badges${className ? ` ${className}` : ''}`}
      aria-label="Achievements"
    >
      {achievements.map((id) => {
        const meta = ACHIEVEMENTS[id]
        return (
          <li
            key={id}
            className={`speaker-badge speaker-badge--${meta.kind}`}
            title={meta.label}
          >
            <AchievementIcon kind={meta.kind} />
            <span className="speaker-badge__label">{meta.short}</span>
          </li>
        )
      })}
    </ul>
  )
}

