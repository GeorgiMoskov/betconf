import type { City, Technology } from '../types/conference'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface ConferenceFilterState {
  country: string
  cities: City[]
  dateRange: DateRange
  speakerIds: string[]
  technologies: Technology[]
}

export const ALL_COUNTRIES = 'All countries'

export const COUNTRY_OPTIONS = [
  ALL_COUNTRIES,
  'Netherlands',
  'Germany',
  'Bulgaria',
  'Poland',
]

export const CITY_OPTIONS: City[] = ['Amsterdam', 'Berlin', 'Sofia', 'Warsaw']

export const EMPTY_FILTERS: ConferenceFilterState = {
  country: ALL_COUNTRIES,
  cities: [],
  dateRange: { start: null, end: null },
  speakerIds: [],
  technologies: [],
}
