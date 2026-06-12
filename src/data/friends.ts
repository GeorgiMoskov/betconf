import type { Friend } from '../types/friend'
import { getAllConferences } from './conferenceCatalog'

/**
 * The user's network of friends. People are hand-authored; their conference
 * attendance/registrations are assigned deterministically from the real
 * conference catalog so that:
 *   - every attended/registered id resolves to a real conference page, and
 *   - friends spread across ~half of the available editions, so whatever the
 *     user registers for, some friends are likely going too.
 *
 * The real data will eventually come from a social/graph backend.
 */

const avatar = (n: number): string => `https://i.pravatar.cc/400?img=${n}`

type FriendSeed = Omit<Friend, 'attendedConferenceIds' | 'registeredConferenceIds'>

const FRIEND_SEEDS: FriendSeed[] = [
  {
    id: 'mara-velasquez',
    name: 'Mara Velásquez',
    photoUrl: avatar(5),
    role: 'Staff Frontend Engineer',
    company: 'Spotify',
    country: 'Sweden',
    city: 'Stockholm',
    tags: ['React', 'Design Systems', 'Performance'],
    bio: 'Builds the component platform powering Spotify’s web players. Lifelong conference hopper and hallway-track enthusiast.',
  },
  {
    id: 'devon-okoye',
    name: 'Devon Okoye',
    photoUrl: avatar(12),
    role: 'Senior Software Engineer',
    company: 'Vercel',
    country: 'United Kingdom',
    city: 'London',
    tags: ['Next.js', 'Edge', 'TypeScript'],
    bio: 'Works on the Next.js DX team. Spends most weekends speaking at or attending React meetups around Europe.',
  },
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    photoUrl: avatar(33),
    role: 'Mobile Lead',
    company: 'Mercari',
    country: 'Japan',
    city: 'Tokyo',
    tags: ['React Native', 'Animations', 'Mobile'],
    bio: 'Leads the React Native platform team at Mercari. Obsessed with 60fps gestures and native-feeling transitions.',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    photoUrl: avatar(45),
    role: 'Principal Engineer',
    company: 'Atlassian',
    country: 'Australia',
    city: 'Sydney',
    tags: ['Architecture', 'Micro-Frontends', 'GraphQL'],
    bio: 'Untangles large frontends for a living. Has a strong opinion about module federation and an even stronger one about coffee.',
  },
  {
    id: 'lucas-moreau',
    name: 'Lucas Moreau',
    photoUrl: avatar(15),
    role: 'Developer Advocate',
    company: 'Stripe',
    country: 'France',
    city: 'Paris',
    tags: ['DX', 'TypeScript', 'Open Source'],
    bio: 'Tells stories about APIs and developer experience. Probably already has a sticker for your laptop.',
  },
  {
    id: 'sofia-romano',
    name: 'Sofia Romano',
    photoUrl: avatar(20),
    role: 'Engineering Manager',
    company: 'Figma',
    country: 'Italy',
    city: 'Milan',
    tags: ['Real-Time', 'Canvas', 'WebGL'],
    bio: 'Manages the multiplayer team behind Figma’s canvas. Loves a good systems talk and a worse pun.',
  },
  {
    id: 'noah-bergstrom',
    name: 'Noah Bergström',
    photoUrl: avatar(52),
    role: 'Full-Stack Engineer',
    company: 'Klarna',
    country: 'Germany',
    city: 'Berlin',
    tags: ['Full-Stack', 'Testing', 'Node.js'],
    bio: 'Ships end-to-end features and writes the tests to keep them honest. Berlin meetup regular.',
  },
  {
    id: 'amina-diallo',
    name: 'Amina Diallo',
    photoUrl: avatar(48),
    role: 'Accessibility Engineer',
    company: 'Shopify',
    country: 'Canada',
    city: 'Toronto',
    tags: ['Accessibility', 'Design Systems', 'React'],
    bio: 'Makes sure the web works for everyone. Reviews your aria-labels so your users don’t have to suffer.',
  },
]

function seed(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Deterministically pick `count` distinct ids, ordered by a per-friend hash. */
function pickSubset(ids: string[], key: string, count: number): string[] {
  return [...ids]
    .map((id) => ({ id, rank: seed(`${key}:${id}`) }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, Math.min(count, ids.length))
    .map((entry) => entry.id)
    .sort()
}

const catalog = getAllConferences()
const upcomingIds = catalog.filter((c) => c.edition.upcoming).map((c) => c.edition.id)
const pastIds = catalog.filter((c) => !c.edition.upcoming).map((c) => c.edition.id)

/** Each friend registers for ~half of upcoming editions and attended ~half of past ones. */
export const FRIENDS: Friend[] = FRIEND_SEEDS.map((friend) => ({
  ...friend,
  registeredConferenceIds: pickSubset(
    upcomingIds,
    `${friend.id}-reg`,
    Math.ceil(upcomingIds.length * 0.5),
  ),
  attendedConferenceIds: pickSubset(
    pastIds,
    `${friend.id}-att`,
    Math.ceil(pastIds.length * 0.5),
  ),
}))

const friendsById = new Map(FRIENDS.map((friend) => [friend.id, friend]))

export function getFriendById(id: string): Friend | undefined {
  return friendsById.get(id)
}
