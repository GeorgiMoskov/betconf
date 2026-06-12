import { useId } from 'react'
import type { ConferenceTalk } from '../types/speaker'
import { categoryRatings, overallRating } from '../lib/ratings'

interface RatingTimelineProps {
  talks: ConferenceTalk[]
}

interface Point {
  label: string
  date: string
  value: number
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
})

function formatShort(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function RatingTimeline({ talks }: RatingTimelineProps) {
  const gradientId = useId()

  const points: Point[] = talks
    .filter((talk) => typeof talk.rating === 'number')
    .map((talk) => ({
      label: talk.conferenceName,
      date: talk.date,
      value: overallRating(categoryRatings(talk)) ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  if (points.length < 2) {
    return <p className="events-section__empty">Not enough rated conferences to chart a trend.</p>
  }

  const width = 860
  const height = 320
  const padding = { top: 24, right: 70, bottom: 56, left: 78 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const minY = 0
  const maxY = 10
  const x = (i: number) => padding.left + (plotW * i) / (points.length - 1)
  const y = (value: number) =>
    padding.top + plotH - (plotH * (value - minY)) / (maxY - minY)

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(' ')

  const areaPath =
    `M ${x(0).toFixed(1)} ${(padding.top + plotH).toFixed(1)} ` +
    points.map((p, i) => `L ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ') +
    ` L ${x(points.length - 1).toFixed(1)} ${(padding.top + plotH).toFixed(1)} Z`

  const gridValues = [0, 2.5, 5, 7.5, 10]

  return (
    <div className="rating-timeline">
      <svg
        className="rating-timeline__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Overall rating per conference over time"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f8cff" />
            <stop offset="45%" stopColor="#aa3bff" />
            <stop offset="80%" stopColor="#ff8c2f" />
            <stop offset="100%" stopColor="#ffd166" />
          </linearGradient>
          <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(170, 59, 255, 0.28)" />
            <stop offset="100%" stopColor="rgba(170, 59, 255, 0)" />
          </linearGradient>
        </defs>

        {gridValues.map((value) => (
          <g key={value}>
            <line
              className="rating-timeline__grid"
              x1={padding.left}
              x2={width - padding.right}
              y1={y(value)}
              y2={y(value)}
            />
            <text className="rating-timeline__axis-y" x={padding.left - 10} y={y(value) + 4}>
              {value}
            </text>
          </g>
        ))}

        <path className="rating-timeline__area" d={areaPath} fill={`url(#${gradientId}-area)`} />
        <path
          className="rating-timeline__line"
          d={linePath}
          fill="none"
          stroke={`url(#${gradientId}-line)`}
        />

        {points.map((p, i) => (
          <g key={`${p.label}-${p.date}`}>
            <circle
              className="rating-timeline__dot"
              cx={x(i)}
              cy={y(p.value)}
              r={5}
            />
            <text className="rating-timeline__value" x={x(i)} y={y(p.value) - 12}>
              {p.value.toFixed(1)}
            </text>
            <text
              className="rating-timeline__axis-x"
              x={x(i)}
              y={height - padding.bottom + 22}
            >
              {p.label.replace(/\s+\d{4}$/, '')}
            </text>
            <text
              className="rating-timeline__axis-x rating-timeline__axis-x--date"
              x={x(i)}
              y={height - padding.bottom + 40}
            >
              {formatShort(p.date)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
