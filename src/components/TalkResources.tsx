import type { ReactNode } from 'react'
import type { ConferenceTalk } from '../types/speaker'

interface TalkResourcesProps {
  talk: ConferenceTalk
}

type ResourceKind = 'slides' | 'code' | 'recording' | 'demo'

interface Resource {
  kind: ResourceKind
  label: string
  /** Secondary descriptor (file name, repo, duration, host). */
  meta: string
  /** Call-to-action verb shown on the right. */
  action: string
}

function hash(value: string): number {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0
  }
  return h
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Build the deterministic set of dummy resources attached to a talk. */
function resourcesFor(talk: ConferenceTalk): Resource[] {
  const root = hash(talk.id)
  const titleSlug = slug(talk.title)
  const handle = slug(talk.speakerId.split('-')[0] || 'speaker')
  const sizeMb = (3 + (root % 70) / 10).toFixed(1)
  const minutes = 24 + (root % 14)
  const stars = 120 + (root % 880)

  return [
    {
      kind: 'slides',
      label: 'Presentation slides',
      meta: `${titleSlug}-slides.pdf · ${sizeMb} MB`,
      action: 'Download',
    },
    {
      kind: 'code',
      label: 'Source code & examples',
      meta: `github.com/${handle}/${titleSlug} · ★ ${stars.toLocaleString('en-US')}`,
      action: 'View repo',
    },
    {
      kind: 'recording',
      label: 'Talk recording',
      meta: `Full session · ${minutes}:0${root % 6} min`,
      action: 'Watch',
    },
    {
      kind: 'demo',
      label: 'Live demo',
      meta: `${titleSlug}.csb.app · CodeSandbox`,
      action: 'Open',
    },
  ]
}

const ICONS: Record<ResourceKind, ReactNode> = {
  slides: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M6 2.5h7l5 5v14a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13 2.5V8h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.5 13h7M8.5 16.5h7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z" fill="currentColor" />
    </svg>
  ),
  recording: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" />
    </svg>
  ),
  demo: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export function TalkResources({ talk }: TalkResourcesProps) {
  const resources = resourcesFor(talk)

  return (
    <section className="talk-resources">
      <h2 className="speaker-profile__panel-title">Resources</h2>
      <ul className="talk-resources__list">
        {resources.map((resource) => (
          <li key={resource.kind}>
            <a className={`talk-resource talk-resource--${resource.kind}`} href="#">
              <span className="talk-resource__icon" aria-hidden="true">
                {ICONS[resource.kind]}
              </span>
              <span className="talk-resource__text">
                <span className="talk-resource__label">{resource.label}</span>
                <span className="talk-resource__meta">{resource.meta}</span>
              </span>
              <span className="talk-resource__action">
                {resource.action}
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
