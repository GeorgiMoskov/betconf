import type { Friend } from '../types/friend'
import { SpeakerPhoto, SpeakerTags } from './SpeakerMedia'

interface FriendCardProps {
  friend: Friend
  onSelect: (friend: Friend) => void
}

export function FriendCard({ friend, onSelect }: FriendCardProps) {
  const location = [friend.city, friend.country].filter(Boolean).join(', ')

  return (
    <article className="friend-card">
      <button
        type="button"
        className="friend-card__main"
        onClick={() => onSelect(friend)}
        aria-label={`View ${friend.name}'s profile`}
      >
        <SpeakerPhoto
          name={friend.name}
          photoUrl={friend.photoUrl}
          className="friend-card__photo"
        />
        <h3 className="friend-card__name">{friend.name}</h3>
        <p className="friend-card__role">{friend.role}</p>
        <p className="friend-card__meta">
          {friend.company}
          {location ? ` · ${location}` : ''}
        </p>

        <div className="friend-card__stats">
          <span className="friend-card__stat">
            <strong>{friend.attendedConferenceIds.length}</strong> attended
          </span>
          <span className="friend-card__stat">
            <strong>{friend.registeredConferenceIds.length}</strong> upcoming
          </span>
        </div>

        <SpeakerTags tags={friend.tags} className="friend-card__tags" />
      </button>
    </article>
  )
}
