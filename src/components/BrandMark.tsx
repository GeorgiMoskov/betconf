interface BrandMarkProps {
  /** Visual scale: `sm` for nav bars, `lg` for the landing hero lockup. */
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * The FireRaven Conference Hub wordmark: the product name with the raven logo
 * to its right (see `public/firaven-logo.png`).
 */
export function BrandMark({ size = 'sm', className }: BrandMarkProps) {
  const dimension = size === 'lg' ? 76 : 34
  return (
    <span className={`brand brand--${size}${className ? ` ${className}` : ''}`}>
      <img
        src="/firaven-logo.png"
        alt="FireRaven"
        className="brand__logo"
        width={dimension}
        height={dimension}
        loading="eager"
        decoding="async"
      />
      {size === 'lg' ? (
        <span className="brand__name">
          <span className="brand__name-primary">FireRaven</span>
          <span className="brand__name-sub">Conference Hub</span>
        </span>
      ) : (
        <span className="brand__name">FireRaven Conference Hub</span>
      )}
    </span>
  )
}
