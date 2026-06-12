import type { Friend } from '../types/friend'
import { getFriendById } from '../data/friends'

/** Resolve a list of friend ids to friend objects, preserving order. */
export function resolveFriends(ids: string[]): Friend[] {
  return ids
    .map((id) => getFriendById(id))
    .filter((friend): friend is Friend => Boolean(friend))
}

/** Friends (from the given pool) who are registered for a conference edition. */
export function friendsRegisteredFor(friends: Friend[], conferenceId: string): Friend[] {
  return friends.filter((friend) => friend.registeredConferenceIds.includes(conferenceId))
}
