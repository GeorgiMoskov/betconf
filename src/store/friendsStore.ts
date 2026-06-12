import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FRIENDS } from '../data/friends'

/**
 * The user's friend graph. Seeded with the full directory so the demo has a
 * populated network out of the box, but the user can unfriend (and re-add)
 * people. Only the ids are stored; friend details live in `data/friends.ts`.
 */
interface FriendsState {
  /** Ids of the user's current friends. */
  friendIds: string[]
  addFriend: (id: string) => void
  removeFriend: (id: string) => void
  isFriend: (id: string) => boolean
}

const DEFAULT_FRIEND_IDS = FRIENDS.map((friend) => friend.id)

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      friendIds: DEFAULT_FRIEND_IDS,
      addFriend: (id) =>
        set((state) =>
          state.friendIds.includes(id)
            ? state
            : { friendIds: [...state.friendIds, id] },
        ),
      removeFriend: (id) =>
        set((state) => ({ friendIds: state.friendIds.filter((item) => item !== id) })),
      isFriend: (id) => get().friendIds.includes(id),
    }),
    { name: 'betconf-friends' },
  ),
)
