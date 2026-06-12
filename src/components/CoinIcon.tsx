/** A small flame-coin glyph used next to FireRaven coin amounts. */
export function CoinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="coin-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="url(#coinGrad)" />
      <path
        d="M12 6.5c1.2 1.6.4 2.7-.2 3.6-.6.9-.9 1.8-.2 2.9.3-.5.7-.8 1-1.4.6 1 .9 1.8.6 2.8-.4 1.4-1.7 2.1-3 2-1.6-.1-2.8-1.3-2.9-2.9-.1-1.8 1.1-2.9 1.8-4 .7-1.1 1.1-2 .9-3z"
        fill="#1a0e02"
        opacity="0.85"
      />
      <defs>
        <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff5e3a" />
        </linearGradient>
      </defs>
    </svg>
  )
}
