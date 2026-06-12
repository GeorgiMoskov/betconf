export type SocialType =
  | 'github'
  | 'twitter'
  | 'bluesky'
  | 'linkedin'
  | 'instagram'
  | 'website'
  | 'gitnation'

export interface SpeakerSocial {
  type: SocialType
  url: string
}

/** Achievement / honour a speaker can earn. */
export type AchievementId =
  | 'best-speaker-2025'
  | 'best-speaker-2024'
  | 'best-speaker-2023'
  | 'conferences-10'
  | 'conferences-50'
  | 'conferences-100'

/**
 * A speaker from the React Summit 2026 (Amsterdam) line-up.
 * Data scraped from https://reactsummit.com.
 */
export interface ReactSummitSpeaker {
  id: string
  name: string
  /** Headshot URL (imgix or GitHub avatar). May be empty -> initials fallback. */
  photoUrl: string
  company: string
  country: string
  /** Optional role for MCs / Program Committee members. */
  role?: string
  /** Talk or workshop title. */
  talk?: string
  /** Topic / technology tags used for filtering and card chips. */
  tags: string[]
  bio: string
  socials: SpeakerSocial[]
  /** Audience rating from 0.00 to 10.00. */
  rating: number
  /** Earned achievements / honours. */
  achievements: AchievementId[]
  /**
   * Aggregate ranking points (placeholder for now). Eventually derived from
   * rating, achievements, big-tech endorsements, awards, etc.
   */
  rankingPoints: number
  /** Editorial blurb on how strong the speaker is in their field of expertise. */
  expertise: string
}

/**
 * "Hype" rating for a conference, reflecting how many top-rated speakers are
 * attending: `good` (some), `great` (multiple), `exceptional` (a lot).
 */
export type ConferenceHype = 'good' | 'great' | 'exceptional'

/**
 * A single talk delivered by a speaker at a specific conference edition.
 * Lives in the shared conference catalog so it can be resolved from a speaker
 * profile, a conference page, or a standalone talk page.
 */
export interface ConferenceTalk {
  id: string
  /** Id of the conference edition this talk belongs to. */
  conferenceId: string
  /** Display name of the conference edition (brand + year). */
  conferenceName: string
  /** Id of the speaker who delivered the talk. */
  speakerId: string
  /** Title of the talk. */
  title: string
  /** A short editorial description of what the talk covers. */
  description: string
  /** ISO date (YYYY-MM-DD) of the talk. */
  date: string
  /** Local start time of the talk (HH:MM, 24h). */
  time: string
  /** City / location of the conference. */
  location: string
  /** Tech stack covered in the talk. */
  tags: string[]
  /** Audience rating earned (past talks only). */
  rating?: number
  /** Hype level of the conference this talk belongs to. */
  hype?: ConferenceHype
  /** True for talks happening in the future. */
  upcoming: boolean
}

/**
 * A specific edition of a conference (a brand in a given year), aggregating
 * every talk delivered at it.
 */
export interface ConferenceEdition {
  id: string
  /** Conference brand, e.g. "React Summit". */
  brand: string
  /** Display name including the year, e.g. "React Summit 2025". */
  name: string
  /** A short editorial description of the conference. */
  description: string
  /** City / location. */
  location: string
  /** Calendar year of the edition. */
  year: number
  /** ISO date (YYYY-MM-DD) the edition starts. */
  startDate: string
  /** Average audience rating across past talks (undefined for upcoming). */
  rating?: number
  /** Hype level based on how many top-rated speakers are attending. */
  hype?: ConferenceHype
  /** Union of every tech tag covered across its talks. */
  technologies: string[]
  /** True for editions happening in the future. */
  upcoming: boolean
}

/** A speaker's conference history, split into upcoming and past appearances. */
export interface SpeakerConferences {
  upcoming: ConferenceTalk[]
  past: ConferenceTalk[]
}
