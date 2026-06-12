import { useState } from 'react'
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns'
import type {
  DropDownListChangeEvent,
  MultiSelectChangeEvent,
} from '@progress/kendo-react-dropdowns'
import { AutoComplete } from '@progress/kendo-react-dropdowns'
import type { AutoCompleteChangeEvent } from '@progress/kendo-react-dropdowns'
import { DateRangePicker } from '@progress/kendo-react-dateinputs'
import type { DateRangePickerChangeEvent } from '@progress/kendo-react-dateinputs'
import { Button, Chip, ChipList } from '@progress/kendo-react-buttons'
import type { City, Technology } from '../types/conference'
import { SPEAKERS } from '../data/speakers'
import { TECHNOLOGIES } from '../data/technologies'
import type { ConferenceFilterState } from '../lib/conferenceFilters'
import {
  ALL_COUNTRIES,
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  EMPTY_FILTERS,
} from '../lib/conferenceFilters'

interface ConferenceFiltersProps {
  filters: ConferenceFilterState
  onChange: (filters: ConferenceFilterState) => void
}

export function ConferenceFilters({ filters, onChange }: ConferenceFiltersProps) {
  const [speakerQuery, setSpeakerQuery] = useState('')

  const availableSpeakers = SPEAKERS.filter(
    (speaker) => !filters.speakerIds.includes(speaker.id),
  )
  const speakerSuggestions = availableSpeakers
    .filter((speaker) => speaker.name.toLowerCase().includes(speakerQuery.toLowerCase()))
    .map((speaker) => speaker.name)

  const handleCountryChange = (e: DropDownListChangeEvent) => {
    onChange({ ...filters, country: e.value as string })
  }

  const handleCitiesChange = (e: MultiSelectChangeEvent) => {
    onChange({ ...filters, cities: e.value as City[] })
  }

  const handleTechChange = (e: MultiSelectChangeEvent) => {
    onChange({ ...filters, technologies: e.value as Technology[] })
  }

  const handleDateChange = (e: DateRangePickerChangeEvent) => {
    onChange({ ...filters, dateRange: { start: e.value.start, end: e.value.end } })
  }

  const handleSpeakerChange = (e: AutoCompleteChangeEvent) => {
    const value = e.value as string
    const matched = availableSpeakers.find(
      (speaker) => speaker.name.toLowerCase() === value.toLowerCase(),
    )
    if (matched) {
      onChange({ ...filters, speakerIds: [...filters.speakerIds, matched.id] })
      setSpeakerQuery('')
    } else {
      setSpeakerQuery(value)
    }
  }

  const removeSpeaker = (id: string) => {
    onChange({ ...filters, speakerIds: filters.speakerIds.filter((s) => s !== id) })
  }

  const selectedSpeakers = filters.speakerIds
    .map((id) => SPEAKERS.find((s) => s.id === id))
    .filter((s): s is (typeof SPEAKERS)[number] => Boolean(s))

  const hasActiveFilters =
    filters.country !== ALL_COUNTRIES ||
    filters.cities.length > 0 ||
    filters.technologies.length > 0 ||
    filters.speakerIds.length > 0 ||
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null

  return (
    <section className="filters" aria-label="Conference filters">
      <div className="filters__row">
        <label className="filters__field">
          <span className="filters__label">Country</span>
          <DropDownList
            data={COUNTRY_OPTIONS}
            value={filters.country}
            onChange={handleCountryChange}
          />
        </label>

        <label className="filters__field">
          <span className="filters__label">City</span>
          <MultiSelect
            data={CITY_OPTIONS}
            value={filters.cities}
            onChange={handleCitiesChange}
            placeholder="All cities"
          />
        </label>

        <label className="filters__field">
          <span className="filters__label">Dates</span>
          <DateRangePicker
            value={filters.dateRange}
            onChange={handleDateChange}
            startDateInputSettings={{ label: '' }}
            endDateInputSettings={{ label: '' }}
          />
        </label>
      </div>

      <div className="filters__row">
        <label className="filters__field">
          <span className="filters__label">Technologies</span>
          <MultiSelect
            data={TECHNOLOGIES}
            value={filters.technologies}
            onChange={handleTechChange}
            placeholder="Any technology"
          />
        </label>

        <label className="filters__field">
          <span className="filters__label">Speakers</span>
          <AutoComplete
            data={speakerSuggestions}
            value={speakerQuery}
            onChange={handleSpeakerChange}
            placeholder="Search speakers…"
          />
        </label>

        {hasActiveFilters && (
          <div className="filters__field filters__field--action">
            <Button fillMode="flat" onClick={() => onChange({ ...EMPTY_FILTERS })}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {selectedSpeakers.length > 0 && (
        <ChipList
          selection="none"
          className="filters__chips"
          data={selectedSpeakers.map((speaker) => ({
            text: speaker.name,
            value: speaker.id,
          }))}
          chip={(props) => (
            <Chip
              {...props}
              removable
              onRemove={() => removeSpeaker(props.dataItem.value as string)}
            />
          )}
        />
      )}
    </section>
  )
}
