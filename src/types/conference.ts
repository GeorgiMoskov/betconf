export type Technology =
  | 'React'
  | 'JavaScript'
  | 'TypeScript'
  | 'Node.js'
  | '.NET'
  | 'Go'
  | 'Java'
  | 'Python'
  | 'Angular'
  | 'Vue'
  | 'Svelte'
  | 'Rust'
  | 'DevOps'
  | 'AI'

export type City = 'Amsterdam' | 'Berlin' | 'Sofia' | 'Warsaw'

export type Country = 'Netherlands' | 'Germany' | 'Bulgaria' | 'Poland'

export interface Speaker {
  id: string
  name: string
  company: string
  country: string
  technologies: Technology[]
}

export interface Conference {
  id: string
  title: string
  city: City
  country: Country
  /** ISO date string (YYYY-MM-DD) */
  startDate: string
  /** ISO date string (YYYY-MM-DD) */
  endDate: string
  technologies: Technology[]
  speakerIds: string[]
}
