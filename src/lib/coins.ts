import type { CalendarEvent } from '../store/accountStore'
import type { UserReview } from '../types/review'
import { getMerchById } from '../data/merch'

/**
 * FireRaven coins reward visitors for engaging with the conference hub:
 * attending an event (a talk on your calendar), registering for a conference,
 * and leaving a review. Coins can then be redeemed for merch in the store.
 */
export const COINS_PER_EVENT_ATTENDED = 10
export const COINS_PER_REGISTRATION = 10
export const COINS_PER_REVIEW = 5
/** A flat welcome bonus every visitor starts with, so the store is usable. */
export const COINS_WELCOME_BONUS = 300

/** The slice of account state coins are computed from. */
export interface CoinSource {
  /** Registered conference edition ids. */
  registered: string[]
  /** Talks added to the calendar — treated as events attended. */
  calendar: CalendarEvent[]
  /** Reviews the visitor has left. */
  reviews: UserReview[]
  /** Merch item ids the visitor has redeemed (coins spent). */
  redeemed: string[]
}

/** A breakdown of how a visitor's coin balance was earned and spent. */
export interface CoinSummary {
  /** Flat welcome bonus granted on sign-up. */
  welcomeBonus: number
  /** Coins earned from attending events. */
  fromEvents: number
  /** Coins earned from registering for conferences. */
  fromRegistrations: number
  /** Coins earned from leaving reviews. */
  fromReviews: number
  /** Total coins earned (welcome bonus + activity). */
  earned: number
  /** Total coins spent in the store. */
  spent: number
  /** Coins available to spend. */
  balance: number
}

/** Compute a visitor's coin breakdown from their account activity. */
export function computeCoins(source: CoinSource): CoinSummary {
  const fromEvents = source.calendar.length * COINS_PER_EVENT_ATTENDED
  const fromRegistrations = source.registered.length * COINS_PER_REGISTRATION
  const fromReviews = source.reviews.length * COINS_PER_REVIEW
  const earned = COINS_WELCOME_BONUS + fromEvents + fromRegistrations + fromReviews
  const spent = source.redeemed.reduce(
    (sum, id) => sum + (getMerchById(id)?.price ?? 0),
    0,
  )
  return {
    welcomeBonus: COINS_WELCOME_BONUS,
    fromEvents,
    fromRegistrations,
    fromReviews,
    earned,
    spent,
    balance: earned - spent,
  }
}
