import type { ConferenceHype } from '../types/speaker'
import { HYPE_META } from '../lib/speakerHelpers'

interface HypeBadgeProps {
  hype: ConferenceHype
  size?: 'sm' | 'md'
}

/** "Hype rating" badge: fire emojis + label, indicating top-rated attendance. */
export function HypeBadge({ hype, size = 'sm' }: HypeBadgeProps) {
  const meta = HYPE_META[hype]
  return (
    <span className={`hype-badge hype-badge--${hype} hype-badge--${size}`}>
      <span className="hype-badge__fire" aria-hidden="true">
        {'\u{1F525}'.repeat(meta.fires)}
      </span>
      <span className="hype-badge__label">{meta.label}</span>
      <span className="hype-badge__tooltip" role="tooltip">
        {meta.tooltip}
      </span>
    </span>
  )
}
