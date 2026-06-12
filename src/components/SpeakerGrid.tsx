import type { ReactSummitSpeaker } from '../types/speaker'
import { SpeakerCard } from './SpeakerCard'

interface SpeakerGridProps {
  speakers: ReactSummitSpeaker[]
  onSelect: (speaker: ReactSummitSpeaker) => void
}

export function SpeakerGrid({ speakers, onSelect }: SpeakerGridProps) {
  if (speakers.length === 0) {
    return (
      <div className="speaker-grid__empty">
        <h3>No speakers found</h3>
        <p>Try a different name or clear the technology filters.</p>
      </div>
    )
  }

  return (
    <div className="speaker-grid">
      {speakers.map((speaker, index) => (
        <SpeakerCard
          key={speaker.id}
          speaker={speaker}
          rank={index + 1}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
