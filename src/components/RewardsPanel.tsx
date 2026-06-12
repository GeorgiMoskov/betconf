import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { CoinIcon } from './CoinIcon'
import {
  COINS_PER_EVENT_ATTENDED,
  COINS_PER_REGISTRATION,
  COINS_PER_REVIEW,
  computeCoins,
} from '../lib/coins'
import { useAccountStore } from '../store/accountStore'

export function RewardsPanel() {
  const navigate = useNavigate()
  const registered = useAccountStore((state) => state.registered)
  const calendar = useAccountStore((state) => state.calendar)
  const reviews = useAccountStore((state) => state.reviews)
  const redeemed = useAccountStore((state) => state.redeemed)

  const coins = useMemo(
    () => computeCoins({ registered, calendar, reviews, redeemed }),
    [registered, calendar, reviews, redeemed],
  )

  const breakdown = [
    { label: 'Welcome bonus', count: 1, rate: coins.welcomeBonus, coins: coins.welcomeBonus },
    {
      label: 'Events attended',
      count: calendar.length,
      rate: COINS_PER_EVENT_ATTENDED,
      coins: coins.fromEvents,
    },
    {
      label: 'Conferences registered',
      count: registered.length,
      rate: COINS_PER_REGISTRATION,
      coins: coins.fromRegistrations,
    },
    {
      label: 'Reviews left',
      count: reviews.length,
      rate: COINS_PER_REVIEW,
      coins: coins.fromReviews,
    },
  ]

  return (
    <section className="account-section rewards" aria-label="FireRaven credits">
      <div className="rewards__top">
        <div className="rewards__balance">
          <span className="rewards__balance-label">FireRaven credits</span>
          <span className="rewards__balance-value">
            <CoinIcon size={26} />
            {coins.balance.toLocaleString('en-US')}
          </span>
          <span className="rewards__balance-meta">
            {coins.earned.toLocaleString('en-US')} earned ·{' '}
            {coins.spent.toLocaleString('en-US')} spent
          </span>
          <Button
            themeColor="primary"
            className="rewards__shop-btn"
            onClick={() => navigate('/shop')}
          >
            Go to shop →
          </Button>
        </div>

        <ul className="rewards__breakdown">
          {breakdown.map((row) => (
            <li key={row.label} className="rewards__breakdown-row">
              <span className="rewards__breakdown-label">{row.label}</span>
              <span className="rewards__breakdown-count">
                {row.label === 'Welcome bonus' ? 'one-time' : `${row.count} × ${row.rate}`}
              </span>
              <span className="rewards__breakdown-coins">
                <CoinIcon />
                {row.coins}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
