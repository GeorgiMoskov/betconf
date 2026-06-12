import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@progress/kendo-react-inputs'
import { AppHeader } from '../components/AppHeader'
import { FriendCard } from '../components/FriendCard'
import { resolveFriends } from '../lib/friends'
import { useFriendsStore } from '../store/friendsStore'
import type { Friend } from '../types/friend'

export function FriendsPage() {
  const navigate = useNavigate()
  const friendIds = useFriendsStore((state) => state.friendIds)
  const [query, setQuery] = useState('')

  const friends = useMemo(() => resolveFriends(friendIds), [friendIds])

  const visibleFriends = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) {
      return friends
    }
    return friends.filter((friend) => {
      const haystack =
        `${friend.name} ${friend.company} ${friend.role} ${friend.city} ${friend.country}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [friends, query])

  const openFriend = (friend: Friend) => {
    navigate(`/friends/${friend.id}`)
  }

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content">
        <header className="conferences__header speakers__intro">
          <h1 className="conferences__title speakers__title">
            Your <span className="speakers__title-accent">conference crew</span>
          </h1>
          <p className="conferences__subtitle">
            The people you go to conferences with. Open a profile to see where they’ve been and
            what they’re registered for next.
          </p>
        </header>

        <section className="filters" aria-label="Friend filters">
          <div className="filters__row">
            <div className="filters__field">
              <label className="filters__label" htmlFor="friend-search">
                Search
              </label>
              <Input
                id="friend-search"
                placeholder="Search by name, company or city"
                value={query}
                onChange={(event) => setQuery(event.value as string)}
              />
            </div>
          </div>
        </section>

        {visibleFriends.length > 0 ? (
          <div className="friend-grid">
            {visibleFriends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} onSelect={openFriend} />
            ))}
          </div>
        ) : (
          <div className="speaker-grid__empty">
            <h3>No friends found</h3>
            <p>Try a different search, or add people from their profile.</p>
          </div>
        )}
      </main>
    </div>
  )
}
