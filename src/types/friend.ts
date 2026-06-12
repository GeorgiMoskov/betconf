/**
 * A person in the user's network. Friends attend conferences and register for
 * upcoming editions; the account calendar cross-references these registrations
 * so the user can see which friends are going to the same talks/events.
 *
 * Conference ids reference editions in the shared conference catalog
 * (see `data/conferenceCatalog.ts`), so an attended/registered id always
 * resolves to a real conference page.
 */
export interface Friend {
  id: string
  name: string
  /** Headshot URL. May be empty -> initials fallback. */
  photoUrl: string
  /** Work role / job title, e.g. "Staff Frontend Engineer". */
  role: string
  /** Employer. */
  company: string
  country: string
  city: string
  /** Topic / technology tags. */
  tags: string[]
  /** Short editorial blurb. */
  bio: string
  /** Conference edition ids the friend has attended (past). */
  attendedConferenceIds: string[]
  /** Conference edition ids the friend is registered for (upcoming). */
  registeredConferenceIds: string[]
}
