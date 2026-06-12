import type { ConferenceDetail } from '../data/conferenceCatalog'
import { ConferenceCard } from './ConferenceCard'

interface ConferenceGridProps {
  conferences: ConferenceDetail[]
}

export function ConferenceGrid({ conferences }: ConferenceGridProps) {
  if (conferences.length === 0) {
    return (
      <div className="conf-grid__empty">
        <h3>No conferences match your filters</h3>
        <p>Try removing a filter or clearing them all to see more events.</p>
      </div>
    )
  }

  return (
    <div className="conf-grid">
      {conferences.map((conference) => (
        <ConferenceCard key={conference.edition.id} conference={conference} />
      ))}
    </div>
  )
}
