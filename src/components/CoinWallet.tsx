import { Link } from 'react-router-dom'
import { CoinIcon } from './CoinIcon'

interface CoinWalletProps {
  /** Current spendable coin balance. */
  balance: number
  /** Optional secondary line, e.g. "465 earned · 310 spent". */
  caption?: string
  /** Render the "Go to shop" call-to-action. */
  shopLink?: boolean
}

/**
 * A modern, card-style coin balance widget — a little "wallet" with a soft
 * gradient, glossy sheen, a watermark coin and an optional shop CTA.
 */
export function CoinWallet({ balance, caption, shopLink = false }: CoinWalletProps) {
  return (
    <div className="coin-wallet">
      <span className="coin-wallet__sheen" aria-hidden="true" />
      <span className="coin-wallet__watermark" aria-hidden="true">
        <CoinIcon size={128} />
      </span>

      <div className="coin-wallet__head">
        <span className="coin-wallet__chip">
          <CoinIcon size={15} />
        </span>
        <span className="coin-wallet__label">FireRaven balance</span>
      </div>

      <div className="coin-wallet__amount">
        <span className="coin-wallet__value">{balance.toLocaleString('en-US')}</span>
        <span className="coin-wallet__unit">credits</span>
      </div>

      {caption && <span className="coin-wallet__caption">{caption}</span>}

      {shopLink && (
        <Link className="coin-wallet__cta" to="/shop">
          Go to shop
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </div>
  )
}
