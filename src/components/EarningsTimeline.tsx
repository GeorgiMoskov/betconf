import { useId } from 'react'
import type { CumulativePoint } from '../lib/earnings'

interface EarningsTimelineProps {
  points: CumulativePoint[]
}

export function EarningsTimeline({ points }: EarningsTimelineProps) {
  const gradientId = useId()

  if (points.length < 2) {
    return <p className="earnings-log__empty">Not enough history to chart point growth.</p>
  }

  const width = 860
  const height = 300
  const padding = { top: 28, right: 52, bottom: 52, left: 64 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const maxY = points[points.length - 1].total
  const x = (i: number) => padding.left + (plotW * i) / (points.length - 1)
  const y = (value: number) => padding.top + plotH - (plotH * value) / (maxY || 1)

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.total).toFixed(1)}`)
    .join(' ')

  const areaPath =
    `M ${x(0).toFixed(1)} ${(padding.top + plotH).toFixed(1)} ` +
    points.map((p, i) => `L ${x(i).toFixed(1)} ${y(p.total).toFixed(1)}`).join(' ') +
    ` L ${x(points.length - 1).toFixed(1)} ${(padding.top + plotH).toFixed(1)} Z`

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxY * f))
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  // Show at most ~6 x-axis labels to avoid crowding.
  const step = Math.ceil(points.length / 6)

  return (
    <div className="earnings-timeline">
      <svg
        className="earnings-timeline__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Cumulative ranking points over time"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f8cff" />
            <stop offset="50%" stopColor="#aa3bff" />
            <stop offset="100%" stopColor="#ff4cc4" />
          </linearGradient>
          <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(170, 59, 255, 0.32)" />
            <stop offset="100%" stopColor="rgba(79, 140, 255, 0)" />
          </linearGradient>
        </defs>

        {gridValues.map((value, i) => (
          <g key={`${value}-${i}`}>
            <line
              className="earnings-timeline__grid"
              x1={padding.left}
              x2={width - padding.right}
              y1={y(value)}
              y2={y(value)}
            />
            <text className="earnings-timeline__axis-y" x={padding.left - 10} y={y(value) + 4}>
              {compact.format(value)}
            </text>
          </g>
        ))}

        <path className="earnings-timeline__area" d={areaPath} fill={`url(#${gradientId}-area)`} />
        <path
          className="earnings-timeline__line"
          d={linePath}
          fill="none"
          stroke={`url(#${gradientId}-line)`}
        />

        {points.map((p, i) => {
          const showLabel = i % step === 0 || i === points.length - 1
          return (
            <g key={p.key}>
              <circle className="earnings-timeline__dot" cx={x(i)} cy={y(p.total)} r={4} />
              {showLabel && (
                <text
                  className="earnings-timeline__axis-x"
                  x={x(i)}
                  y={height - padding.bottom + 24}
                >
                  {p.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
