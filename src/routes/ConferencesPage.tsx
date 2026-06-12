import { useMemo, useState } from 'react'
import { Input } from '@progress/kendo-react-inputs'
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns'
import type {
  DropDownListChangeEvent,
  MultiSelectChangeEvent,
} from '@progress/kendo-react-dropdowns'
import { Button } from '@progress/kendo-react-buttons'
import { ConferenceGrid } from '../components/ConferenceGrid'
import { getAllConferences } from '../data/conferenceCatalog'
import type { ConferenceHype } from '../types/speaker'
import { AppHeader } from '../components/AppHeader'

type StatusTab = 'upcoming' | 'past'

type SortId = 'hype-desc' | 'rating-desc' | 'date' | 'speakers-desc'

interface SortOption {
  id: SortId
  text: string
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'hype-desc', text: 'Hottest first' },
  { id: 'rating-desc', text: 'Highest rated' },
  { id: 'date', text: 'By date' },
  { id: 'speakers-desc', text: 'Most speakers' },
]

const DEFAULT_SORT = SORT_OPTIONS[0]

interface HypeOption {
  id: 'any' | ConferenceHype
  text: string
}

const HYPE_OPTIONS: HypeOption[] = [
  { id: 'any', text: 'Any hype level' },
  { id: 'good', text: '🔥 Good or better' },
  { id: 'great', text: '🔥🔥 Great or better' },
  { id: 'exceptional', text: '🔥🔥🔥 Exceptional' },
]

const DEFAULT_HYPE = HYPE_OPTIONS[0]

const HYPE_RANK: Record<ConferenceHype, number> = {
  good: 1,
  great: 2,
  exceptional: 3,
}

const ALL_CONFERENCES = getAllConferences()

const ALL_TECHNOLOGIES = [
  ...new Set(ALL_CONFERENCES.flatMap((c) => c.edition.technologies)),
].sort()

const ALL_LOCATIONS = [...new Set(ALL_CONFERENCES.map((c) => c.edition.location))].sort()

export function ConferencesPage() {
  const [status, setStatus] = useState<StatusTab>('upcoming')
  const [query, setQuery] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [hype, setHype] = useState<HypeOption>(DEFAULT_HYPE)
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT)

  const counts = useMemo(() => {
    let upcoming = 0
    let past = 0
    for (const c of ALL_CONFERENCES) {
      if (c.edition.upcoming) upcoming += 1
      else past += 1
    }
    return { upcoming, past }
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result = ALL_CONFERENCES.filter(({ edition }) => {
      if (edition.upcoming !== (status === 'upcoming')) {
        return false
      }
      if (term) {
        const haystack = `${edition.name} ${edition.brand} ${edition.location}`.toLowerCase()
        if (!haystack.includes(term)) {
          return false
        }
      }
      if (
        technologies.length > 0 &&
        !technologies.some((tech) => edition.technologies.includes(tech))
      ) {
        return false
      }
      if (locations.length > 0 && !locations.includes(edition.location)) {
        return false
      }
      if (hype.id !== 'any') {
        const rank = edition.hype ? HYPE_RANK[edition.hype] : 0
        if (rank < HYPE_RANK[hype.id]) {
          return false
        }
      }
      return true
    })

    const sorted = [...result]
    switch (sort.id) {
      case 'rating-desc':
        sorted.sort((a, b) => (b.edition.rating ?? 0) - (a.edition.rating ?? 0))
        break
      case 'speakers-desc':
        sorted.sort((a, b) => b.speakers.length - a.speakers.length)
        break
      case 'date':
        sorted.sort((a, b) =>
          status === 'upcoming'
            ? a.edition.startDate.localeCompare(b.edition.startDate)
            : b.edition.startDate.localeCompare(a.edition.startDate),
        )
        break
      case 'hype-desc':
      default:
        sorted.sort((a, b) => {
          const hypeDiff =
            (b.edition.hype ? HYPE_RANK[b.edition.hype] : 0) -
            (a.edition.hype ? HYPE_RANK[a.edition.hype] : 0)
          if (hypeDiff !== 0) return hypeDiff
          return (b.edition.rating ?? 0) - (a.edition.rating ?? 0)
        })
        break
    }
    return sorted
  }, [status, query, technologies, locations, hype, sort])

  const hasFilters =
    query.trim().length > 0 ||
    technologies.length > 0 ||
    locations.length > 0 ||
    hype.id !== DEFAULT_HYPE.id ||
    sort.id !== DEFAULT_SORT.id

  const clearFilters = () => {
    setQuery('')
    setTechnologies([])
    setLocations([])
    setHype(DEFAULT_HYPE)
    setSort(DEFAULT_SORT)
  }

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content">
        <header className="conferences__header speakers__intro">
          <h1 className="conferences__title speakers__title">
            Find the conferences{' '}
            <span className="speakers__title-accent">truly worth attending</span>
          </h1>
          <p className="conferences__subtitle">
            Track who&apos;s speaking, how hyped each event is, and the tech that&apos;ll be on
            stage.
          </p>
        </header>

        <div className="conf-tabs" role="tablist" aria-label="Conference status">
          <button
            type="button"
            role="tab"
            aria-selected={status === 'upcoming'}
            className={`conf-tab${status === 'upcoming' ? ' conf-tab--active' : ''}`}
            onClick={() => setStatus('upcoming')}
          >
            Upcoming
            <span className="conf-tab__count">{counts.upcoming}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={status === 'past'}
            className={`conf-tab${status === 'past' ? ' conf-tab--active' : ''}`}
            onClick={() => setStatus('past')}
          >
            Past
            <span className="conf-tab__count">{counts.past}</span>
          </button>
        </div>

        <section className="filters" aria-label="Conference filters">
          <div className="filters__row">
            <div className="filters__field">
              <label className="filters__label" htmlFor="conf-search">
                Search
              </label>
              <Input
                id="conf-search"
                placeholder="Search by name, brand or city"
                value={query}
                onChange={(event) => setQuery(event.value as string)}
              />
            </div>

            <div className="filters__field">
              <label className="filters__label" htmlFor="conf-tech">
                Technologies
              </label>
              <MultiSelect
                id="conf-tech"
                data={ALL_TECHNOLOGIES}
                value={technologies}
                placeholder="Any technology"
                onChange={(event: MultiSelectChangeEvent) =>
                  setTechnologies(event.value as string[])
                }
              />
            </div>

            <div className="filters__field">
              <label className="filters__label" htmlFor="conf-location">
                Location
              </label>
              <MultiSelect
                id="conf-location"
                data={ALL_LOCATIONS}
                value={locations}
                placeholder="Anywhere"
                onChange={(event: MultiSelectChangeEvent) =>
                  setLocations(event.value as string[])
                }
              />
            </div>

            <div className="filters__field">
              <label className="filters__label" htmlFor="conf-hype">
                Hype
              </label>
              <DropDownList
                id="conf-hype"
                data={HYPE_OPTIONS}
                textField="text"
                dataItemKey="id"
                value={hype}
                onChange={(event: DropDownListChangeEvent) =>
                  setHype(event.value as HypeOption)
                }
              />
            </div>

            <div className="filters__field">
              <label className="filters__label" htmlFor="conf-sort">
                Sort by
              </label>
              <DropDownList
                id="conf-sort"
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
              <Button fillMode="outline" disabled={!hasFilters} onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </div>
        </section>

        <ConferenceGrid conferences={filtered} />
      </main>
    </div>
  )
}
