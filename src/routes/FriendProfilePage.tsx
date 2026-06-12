import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { AppHeader } from '../components/AppHeader'
import { ConferenceCard } from '../components/ConferenceCard'
import { SpeakerPhoto, SpeakerTags } from '../components/SpeakerMedia'
import { getFriendById } from '../data/friends'
import { getConferenceById } from '../data/conferenceCatalog'
import type { ConferenceDetail } from '../data/conferenceCatalog'
import { useAccountStore } from '../store/accountStore'
import { useFriendsStore } from '../store/friendsStore'

function resolveConferences(ids: string[]): ConferenceDetail[] {
  return ids
    .map((id) => getConferenceById(id))
    .filter((detail): detail is ConferenceDetail => Boolean(detail))
    .sort((a, b) => a.edition.startDate.localeCompare(b.edition.startDate))
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12 2.5c-3.6 0-6.5 2.8-6.5 6.3 0 4.6 6.5 12.7 6.5 12.7s6.5-8.1 6.5-12.7c0-3.5-2.9-6.3-6.5-6.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="8.8" r="2.4" fill="currentColor" />
    </svg>
  )
}

/** Distinct cities a friend has visited across attended + upcoming editions. */
function countCities(conferences: ConferenceDetail[]): number {
  return new Set(conferences.map((c) => c.edition.location)).size
}

export function FriendProfilePage() {
  const { friendId } = useParams<{ friendId: string }>()
  const navigate = useNavigate()
  const friend = friendId ? getFriendById(friendId) : undefined

  const isFriend = useFriendsStore((state) => (friendId ? state.friendIds.includes(friendId) : false))
  const addFriend = useFriendsStore((state) => state.addFriend)
  const removeFriend = useFriendsStore((state) => state.removeFriend)

  const registered = useAccountStore((state) => state.registered)
  const calendar = useAccountStore((state) => state.calendar)

  /** Conference ids the user is going to (registered editions + calendar talks). */
  const myConferenceIds = useMemo(() => {
    const ids = new Set(registered)
    for (const event of calendar) {
      ids.add(event.conferenceId)
    }
    return ids
  }, [registered, calendar])

  const attended = useMemo(
    () => (friend ? resolveConferences(friend.attendedConferenceIds) : []),
    [friend],
  )
  const upcoming = useMemo(
    () => (friend ? resolveConferences(friend.registeredConferenceIds) : []),
    [friend],
  )
  const shared = useMemo(
    () => upcoming.filter((conference) => myConferenceIds.has(conference.edition.id)),
    [upcoming, myConferenceIds],
  )
  /** Upcoming events not already surfaced in the "both going" highlight. */
  const otherUpcoming = useMemo(() => {
    const sharedIds = new Set(shared.map((c) => c.edition.id))
    return upcoming.filter((c) => !sharedIds.has(c.edition.id))
  }, [upcoming, shared])

  const cities = useMemo(() => countCities([...attended, ...upcoming]), [attended, upcoming])

  if (!friend) {
    return (
      <div className="conferences">
        <AppHeader />
        <main className="conferences__content">
          <div className="speaker-profile__notfound">
            <h1>Friend not found</h1>
            <p>We couldn&apos;t find the person you were looking for.</p>
            <Button themeColor="primary" onClick={() => navigate('/friends')}>
              Back to all friends
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const location = [friend.city, friend.country].filter(Boolean).join(', ')
  const firstName = friend.name.split(' ')[0]

  const stats = [
    { label: 'Attended', value: attended.length },
    { label: 'Upcoming', value: upcoming.length },
    { label: 'Cities', value: cities },
    { label: 'With you', value: shared.length, highlight: true },
  ]

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content friend-profile">
        <button
          type="button"
          className="speaker-profile__back"
          onClick={() => navigate('/friends')}
        >
          ← All friends
        </button>

        <section className="friend-profile__hero">
          <div className="friend-profile__photo-wrap">
            <SpeakerPhoto
              name={friend.name}
              photoUrl={friend.photoUrl}
              className="friend-profile__photo"
            />
            {isFriend && (
              <span className="friend-profile__badge" title="In your friends">
                ✓ Friend
              </span>
            )}
          </div>

          <div className="friend-profile__intro">
            <span className="account-hero__eyebrow">Friend</span>
            <h1 className="friend-profile__name">{friend.name}</h1>
            <p className="friend-profile__role">
              {friend.role} <span className="friend-profile__at">at</span>{' '}
              <span className="friend-profile__company">{friend.company}</span>
            </p>
            {location && (
              <p className="friend-profile__meta">
                <PinIcon />
                {location}
              </p>
            )}

            <p className="friend-profile__bio">{friend.bio}</p>

            <SpeakerTags tags={friend.tags} className="friend-profile__tags" />

            <div className="friend-profile__actions">
              <Button
                fillMode="flat"
                className={`friend-follow${isFriend ? ' friend-follow--active' : ' friend-follow--add'}`}
                onClick={() => (isFriend ? removeFriend(friend.id) : addFriend(friend.id))}
                aria-label={isFriend ? `Remove ${firstName} from friends` : `Add ${firstName} as a friend`}
              >
                {isFriend ? (
                  <>
                    <span className="friend-follow__icon friend-follow__icon--default" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M4 12.5l5 5 11-11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="friend-follow__icon friend-follow__icon--hover" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="friend-follow__text friend-follow__text--default">Friends</span>
                    <span className="friend-follow__text friend-follow__text--hover">Remove friend</span>
                  </>
                ) : (
                  <>
                    <span className="friend-follow__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </span>
                    Add friend
                  </>
                )}
              </Button>
            </div>
          </div>

          <dl className="friend-profile__stats">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`friend-stat${stat.highlight ? ' friend-stat--accent' : ''}`}
              >
                <dt className="friend-stat__value">{stat.value}</dt>
                <dd className="friend-stat__label">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {shared.length > 0 && (
          <section className="friend-profile__section friend-profile__section--shared">
            <header className="account-section__head">
              <h2 className="account-section__title">
                <span className="friend-profile__section-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.3 7.2 18.7l.9-5.4L4.2 8.7l5.4-.8L12 3z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                You&rsquo;re both going to
              </h2>
              <span className="friend-profile__count">{shared.length}</span>
            </header>
            <p className="friend-profile__section-sub">
              Events {firstName} registered for that are already on your calendar.
            </p>
            <div className="account-cards">
              {shared.map((conference) => (
                <ConferenceCard key={conference.edition.id} conference={conference} />
              ))}
            </div>
          </section>
        )}

        <section className="friend-profile__section">
          <header className="account-section__head">
            <h2 className="account-section__title">
              <span className="friend-profile__section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <rect x="3" y="4.5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M3 9h18M8 3v3M16 3v3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              {shared.length > 0 ? 'Other upcoming events' : 'Upcoming events'}
            </h2>
            <span className="friend-profile__count">{otherUpcoming.length}</span>
          </header>
          {otherUpcoming.length > 0 ? (
            <div className="account-cards">
              {otherUpcoming.map((conference) => (
                <ConferenceCard key={conference.edition.id} conference={conference} />
              ))}
            </div>
          ) : (
            <div className="account-empty account-empty--sm">
              <p>
                {shared.length > 0
                  ? `Every upcoming event ${firstName} is registered for is also on your calendar.`
                  : `${firstName} hasn't registered for any upcoming events yet.`}
              </p>
            </div>
          )}
        </section>

        <section className="friend-profile__section">
          <header className="account-section__head">
            <h2 className="account-section__title">
              <span className="friend-profile__section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              Attended conferences
            </h2>
            <span className="friend-profile__count">{attended.length}</span>
          </header>
          {attended.length > 0 ? (
            <div className="account-cards">
              {attended.map((conference) => (
                <ConferenceCard key={conference.edition.id} conference={conference} />
              ))}
            </div>
          ) : (
            <div className="account-empty account-empty--sm">
              <p>No past conferences on record.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
