import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserReview } from '../types/review'
import { buildAccountDefaults } from '../data/accountDefaults'
import { computeCoins } from '../lib/coins'
import { getMerchById } from '../data/merch'

/** A single talk the user has added to their personal calendar. */
export interface CalendarEvent {
  /** Id of the talk (unique key for add/remove). */
  talkId: string
  /** Id of the conference edition the talk belongs to. */
  conferenceId: string
  /** Display name of the conference edition. */
  conferenceName: string
  /** Talk title. */
  title: string
  /** ISO date (YYYY-MM-DD) of the talk. */
  date: string
  /** Local start time of the talk (HH:MM, 24h). */
  time?: string
  /** City / location. */
  location: string
  /** Id of the speaker delivering the talk. */
  speakerId: string
}

interface AccountState {
  /** Favourited conference edition ids. */
  favourites: string[]
  /** Registered conference edition ids. */
  registered: string[]
  /** Talks added to the personal calendar. */
  calendar: CalendarEvent[]
  /** Reviews the user has left on past talks (one per talk). */
  reviews: UserReview[]
  /** Free-text comments on calendar events, keyed by talkId (past or future). */
  notes: Record<string, string>
  /** Merch item ids the user has redeemed with coins. */
  redeemed: string[]
  toggleFavourite: (conferenceId: string) => void
  toggleRegistered: (conferenceId: string) => void
  addTalk: (event: CalendarEvent) => void
  removeTalk: (talkId: string) => void
  /** Add or replace the user's review for a talk. */
  saveReview: (review: UserReview) => void
  /** Remove the user's review for a talk. */
  removeReview: (talkId: string) => void
  /** Set or clear the user's comment on a calendar event (empty text clears it). */
  setNote: (talkId: string, text: string) => void
  /** Redeem a merch item, spending coins. No-op if the balance is too low. */
  redeemMerch: (merchId: string) => void
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}

const defaults = buildAccountDefaults()

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      favourites: defaults.favourites,
      registered: defaults.registered,
      calendar: defaults.calendar,
      reviews: defaults.reviews,
      notes: {},
      redeemed: [],
      toggleFavourite: (conferenceId) =>
        set((state) => ({ favourites: toggle(state.favourites, conferenceId) })),
      toggleRegistered: (conferenceId) =>
        set((state) => ({ registered: toggle(state.registered, conferenceId) })),
      addTalk: (event) =>
        set((state) =>
          state.calendar.some((item) => item.talkId === event.talkId)
            ? state
            : {
                calendar: [...state.calendar, event],
                // Adding a talk also registers the user for its conference.
                registered: state.registered.includes(event.conferenceId)
                  ? state.registered
                  : [...state.registered, event.conferenceId],
              },
        ),
      removeTalk: (talkId) =>
        set((state) => {
          const notes = { ...state.notes }
          delete notes[talkId]
          return {
            calendar: state.calendar.filter((item) => item.talkId !== talkId),
            notes,
          }
        }),
      saveReview: (review) =>
        set((state) => ({
          reviews: [
            ...state.reviews.filter((item) => item.talkId !== review.talkId),
            review,
          ],
        })),
      removeReview: (talkId) =>
        set((state) => ({
          reviews: state.reviews.filter((item) => item.talkId !== talkId),
        })),
      setNote: (talkId, text) =>
        set((state) => {
          const notes = { ...state.notes }
          const trimmed = text.trim()
          if (trimmed) {
            notes[talkId] = trimmed
          } else {
            delete notes[talkId]
          }
          return { notes }
        }),
      redeemMerch: (merchId) =>
        set((state) => {
          const item = getMerchById(merchId)
          if (!item) {
            return state
          }
          if (computeCoins(state).balance < item.price) {
            return state
          }
          return { redeemed: [...state.redeemed, merchId] }
        }),
    }),
    {
      name: 'betconf-account',
      version: 3,
      // Seed accounts created before the rewards system so returning visitors
      // also land on a populated account with a starting pool of coins, and make
      // sure today's timed agenda is present.
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<AccountState>
        const existing = state.calendar ?? []
        // Merge in seeded events (today's agenda + attended past talks) that
        // aren't already on the calendar, so returning visitors keep a populated
        // calendar with both upcoming and past events to comment on.
        const haveTalkIds = new Set(existing.map((event) => event.talkId))
        const seeded = [...defaults.todayEvents, ...defaults.pastEvents]
        const missing = seeded.filter((event) => !haveTalkIds.has(event.talkId))
        const calendar = existing.length ? [...existing, ...missing] : defaults.calendar
        return {
          ...state,
          favourites: state.favourites?.length ? state.favourites : defaults.favourites,
          registered: state.registered?.length ? state.registered : defaults.registered,
          calendar,
          reviews: state.reviews?.length ? state.reviews : defaults.reviews,
          redeemed: state.redeemed ?? [],
          notes: state.notes ?? {},
        } as AccountState
      },
    },
  ),
)
