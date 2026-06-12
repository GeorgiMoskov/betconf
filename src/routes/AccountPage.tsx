import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker } from '@progress/kendo-react-dateinputs'
import type { DatePickerChangeEvent } from '@progress/kendo-react-dateinputs'
import { AppHeader } from '../components/AppHeader'
import { ConferenceCard } from '../components/ConferenceCard'
import { CoinWallet } from '../components/CoinWallet'
import { RewardsPanel } from '../components/RewardsPanel'
import { SpeakerPhoto } from '../components/SpeakerMedia'
import { computeCoins } from '../lib/coins'
import { getConferenceById } from '../data/conferenceCatalog'
import type { ConferenceDetail } from '../data/conferenceCatalog'
import { friendsRegisteredFor, resolveFriends } from '../lib/friends'
import { useAccountStore } from '../store/accountStore'
import { useFriendsStore } from '../store/friendsStore'

/** The app assumes a single, always-signed-in demo user. */
const CURRENT_USER = 'Alex Rivera'

type ConferenceTab = 'favourites' | 'upcoming' | 'past'

const TABS: { id: ConferenceTab; label: string }[] = [
  { id: 'favourites', label: 'Favourites' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
]

const agendaDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Local YYYY-MM-DD key for a Date (matches the catalog's ISO date strings). */
function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatAgendaDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return agendaDateFormatter.format(new Date(year, month - 1, day))
}

/** Format a 24h "HH:MM" time as a friendly 12h label. */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}

function resolveMany(ids: string[]): ConferenceDetail[] {
  return ids
    .map((id) => getConferenceById(id))
    .filter((detail): detail is ConferenceDetail => Boolean(detail))
}

export function AccountPage() {
  const username = CURRENT_USER
  const favourites = useAccountStore((state) => state.favourites)
  const registered = useAccountStore((state) => state.registered)
  const calendar = useAccountStore((state) => state.calendar)
  const reviews = useAccountStore((state) => state.reviews)
  const redeemed = useAccountStore((state) => state.redeemed)
  const removeTalk = useAccountStore((state) => state.removeTalk)
  const friendIds = useFriendsStore((state) => state.friendIds)

  const coins = useMemo(
    () => computeCoins({ registered, calendar, reviews, redeemed }),
    [registered, calendar, reviews, redeemed],
  )

  const friends = useMemo(() => resolveFriends(friendIds), [friendIds])

  const [tab, setTab] = useState<ConferenceTab>('favourites')
  // Default the picker to today, so the agenda opens on today's schedule.
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date())

  const todayKey = dateKey(new Date())

  const favouriteConferences = useMemo(() => resolveMany(favourites), [favourites])
  const registeredConferences = useMemo(() => resolveMany(registered), [registered])

  const upcomingConferences = useMemo(
    () => registeredConferences.filter((c) => c.edition.startDate >= todayKey),
    [registeredConferences, todayKey],
  )
  const pastConferences = useMemo(
    () => registeredConferences.filter((c) => c.edition.startDate < todayKey),
    [registeredConferences, todayKey],
  )

  const visibleConferences =
    tab === 'favourites'
      ? favouriteConferences
      : tab === 'upcoming'
        ? upcomingConferences
        : pastConferences

  const tabCounts: Record<ConferenceTab, number> = {
    favourites: favouriteConferences.length,
    upcoming: upcomingConferences.length,
    past: pastConferences.length,
  }

  const selectedKey = selectedDate ? dateKey(selectedDate) : null

  const agenda = useMemo(() => {
    const sorted = [...calendar].sort(
      (a, b) =>
        a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''),
    )
    return selectedKey ? sorted.filter((event) => event.date === selectedKey) : sorted
  }, [calendar, selectedKey])

  const emptyCopy: Record<ConferenceTab, { title: string; hint: string }> = {
    favourites: {
      title: 'No favourites yet',
      hint: 'Tap the star on any conference card to save it here.',
    },
    upcoming: {
      title: 'No upcoming conferences',
      hint: 'Register for a conference from its page to see it here.',
    },
    past: {
      title: 'No past conferences',
      hint: 'Conferences you registered for will move here after they happen.',
    },
  }

  const initials = (username ?? 'You').slice(0, 2).toUpperCase()

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content account-page">
        <section className="account-hero">
          <span className="account-hero__avatar" aria-hidden="true">
            {initials}
          </span>
          <div className="account-hero__intro">
            <span className="account-hero__eyebrow">My Account</span>
            <h1 className="account-hero__name">{username ?? 'Welcome back'}</h1>
            <p className="account-hero__meta">
              {favourites.length} favourite{favourites.length === 1 ? '' : 's'} ·{' '}
              {registered.length} registered · {calendar.length} calendar event
              {calendar.length === 1 ? '' : 's'}
            </p>

            <Link className="account-friends" to="/friends">
              <span className="account-friends__avatars" aria-hidden="true">
                {friends.slice(0, 4).map((friend) => (
                  <SpeakerPhoto
                    key={friend.id}
                    name={friend.name}
                    photoUrl={friend.photoUrl}
                    className="account-friends__avatar"
                  />
                ))}
              </span>
              <span className="account-friends__text">
                <span className="account-friends__count">{friends.length}</span>
                <span className="account-friends__label">
                  friend{friends.length === 1 ? '' : 's'}
                </span>
              </span>
              <svg
                className="account-friends__arrow"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <CoinWallet
            balance={coins.balance}
            caption={`${coins.earned.toLocaleString('en-US')} earned · ${coins.spent.toLocaleString('en-US')} spent`}
            shopLink
          />
        </section>

        <div className="account-layout">
          <section className="account-section">
            <header className="account-section__head">
              <h2 className="account-section__title">My conferences</h2>
            </header>

            <div className="conf-tabs" role="tablist" aria-label="Conference lists">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={`conf-tab${tab === item.id ? ' conf-tab--active' : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                  <span className="conf-tab__count">{tabCounts[item.id]}</span>
                </button>
              ))}
            </div>

            {visibleConferences.length > 0 ? (
              <div className="account-cards">
                {visibleConferences.map((conference) => (
                  <ConferenceCard key={conference.edition.id} conference={conference} />
                ))}
              </div>
            ) : (
              <div className="account-empty">
                <h3>{emptyCopy[tab].title}</h3>
                <p>{emptyCopy[tab].hint}</p>
              </div>
            )}
          </section>

          <section className="account-section account-calendar">
            <header className="account-section__head">
              <h2 className="account-section__title">My calendar</h2>
              {selectedKey && (
                <button
                  type="button"
                  className="account-calendar__clear"
                  onClick={() => setSelectedDate(null)}
                >
                  Show all
                </button>
              )}
            </header>

            <div className="account-datepicker">
              <label className="account-datepicker__label" htmlFor="account-day-picker">
                Pick a day
              </label>
              <DatePicker
                id="account-day-picker"
                value={selectedDate}
                format="EEEE, dd MMM yyyy"
                onChange={(event: DatePickerChangeEvent) => setSelectedDate(event.value)}
              />
            </div>

            <div className="account-agenda">
              <h3 className="account-agenda__title">
                {selectedKey ? formatAgendaDate(selectedKey) : 'All saved talks'}
                <span className="account-agenda__count">{agenda.length}</span>
              </h3>

              {agenda.length > 0 ? (
                <ul className="account-agenda__list">
                  {agenda.map((event) => {
                    const friendsGoing = friendsRegisteredFor(friends, event.conferenceId)
                    return (
                      <li key={event.talkId} className="account-agenda__item">
                        <span className="account-agenda__when">
                          <span className="account-agenda__date">
                            {formatAgendaDate(event.date)}
                          </span>
                          {event.time && (
                            <span className="account-agenda__time">{formatTime(event.time)}</span>
                          )}
                        </span>
                        <Link className="account-agenda__talk" to={`/talks/${event.talkId}`}>
                          {event.title}
                        </Link>
                        <Link
                          className="account-agenda__conf"
                          to={`/conferences/${event.conferenceId}`}
                        >
                          {event.conferenceName} · {event.location}
                        </Link>

                        {friendsGoing.length > 0 && (
                          <div className="account-agenda__friends" title="Friends registered for this event">
                            <span className="account-agenda__friends-avatars">
                              {friendsGoing.slice(0, 4).map((friend) => (
                                <Link
                                  key={friend.id}
                                  to={`/friends/${friend.id}`}
                                  className="account-agenda__friend"
                                  title={`${friend.name} is going`}
                                  aria-label={`${friend.name} is going`}
                                >
                                  <SpeakerPhoto name={friend.name} photoUrl={friend.photoUrl} />
                                </Link>
                              ))}
                            </span>
                            <span className="account-agenda__friends-label">
                              {friendsGoing.length === 1
                                ? `${friendsGoing[0].name.split(' ')[0]} is going`
                                : `${friendsGoing.length} friends going`}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="account-agenda__remove"
                          onClick={() => removeTalk(event.talkId)}
                          aria-label={`Remove ${event.title} from calendar`}
                          title="Remove from calendar"
                        >
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="account-empty account-empty--sm">
                  <p>
                    {selectedKey
                      ? 'No talks on this day.'
                      : 'Add talks to your calendar from any conference page.'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <RewardsPanel />
      </main>
    </div>
  )
}
