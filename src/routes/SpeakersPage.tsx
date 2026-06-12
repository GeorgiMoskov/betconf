import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@progress/kendo-react-inputs'
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns'
import type {
  DropDownListChangeEvent,
  MultiSelectChangeEvent,
} from '@progress/kendo-react-dropdowns'
import { Button } from '@progress/kendo-react-buttons'
import { AppHeader } from '../components/AppHeader'
import { SpeakerGrid } from '../components/SpeakerGrid'
import { REACT_SUMMIT_SPEAKERS, SPEAKER_TAGS } from '../data/reactSummitSpeakers'
import { achievementScore } from '../lib/speakerHelpers'
import type { ReactSummitSpeaker } from '../types/speaker'

type SortId = 'points-desc' | 'rating-desc' | 'rating-asc' | 'achievements-desc'

interface SortOption {
  id: SortId
  text: string
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'points-desc', text: 'Ranking points' },
  { id: 'rating-desc', text: 'Rating: High to Low' },
  { id: 'rating-asc', text: 'Rating: Low to High' },
  { id: 'achievements-desc', text: 'Most achievements' },
]

const DEFAULT_SORT = SORT_OPTIONS[0]

export function SpeakersPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT)

  const openSpeaker = (speaker: ReactSummitSpeaker) => {
    navigate(`/speakers/${speaker.id}`)
  }

  const filteredSpeakers = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result = REACT_SUMMIT_SPEAKERS.filter((speaker) => {
      // Name / company search
      if (term) {
        const haystack = `${speaker.name} ${speaker.company}`.toLowerCase()
        if (!haystack.includes(term)) {
          return false
        }
      }
      // Technology / topic tags (ANY selected)
      if (tags.length > 0 && !tags.some((tag) => speaker.tags.includes(tag))) {
        return false
      }
      return true
    })

    const sorted = [...result]
    switch (sort.id) {
      case 'rating-asc':
        sorted.sort((a, b) => a.rating - b.rating)
        break
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'achievements-desc':
        sorted.sort(
          (a, b) =>
            achievementScore(b.achievements) - achievementScore(a.achievements) ||
            b.rating - a.rating,
        )
        break
      case 'points-desc':
      default:
        sorted.sort((a, b) => b.rankingPoints - a.rankingPoints)
        break
    }
    return sorted
  }, [query, tags, sort])

  const hasFilters =
    query.trim().length > 0 || tags.length > 0 || sort.id !== DEFAULT_SORT.id

  const clearFilters = () => {
    setQuery('')
    setTags([])
    setSort(DEFAULT_SORT)
  }


  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content">
        <header className="conferences__header speakers__intro">
          <h1 className="conferences__title speakers__title">
            Meet the world&rsquo;s top{' '}
            <span className="speakers__title-accent">tech speakers</span>
          </h1>
          <p className="conferences__subtitle">
            Engineers, creators, and open-source legends sharing the ideas shaping the future of
            technology.
          </p>
        </header>

        <section className="filters" aria-label="Speaker filters">
          <div className="filters__row">
            <div className="filters__field">
              <label className="filters__label" htmlFor="speaker-search">
                Search
              </label>
              <Input
                id="speaker-search"
                placeholder="Search by name or company"
                value={query}
                onChange={(event) => setQuery(event.value as string)}
              />
            </div>

            <div className="filters__field">
              <label className="filters__label" htmlFor="speaker-tags">
                Technologies & topics
              </label>
              <MultiSelect
                id="speaker-tags"
                data={SPEAKER_TAGS}
                value={tags}
                placeholder="Any technology"
                onChange={(event: MultiSelectChangeEvent) =>
                  setTags(event.value as string[])
                }
              />
            </div>

            <div className="filters__field">
              <label className="filters__label" htmlFor="speaker-sort">
                Sort by
              </label>
              <DropDownList
                id="speaker-sort"
                data={SORT_OPTIONS}
                textField="text"
                dataItemKey="id"
                value={sort}
                onChange={(event: DropDownListChangeEvent) =>
                  setSort(event.value as SortOption)
                }
              />
            </div>

            <div className="filters__field filters__field--action">
              <Button
                fillMode="outline"
                disabled={!hasFilters}
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          </div>
        </section>

        <SpeakerGrid speakers={filteredSpeakers} onSelect={openSpeaker} />
      </main>
    </div>
  )
}
