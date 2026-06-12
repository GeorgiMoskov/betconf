import tee1 from '../assets/merch/tee-1.png'
import tee2 from '../assets/merch/tee-2.png'
import tee3 from '../assets/merch/tee-3.png'
import mug1 from '../assets/merch/mug-1.png'
import mug2 from '../assets/merch/mug-2.png'
import mug3 from '../assets/merch/mug-3.png'
import stickers from '../assets/merch/stickers.png'

/** A category groups the store grid and drives the little category pill. */
export type MerchCategory = 'apparel' | 'drinkware' | 'stickers'

/** A single item a visitor can redeem with their FireRaven coins. */
export interface MerchItem {
  id: string
  name: string
  /** One-line editorial blurb shown under the name. */
  description: string
  category: MerchCategory
  /** Cost in FireRaven coins. */
  price: number
  /** Product image (bundled asset URL). */
  image: string
}

/**
 * The FireRaven Conf swag store. Visitors spend the coins they earn from
 * attending events, registering for conferences and leaving reviews. Prices are
 * tuned so an engaged visitor can afford a couple of items.
 */
export const MERCH: MerchItem[] = [
  {
    id: 'tee-crest',
    name: 'FireRaven Crest Tee',
    description: 'Oversized black tee with the blazing crest emblem.',
    category: 'apparel',
    price: 150,
    image: tee1,
  },
  {
    id: 'tee-glare',
    name: 'FireRaven Glare Tee',
    description: 'The signature side-glare raven across the chest.',
    category: 'apparel',
    price: 150,
    image: tee2,
  },
  {
    id: 'tee-warrior',
    name: 'FireRaven Warrior Tee',
    description: 'Full-body flame warrior — the collector’s favourite.',
    category: 'apparel',
    price: 160,
    image: tee3,
  },
  {
    id: 'mug-crest',
    name: 'FireRaven Crest Mug',
    description: 'Ceramic mug with the crest emblem for your morning build.',
    category: 'drinkware',
    price: 80,
    image: mug1,
  },
  {
    id: 'mug-glare',
    name: 'FireRaven Glare Mug',
    description: 'Side-glare raven mug — fuel for the hallway track.',
    category: 'drinkware',
    price: 80,
    image: mug2,
  },
  {
    id: 'mug-warrior',
    name: 'FireRaven Warrior Mug',
    description: 'Flame warrior mug for the most dedicated attendees.',
    category: 'drinkware',
    price: 90,
    image: mug3,
  },
  {
    id: 'sticker-pack',
    name: 'FireRaven Sticker Pack',
    description: '14 die-cut laptop stickers — deck out your machine.',
    category: 'stickers',
    price: 40,
    image: stickers,
  },
]

const MERCH_BY_ID = new Map(MERCH.map((item) => [item.id, item]))

/** Resolve a merch item by its id. */
export function getMerchById(id: string): MerchItem | undefined {
  return MERCH_BY_ID.get(id)
}
